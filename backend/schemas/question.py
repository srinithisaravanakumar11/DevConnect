from pydantic import BaseModel

class QuestionCreate(BaseModel):
    title: str
    description: str
    category: str