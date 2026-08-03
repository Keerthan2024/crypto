from app.core.crypto.aes_utils import generate_aes_key, encrypt_file_data, decrypt_file_data
from app.core.crypto.rsa_utils import encrypt_aes_key_with_rsa, decrypt_aes_key_with_rsa
from app.core.crypto.hash_utils import compute_sha256

def simulate_hybrid_encryption(plaintext: bytes, recipient_public_key):
    # 1. Compute SHA-256
    original_hash = compute_sha256(plaintext)
    
    # 2. Generate AES key
    aes_key = generate_aes_key()
    
    # 3. Encrypt file with AES
    ciphertext, nonce = encrypt_file_data(aes_key, plaintext)
    
    # 4. Encrypt AES key with RSA
    encrypted_aes_key = encrypt_aes_key_with_rsa(recipient_public_key, aes_key)
    
    return ciphertext, nonce, encrypted_aes_key, original_hash

def simulate_hybrid_decryption(ciphertext: bytes, nonce: bytes, encrypted_aes_key: bytes, recipient_private_key):
    # 1. Decrypt AES key with RSA
    aes_key = decrypt_aes_key_with_rsa(recipient_private_key, encrypted_aes_key)
    
    # 2. Decrypt file with AES
    plaintext = decrypt_file_data(aes_key, nonce, ciphertext)
    
    # 3. Recompute hash
    recovered_hash = compute_sha256(plaintext)
    
    return plaintext, recovered_hash
