from fastapi import FastAPI
from routes.user import router as user_router
from routes.question import router as question_router
from database import Base, engine
from models.question import Question
from routes.answer import router as answer_router
from models.answer import Answer
from models.notification import Notification
from fastapi.middleware.cors import CORSMiddleware
from routes.notification import router as notification_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevConnect API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",
        "http://localhost:5174",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    user_router,
    prefix="/users",
    tags=["Users"]
)

app.include_router(
    question_router,
    prefix="/questions",
    tags=["Questions"]
)

app.include_router(
    answer_router,
    prefix="/answers",
    tags=["Answers"]
)

app.include_router(
    notification_router,
    prefix="/notifications",
    tags=["Notifications"]
)

@app.get("/")
def home():
    return {
        "message": "DevConnect Backend Running"
    }