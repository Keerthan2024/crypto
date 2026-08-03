from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SentFileItem(BaseModel):
    file_id: int
    filename: str
    file_size: int
    created_at: datetime
    share_token: str
    recipient_username: str
    is_used: bool
    expires_at: Optional[datetime]
    status: str

    class Config:
        from_attributes = True

class SentFilesResponse(BaseModel):
    items: List[SentFileItem]
    total: int
    page: int
    size: int

class ReceivedFileItem(BaseModel):
    share_token: str
    sender_username: str
    filename: str
    file_size: int
    created_at: datetime
    expires_at: Optional[datetime]
    is_used: bool
    status: str

    class Config:
        from_attributes = True

class ReceivedFilesResponse(BaseModel):
    items: List[ReceivedFileItem]
    total: int
    page: int
    size: int
