import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Share(Base):
    __tablename__ = "shares"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    share_token = Column(String, unique=True, index=True, nullable=False)
    encrypted_key = Column(String, nullable=False) # base64
    qr_payload = Column(String, nullable=True)
    is_used = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    # Relationships
    file = relationship("File", back_populates="shares")
    sender = relationship("User", foreign_keys=[sender_id], back_populates="shares_sent")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="shares_received")
    download_logs = relationship("DownloadLog", back_populates="share", cascade="all, delete-orphan")
