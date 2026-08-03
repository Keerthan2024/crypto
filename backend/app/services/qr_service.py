import json
import base64
import io
import qrcode
from PIL import Image

def generate_qr_payload(share_token: str, encrypted_aes_key: bytes) -> str:
    """
    Creates a JSON payload for Option B. 
    The encrypted_aes_key is expected to be raw bytes, which we base64 encode for JSON.
    If it's already a base64 string from the database, we can just use it directly.
    """
    if isinstance(encrypted_aes_key, bytes):
        key_str = base64.b64encode(encrypted_aes_key).decode('utf-8')
    else:
        key_str = encrypted_aes_key

    payload = {
        "share_token": share_token,
        "encrypted_aes_key": key_str
    }
    return json.dumps(payload)

def encode_qr_image(payload: str) -> bytes:
    """
    Generates a QR code from the given payload and returns it as PNG bytes.
    """
    qr = qrcode.QRCode(
        version=None, # auto-detect
        error_correction=qrcode.constants.ERROR_CORRECT_L, # low error correction to maximize capacity
        box_size=10,
        border=4,
    )
    qr.add_data(payload)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()
