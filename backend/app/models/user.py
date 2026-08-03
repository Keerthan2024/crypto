import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    public_key = Column(String, nullable=True) # nullable until keypair generated
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    files = relationship("File", back_populates="owner", cascade="all, delete-orphan")
    shares_sent = relationship("Share", foreign_keys="[Share.sender_id]", back_populates="sender", cascade="all, delete-orphan")
    shares_received = relationship("Share", foreign_keys="[Share.recipient_id]", back_populates="recipient", cascade="all, delete-orphan")
