import hashlib

def compute_sha256(data: bytes) -> str:
    """Computes the SHA-256 hash of the given data."""
    return hashlib.sha256(data).hexdigest()
