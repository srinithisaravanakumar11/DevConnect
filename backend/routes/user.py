from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserUpdate
from utils import hash_password, verify_password
from fastapi.security import OAuth2PasswordRequestForm
from oauth2 import create_access_token, get_current_user

router = APIRouter()

@router.get("/me")
def get_current_user_profile(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    user = db.query(User).filter(User.user_id == current_user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "location": user.location,
        "skills": user.skills.split(",") if user.skills else [],
        "experience": user.experience,
        "experienceLevel": user.experience,
        "reputation": user.reputation_points or 0,
        "joinedDate": user.created_at.date().isoformat() if user.created_at else None
    }

@router.get("/{username}")
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "location": user.location,
        "skills": user.skills.split(",") if user.skills else [],
        "experience": user.experience,
        "experienceLevel": user.experience,
        "reputation": user.reputation_points or 0,
        "joinedDate": user.created_at.date().isoformat() if user.created_at else None
    }

@router.post("/")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_email = db.query(User).filter(
        User.email == user.email 
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
        
    existing_username = db.query(User).filter(
        User.username == user.username
    ).first()
    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="User with this username already exists"
        )
    
    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        bio=user.bio,
        location=user.location,
        skills=user.skills,
        experience=user.experience
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "user_id": new_user.user_id,
        "username": new_user.username,
        "email": new_user.email,
        "bio": new_user.bio,
        "location": new_user.location,
        "skills": new_user.skills.split(",") if new_user.skills else [],
        "experience": new_user.experience
    }

@router.post("/login")
def login_user(
    user: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Support login with either email or username
    db_user = db.query(User).filter(
        (User.email == user.username) | (User.username == user.username)
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email/username or password"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email/username or password"
        )

    access_token = create_access_token(
        {"user_id": db_user.user_id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.put("/{user_id}")
def update_user(
    user_id: int, 
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    if current_user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this profile"
        )

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user_data.bio is not None:
        user.bio = user_data.bio
    if user_data.location is not None:
        user.location = user_data.location
    if user_data.skills is not None:
        user.skills = user_data.skills
    if user_data.experience is not None:
        if user_data.experience not in ["Beginner", "Intermediate", "Advanced", "Expert"]:
            raise HTTPException(status_code=400, detail="Invalid experience level")
        user.experience = user_data.experience

    db.commit()
    db.refresh(user)

    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "location": user.location,
        "skills": user.skills.split(",") if user.skills else [],
        "experience": user.experience,
        "experienceLevel": user.experience,
        "reputation": user.reputation_points or 0
    }

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        return {"error": "User not found"}

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}