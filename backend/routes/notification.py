from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from oauth2 import get_current_user
from models.notification import Notification

router = APIRouter()

@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    notifications = (
        db.query(Notification)
        .filter(Notification.recipient_user_id == current_user)
        .order_by(Notification.created_at.desc())
        .all()
    )

    return [
        {
            "notification_id": n.notification_id,
            "notification_type": n.notification_type,
            "message": n.message,
            "question_id": n.question_id,
            "is_read": n.is_read,
            "created_at": n.created_at
        }
        for n in notifications
    ]