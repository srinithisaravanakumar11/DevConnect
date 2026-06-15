from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy import Enum
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    bio = Column(Text)
    location = Column(String(100))
    profile_pic = Column(String(255))
    skills = Column(Text)

    experience = Column(
    Enum(
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
        name="experience_level"
    ),
    nullable=False,
    default="Beginner"
)

    reputation_points = Column(Integer, default=0)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )