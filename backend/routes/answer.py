from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.answer import Answer
from models.question import Question
from schemas.answer import AnswerCreate
from oauth2 import get_current_user
from models.notification import Notification
from models.user import User

router = APIRouter()

@router.get("/")
def get_answers(db: Session = Depends(get_db)):
    answers = db.query(Answer).all()

    return [
        {
            "answer_id": a.answer_id,
            "answer_text": a.answer_text,
            "question_id": a.question_id,
            "user_id": a.user_id
        }
        for a in answers
    ]

@router.post("/")
def create_answer(
    answer: AnswerCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):

    new_answer = Answer(
        answer_text=answer.answer_text,
        question_id=answer.question_id,
        user_id=current_user,
        votes_count=0,
        is_accepted=False
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    
    # Get question information
    question = db.query(Question).filter(
        Question.question_id == answer.question_id
    ).first()

    # Create notification for question owner
    if question and question.user_id != current_user:

        sender = db.query(User).filter(
            User.user_id == current_user
        ).first()

        print("CREATING NOTIFICATION")
        print("Recipient:", question.user_id)
        print("Sender:", current_user)

        notification = Notification(
            recipient_user_id=question.user_id,
            sender_user_id=current_user,
            notification_type="answer",
            message=f"{sender.username} answered your question"
        )

        db.add(notification)
        db.commit()
        print("NOTIFICATION SAVED")

    return {
        "answer_id": new_answer.answer_id,
        "answer_text": new_answer.answer_text,
        "question_id": new_answer.question_id,
        "user_id": new_answer.user_id
    }

@router.post("/{answer_id}/accept")
def accept_answer(
    answer_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    answer = db.query(Answer).filter(Answer.answer_id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    question = db.query(Question).filter(Question.question_id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    if question.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Only the question author can accept an answer")

    # Unaccept all other answers for this question
    db.query(Answer).filter(Answer.question_id == question.question_id).update({"is_accepted": False})

    answer.is_accepted = True
    question.status = "Answered"

    if answer.user_id != current_user_id:
        question_owner = db.query(User).filter(User.user_id == current_user_id).first()
        notification = Notification(
            recipient_user_id=answer.user_id,
            sender_user_id=current_user_id,
            notification_type="accepted_answer",
            message=f"{question_owner.username} accepted your answer"
        )

        db.add(notification)

    db.commit()
    db.refresh(answer)
    db.refresh(question)

    return {"message": "Answer accepted successfully"}