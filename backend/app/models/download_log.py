import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class DownloadLog(Base):
    __tablename__ = "download_logs"

    id = Column(Integer, primary_key=True, index=True)
    share_id = Column(Integer, ForeignKey("shares.id", ondelete="CASCADE"), nullable=False, index=True)
    ip_address = Column(String, nullable=True)
    status = Column(String, nullable=False) # success/failed/expired
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    share = relationship("Share", back_populates="download_logs")
