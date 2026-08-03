import os
import uuid
import base64
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from app.models.file import File
from app.models.share import Share
from app.models.user import User
from app.core.crypto.hash_utils import compute_sha256
from app.core.crypto.aes_utils import generate_aes_key, encrypt_file_data
from app.core.crypto.rsa_utils import encrypt_aes_key_with_rsa, load_public_key
from app.core.config import settings

STORAGE_DIR = os.path.join(os.path.dirname(__file__), '..', 'storage')

def process_file_upload(db: Session, upload_file: UploadFile, sender: User, recipient_username: str, expiry_hours: int = 24) -> str:
    # 1. Find recipient
    recipient = db.query(User).filter(User.username == recipient_username).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
        
    if not recipient.public_key:
        raise HTTPException(status_code=400, detail="Recipient has not generated their encryption keys yet")

    # 2. Read file (for 100MB max limit, in-memory is fine for this scope)
    file_bytes = upload_file.file.read()
    if len(file_bytes) > 100 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 100MB)")
        
    # 3. Compute original hash
    file_hash = compute_sha256(file_bytes)
    
    # 4. Generate AES key and encrypt file
    aes_key = generate_aes_key()
    ciphertext_with_tag, nonce = encrypt_file_data(aes_key, file_bytes)
    
    # 5. Save encrypted file to disk using UUID
    file_uuid = str(uuid.uuid4())
    stored_path = os.path.join(STORAGE_DIR, f"{file_uuid}.enc")
    
    with open(stored_path, "wb") as f:
        # Prepend nonce to ciphertext on disk for easy retrieval during decryption
        f.write(nonce)
        f.write(ciphertext_with_tag)
        
    # 6. Encrypt AES key for recipient
    recipient_pub_key_pem = base64.b64decode(recipient.public_key)
    pub_key_obj = load_public_key(recipient_pub_key_pem)
    encrypted_aes_key = encrypt_aes_key_with_rsa(pub_key_obj, aes_key)
    
    # 7. Database entries
    new_file = File(
        owner_id=sender.id,
        filename=upload_file.filename,
        stored_path=stored_path,
        file_size=len(file_bytes),
        sha256_hash=file_hash
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)
    
    # Generate unique share token
    share_token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(hours=expiry_hours)
    
    new_share = Share(
        file_id=new_file.id,
        sender_id=sender.id,
        recipient_id=recipient.id,
        share_token=share_token,
        encrypted_key=base64.b64encode(encrypted_aes_key).decode('utf-8'),  # Store as base64 string
        expires_at=expires_at
    )
    db.add(new_share)
    db.commit()
    
    return share_token
