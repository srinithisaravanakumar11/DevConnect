from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from oauth2 import get_current_user

class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    recipient_user_id = Column(Integer, ForeignKey("users.user_id"))
    sender_user_id = Column(Integer, ForeignKey("users.user_id"))

    notification_type = Column(String)
    message = Column(String)
    question_id = Column(
        Integer,
        ForeignKey("questions.question_id"),
        nullable=True
    )
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

