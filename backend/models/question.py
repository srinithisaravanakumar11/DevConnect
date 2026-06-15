from sqlalchemy import Column, Enum, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class Question(Base):
    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(
        Enum(
            "Frontend",
            "Backend",
            "Database",
            "DevOps",
            "AI_ML",
            "Mobile",
            "Other",
            name="question_category"
        ),
        nullable=False
    )
    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )
    views_count = Column(Integer, default=0)
    votes_count = Column(Integer, default=0)
    status = Column(
        Enum(
            "Open",
            "Answered",
            "Closed",
            name="question_status"
        ),
        default="Open"
    )
    tags = Column(String(255), nullable=True)
    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )
