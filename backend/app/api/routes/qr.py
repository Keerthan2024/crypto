from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.api import deps
from app.models.share import Share
from app.models.user import User
from app.services.qr_service import generate_qr_payload, encode_qr_image

router = APIRouter()

@router.get("/share/{share_token}/qr")
def get_share_qr(
    share_token: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Returns a PNG image of the QR code containing the share token and encrypted AES key.
    Only the sender of the share is authorized to view this QR code to show to the recipient.
    """
    share = db.query(Share).filter(Share.share_token == share_token).first()
    
    if not share:
        raise HTTPException(status_code=404, detail="Share not found")
        
    if share.sender_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this share's QR")
        
    if share.is_used:
        raise HTTPException(status_code=400, detail="This share link has already been used")
        
    # Generate QR Payload (Option B approach)
    payload_json = generate_qr_payload(share.share_token, share.encrypted_key)
    
    # Encode as PNG
    qr_png_bytes = encode_qr_image(payload_json)
    
    return Response(content=qr_png_bytes, media_type="image/png")
