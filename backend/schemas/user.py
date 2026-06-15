from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[str] = None
    experience: str = "Beginner"

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None