from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File as FastAPIFile, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api import deps
from app.models.user import User
from app.models.share import Share
from app.models.file import File
from app.services.file_service import process_file_upload
from app.services.download_service import validate_share, decrypt_and_stream_file
import os

router = APIRouter()


# ─── Upload ──────────────────────────────────────────────────────────────────

@router.post("/upload")
def upload_file(
    file: UploadFile = FastAPIFile(...),
    recipient_username: str = Form(...),
    expiry_hours: int = Form(24),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Uploads a file, encrypts it, and shares it with the specified recipient.
    Returns the share_token which can be used to generate the QR code.
    """
    try:
        share_token = process_file_upload(
            db=db,
            upload_file=file,
            sender=current_user,
            recipient_username=recipient_username,
            expiry_hours=expiry_hours
        )
        return {"share_token": share_token, "message": "File securely uploaded and shared"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Share Status ─────────────────────────────────────────────────────────────

@router.get("/share/{share_token}/status")
def get_share_status(share_token: str, db: Session = Depends(deps.get_db)):
    """
    Returns the status of a share link. Publicly accessible (no auth required)
    so the recipient can check the status before even logging in.
    """
    share = db.query(Share).filter(Share.share_token == share_token).first()

    if not share:
        raise HTTPException(status_code=404, detail="Share token not found")

    if share.is_used:
        return {"status": "used", "message": "This link has already been used"}

    if share.expires_at and share.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return {"status": "expired", "message": "This link has expired"}

    return {"status": "valid", "message": "Link is valid and ready to use"}


# ─── Download ─────────────────────────────────────────────────────────────────

class DownloadRequest(BaseModel):
    private_key: str


@router.post("/share/{share_token}/download")
def download_file(
    share_token: str,
    body: DownloadRequest,
    request: Request,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Decrypts and streams the file to the authenticated recipient.
    Enforces: recipient-only access, one-time use (atomic row lock), expiry, and SHA-256 integrity.
    """
    share = validate_share(db, share_token, current_user.id)
    ip_address = request.client.host if request.client else None

    plaintext, filename, content_type = decrypt_and_stream_file(
        db=db,
        share=share,
        private_key_pem=body.private_key,
        ip_address=ip_address
    )

    media_type = content_type or "application/octet-stream"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}

    return Response(content=plaintext, media_type=media_type, headers=headers)

# ─── Delete ───────────────────────────────────────────────────────────────────

@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Deletes a file and its associated shares. Only the owner can delete the file.
    """
    file_obj = db.query(File).filter(File.id == file_id).first()
    if not file_obj:
        raise HTTPException(status_code=404, detail="File not found")
        
    if file_obj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this file")
        
    # Delete physical file
    if os.path.exists(file_obj.stored_path):
        try:
            os.remove(file_obj.stored_path)
        except OSError:
            pass
            
    # Delete from DB (Shares are cascade deleted)
    db.delete(file_obj)
    db.commit()
    
    return {"message": "File successfully deleted"}
