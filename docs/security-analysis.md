# Security Analysis & Threat Model

SecureShare implements a Zero-Trust influenced security model. This document explicitely maps the cryptographic mechanisms to the specific cyber threats they mitigate.

## 1. Threat: Data Breach of the Storage Server
**Attack Vector:** An attacker gains unauthorized access to the `storage/` directory where physical files are kept, or dumps the SQLite database.
**Defense: AES-256 (GCM Mode)**
- Every uploaded file is instantly encrypted in memory using a uniquely generated 256-bit AES key before it is ever written to the disk.
- The `.enc` files stored on the server are mathematically impossible to decipher without the key.
- GCM (Galois/Counter Mode) provides Authenticated Encryption, meaning it also guarantees the ciphertext hasn't been modified.

## 2. Threat: Man-In-The-Middle (MITM) & Key Exposure
**Attack Vector:** An attacker intercepts the network request where the AES key is transmitted from the sender to the server, or the server to the receiver.
**Defense: Hybrid Cryptography (RSA-2048)**
- While AES is fast enough to encrypt the payload, transmitting the AES key itself is dangerous.
- SecureShare uses **RSA Asymmetric Encryption**. When a user registers, they generate a public/private key pair. 
- The sender encrypts the AES key using the *Recipient's Public Key*.
- The encrypted AES key is stored in the database. When the recipient downloads the file, only their *Private Key* (which never leaves their browser) can decrypt the AES key.
- **Bonus Mitigation**: HTTPS/TLS is mandated by the Nginx proxy to encrypt the outer tunnel.

## 3. Threat: File Tampering / Corruption
**Attack Vector:** A malicious actor (or failing hard drive) modifies the bits of the encrypted payload in the storage directory to attempt to inject malware or corrupt the data.
**Defense: SHA-256 Hashing**
- Before encryption, the backend calculates a SHA-256 hash of the original file bytes.
- This hash is stored in the database.
- Upon decryption, the recipient can independently verify the hash. Furthermore, AES-GCM's built-in authentication tag will automatically fail decryption if a single bit of the ciphertext has been altered.

## 4. Threat: Replay Attacks & Link Leaking
**Attack Vector:** A recipient accidentally forwards their download link (or QR code) to a third party, or an attacker steals the link from their browser history.
**Defense: One-Time-Use Share Tokens**
- Share tokens are randomly generated UUIDv4 strings (making brute-force guessing impossible).
- The moment a recipient successfully downloads and decrypts the file, the `is_used` boolean in the database is flipped to `True`.
- Any subsequent attempt to use the same token or QR code is strictly rejected by the API with a `400 Bad Request`.

## 5. Threat: Unauthorized API Access
**Attack Vector:** An attacker attempts to query the `/users/me/files/sent` endpoint to view a victim's upload history.
**Defense: JWT (JSON Web Tokens)**
- All sensitive API routes are protected by OAuth2 Bearer tokens.
- Tokens expire automatically after 30 minutes.
- Without a cryptographically signed JWT issued by the `/auth/login` endpoint, the API will return a `401 Unauthorized` response.
