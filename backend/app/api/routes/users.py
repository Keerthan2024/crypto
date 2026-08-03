from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List

from app.api import deps
from app.models.user import User
from app.models.file import File
from app.models.share import Share
from app.schemas.dashboard import SentFilesResponse, SentFileItem, ReceivedFilesResponse, ReceivedFileItem

router = APIRouter()

def derive_status(is_used: bool, expires_at: datetime) -> str:
    if is_used:
        return "Downloaded"
    if expires_at and expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return "Expired"
    return "Active"

@router.get("/me/files/sent", response_model=SentFilesResponse)
def get_sent_files(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Returns files the user has sent, joined with their share status.
    """
    offset = (page - 1) * size

    query = db.query(File, Share, User.username.label("recipient_username"))\
        .join(Share, File.id == Share.file_id)\
        .join(User, Share.recipient_id == User.id)\
        .filter(File.owner_id == current_user.id)\
        .order_by(File.created_at.desc())

    total = query.count()
    results = query.offset(offset).limit(size).all()

    items = []
    for file, share, recipient_username in results:
        items.append(SentFileItem(
            file_id=file.id,
            filename=file.filename,
            file_size=file.file_size,
            created_at=file.created_at,
            share_token=share.share_token,
            recipient_username=recipient_username,
            is_used=share.is_used,
            expires_at=share.expires_at,
            status=derive_status(share.is_used, share.expires_at)
        ))

    return SentFilesResponse(
        items=items,
        total=total,
        page=page,
        size=size
    )

@router.get("/me/files/received", response_model=ReceivedFilesResponse)
def get_received_files(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Returns shares where the current user is the recipient.
    """
    offset = (page - 1) * size

    query = db.query(Share, File, User.username.label("sender_username"))\
        .join(File, Share.file_id == File.id)\
        .join(User, Share.sender_id == User.id)\
        .filter(Share.recipient_id == current_user.id)\
        .order_by(Share.created_at.desc())

    total = query.count()
    results = query.offset(offset).limit(size).all()

    items = []
    for share, file, sender_username in results:
        items.append(ReceivedFileItem(
            share_token=share.share_token,
            sender_username=sender_username,
            filename=file.filename,
            file_size=file.file_size,
            created_at=share.created_at,
            expires_at=share.expires_at,
            is_used=share.is_used,
            status=derive_status(share.is_used, share.expires_at)
        ))

    return ReceivedFilesResponse(
        items=items,
        total=total,
        page=page,
        size=size
    )
