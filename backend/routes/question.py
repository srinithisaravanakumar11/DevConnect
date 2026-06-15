from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.notification import Notification
from models.question import Question
from models.user import User
from models.answer import Answer
from schemas.question import QuestionCreate
from oauth2 import get_current_user

router = APIRouter()

@router.get("/")
def get_questions(db: Session = Depends(get_db)):
    # Join with User table to fetch the username of the question author
    questions = db.query(Question, User).join(User, Question.user_id == User.user_id).all()

    result = []
    for q, u in questions:
        # Fetch answers for this question
        answers_query = db.query(Answer, User).join(User, Answer.user_id == User.user_id).filter(Answer.question_id == q.question_id).all()
        answers_list = []
        for ans, ans_user in answers_query:
            answers_list.append({
                "id": f"a{ans.answer_id}",
                "author": ans_user.username,
                "content": ans.answer_text,
                "datePosted": "Just now",
                "timestamp": int(ans.created_at.timestamp() * 1000) if ans.created_at else 0,
                "accepted": ans.is_accepted or False
            })

        result.append({
            "id": f"q{q.question_id}",
            "title": q.title,
            "description": q.description,
            "category": q.tags if q.tags else q.category,
            "author": u.username,
            "views": q.views_count or 0,
            "votes": q.votes_count or 0,
            "status": "Solved" if q.status == "Answered" else (q.status or "Unsolved"),
            "datePosted": "Just now",
            "timestamp": int(q.created_at.timestamp() * 1000) if q.created_at else 0,
            "answers": answers_list,
            "comments": [],
            "upvotedBy": [] # Simple empty list to satisfy frontend logic
        })

    # Sort questions by timestamp descending (newest first)
    result.sort(key=lambda x: x["timestamp"], reverse=True)
    return result

@router.post("/")
def create_question(
    question: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    # Map frontend categories to PostgreSQL enum values
    category_lower = question.category.lower()
    db_category = "Other"
    db_tags = question.category

    if category_lower in ["react", "javascript", "typescript", "html/css", "frontend"]:
        db_category = "Frontend"
    elif category_lower in ["python", "java", "node.js", "express.js", "go", "ruby", "backend"]:
        db_category = "Backend"
    elif category_lower in ["sql", "database"]:
        db_category = "Database"
    elif category_lower in ["ai/ml", "ai_ml"]:
        db_category = "AI_ML"

    new_question = Question(
        title=question.title,
        description=question.description,
        category=db_category,
        tags=db_tags,
        user_id=current_user,
        views_count=0,
        votes_count=0,
        status="Open"
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return {
        "question_id": new_question.question_id,
        "title": new_question.title,
        "description": new_question.description,
        "category": new_question.tags if new_question.tags else new_question.category,
        "user_id": new_question.user_id
    }

@router.post("/{question_id}/vote")
def vote_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.question_id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question.votes_count = (question.votes_count or 0) + 1

    if question.user_id != current_user_id:
        sender = db.query(User).filter(User.user_id == current_user_id).first()
        notification = Notification(
            recipient_user_id=question.user_id,
            sender_user_id=current_user_id,
            notification_type="question_upvote",
            question_id=question.question_id,
            message=f"{sender.username} upvoted your question"
        )
        db.add(notification)

    db.commit()
    db.refresh(question)
    return {"votes": question.votes_count}

@router.post("/{question_id}/view")
def increment_view(
    question_id: int,
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(
        Question.question_id == question_id
    ).first()

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    question.views_count = (
        question.views_count or 0
    ) + 1

    db.commit()
    db.refresh(question)

    return {
        "views": question.views_count
    }

@router.get("/test-token")
def test_token(
    current_user: int = Depends(get_current_user)
):
    return {
        "user_id": current_user
    }