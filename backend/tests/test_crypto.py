from app.core.crypto.aes_utils import generate_aes_key, encrypt_file_data, decrypt_file_data
from app.core.crypto.rsa_utils import generate_rsa_keypair, encrypt_aes_key_with_rsa, decrypt_aes_key_with_rsa
from app.core.crypto.hash_utils import compute_sha256

def test_aes_round_trip():
    # Generate AES key
    key = generate_aes_key()
    assert len(key) == 32  # 256 bits
    
    # Encrypt data
    plaintext = b"Highly confidential transmission data."
    ciphertext_with_tag, nonce = encrypt_file_data(key, plaintext)
    
    assert plaintext not in ciphertext_with_tag
    assert len(nonce) == 12
    
    # Decrypt data
    decrypted = decrypt_file_data(key, nonce, ciphertext_with_tag)
    assert decrypted == plaintext

def test_rsa_round_trip():
    # Generate RSA keys
    private_key, public_key = generate_rsa_keypair()
    from app.core.crypto.rsa_utils import serialize_private_key
    private_key_pem = serialize_private_key(private_key)
    
    # Generate a dummy AES key
    aes_key = generate_aes_key()
    
    # Encrypt the AES key with the RSA public key
    encrypted_aes_key = encrypt_aes_key_with_rsa(public_key, aes_key)
    
    # Decrypt the AES key with the RSA private key
    decrypted_aes_key = decrypt_aes_key_with_rsa(private_key, encrypted_aes_key)
    
    assert aes_key == decrypted_aes_key

def test_hashing():
    data = b"Testing SHA-256 integrity."
    file_hash = compute_sha256(data)
    
    assert len(file_hash) == 64  # Hex digest of 256 bits is 64 characters
    
    # Same data must yield same hash
    file_hash_2 = compute_sha256(data)
    assert file_hash == file_hash_2
    
    # Altered data yields different hash
    altered_data = b"Testing SHA-256 integrity!"
    altered_hash = compute_sha256(altered_data)
    assert file_hash != altered_hash
