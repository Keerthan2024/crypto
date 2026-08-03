import os
import base64
import logging
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session
from cryptography.exceptions import InvalidTag

from app.models.share import Share
from app.models.file import File
from app.models.download_log import DownloadLog
from app.core.crypto.aes_utils import decrypt_file_data
from app.core.crypto.rsa_utils import decrypt_aes_key_with_rsa, load_private_key
from app.core.crypto.hash_utils import compute_sha256

logger = logging.getLogger(__name__)


def validate_share(db: Session, share_token: str, current_user_id: int) -> Share:
    """
    Checks that the share is valid (exists, matches recipient, not used, not expired).
    Note: SQLite doesn't support SELECT FOR UPDATE row-level locking.
    We use application-level atomicity (check + mark in same DB transaction) instead.
    For PostgreSQL in production, switch back to .with_for_update().
    """
    share = db.query(Share).filter(Share.share_token == share_token).first()

    if not share:
        raise HTTPException(status_code=404, detail="Share token not found")

    if share.recipient_id != current_user_id:
        logger.warning(f"Recipient mismatch: expected {share.recipient_id}, got {current_user_id}")
        raise HTTPException(status_code=403, detail="You are not the intended recipient of this share")

    if share.is_used:
        raise HTTPException(status_code=400, detail="This link has already been used. One-time download links cannot be reused.")

    if share.expires_at and share.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This share link has expired")

    return share


def decrypt_and_stream_file(db: Session, share: Share, private_key_pem: str, ip_address: str | None):
    """
    Uses the recipient's private key to decrypt the file and returns the plaintext bytes.
    Marks the share as used atomically and logs the download.
    """
    # Load and validate the private key immediately — fail fast on bad key
    try:
        # Strip any extra whitespace/carriage returns that might come from browser copy-paste
        cleaned_pem = private_key_pem.strip().replace('\r\n', '\n').replace('\r', '\n')
        private_key = load_private_key(cleaned_pem.encode('utf-8'))
    except Exception as e:
        logger.error(f"Failed to load private key: {type(e).__name__}: {e}")
        _log_download(db, share.id, ip_address, "failed")
        raise HTTPException(status_code=400, detail=f"Invalid private key format: {type(e).__name__}")

    # Decrypt the AES key
    try:
        encrypted_aes_key = base64.b64decode(share.encrypted_key)
        aes_key = decrypt_aes_key_with_rsa(private_key, encrypted_aes_key)
    except ValueError as e:
        logger.error(f"RSA decryption failed: {e}")
        _log_download(db, share.id, ip_address, "failed")
        raise HTTPException(status_code=400, detail="Private key does not match. Wrong key used for decryption.")

    # Read encrypted file from disk
    file_record: File = share.file
    if not os.path.exists(file_record.stored_path):
        logger.error(f"Encrypted file not found: {file_record.stored_path}")
        _log_download(db, share.id, ip_address, "failed")
        raise HTTPException(status_code=500, detail="Encrypted file not found on server. It may have been deleted.")

    with open(file_record.stored_path, "rb") as f:
        raw = f.read()

    # First 12 bytes are the nonce (prepended during upload in file_service.py)
    nonce = raw[:12]
    ciphertext_with_tag = raw[12:]
    logger.info(f"Raw file size: {len(raw)}, nonce: {len(nonce)}, cipher: {len(ciphertext_with_tag)}")

    # Decrypt the file with AES-GCM — if ciphertext was tampered, this will raise InvalidTag
    try:
        plaintext = decrypt_file_data(aes_key, nonce, ciphertext_with_tag)
    except InvalidTag:
        logger.error("AES-GCM authentication tag failed — file may have been tampered")
        _log_download(db, share.id, ip_address, "failed")
        raise HTTPException(status_code=400, detail="File integrity check failed. The encrypted file may have been tampered with.")

    # SHA-256 integrity verification
    recovered_hash = compute_sha256(plaintext)
    logger.info(f"Stored hash: {file_record.sha256_hash}, Recovered hash: {recovered_hash}")
    if recovered_hash != file_record.sha256_hash:
        logger.error("SHA-256 hash mismatch after decryption")
        _log_download(db, share.id, ip_address, "failed")
        raise HTTPException(status_code=400, detail="File hash mismatch. Integrity verification failed.")

    # Atomically mark share as used BEFORE returning the file
    share.is_used = True
    _log_download(db, share.id, ip_address, "success")
    db.commit()

    return plaintext, file_record.filename, file_record.content_type


def _log_download(db: Session, share_id: int, ip_address: str | None, status: str):
    try:
        log = DownloadLog(share_id=share_id, ip_address=ip_address, status=status)
        db.add(log)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to log download: {e}")
