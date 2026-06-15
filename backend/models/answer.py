from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.sql import func
from database import Base

class Answer(Base):
    __tablename__ = "answers"

    answer_id = Column(Integer, primary_key=True, index=True)
    answer_text = Column(Text, nullable=False)
    question_id = Column(
        Integer,
        ForeignKey("questions.question_id"),
        nullable=False
    )
    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )
    votes_count = Column(Integer, default=0)
    is_accepted = Column(Boolean, default=False)
    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )