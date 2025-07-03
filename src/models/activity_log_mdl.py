from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
from datetime import datetime

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(String(50), nullable=False)  # 'user_registration', 'payment', 'moderator_created', 'subscription', 'model_purchase', 'message_flagged'
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    related_id = Column(Integer, nullable=True)  # ID of related entity (payment_id, order_id, etc.)
    metadata = Column(JSON, nullable=True)  # Additional data like amounts, plan types, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to user
    user = relationship("User", back_populates="activity_logs")
    
    def __repr__(self):
        return f"<ActivityLog(id={self.id}, type={self.activity_type}, title='{self.title}')>" 