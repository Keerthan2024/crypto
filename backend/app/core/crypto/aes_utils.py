import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def generate_aes_key() -> bytes:
    """Generates a random 256-bit AES key."""
    return AESGCM.generate_key(bit_length=256)

def encrypt_file_data(key: bytes, plaintext: bytes) -> tuple[bytes, bytes]:
    """
    Encrypts plaintext using AES-256-GCM.
    Returns a tuple of (ciphertext_with_tag, nonce).
    """
    # GCM mode requires a unique 96-bit (12-byte) nonce per encryption
    nonce = os.urandom(12)
    aesgcm = AESGCM(key)
    ciphertext_with_tag = aesgcm.encrypt(nonce, plaintext, None)
    return ciphertext_with_tag, nonce

def decrypt_file_data(key: bytes, nonce: bytes, ciphertext_with_tag: bytes) -> bytes:
    """
    Decrypts AES-256-GCM encrypted data.
    """
    aesgcm = AESGCM(key)
    plaintext = aesgcm.decrypt(nonce, ciphertext_with_tag, None)
    return plaintext
