from pydantic import BaseModel

class AnswerCreate(BaseModel):
    answer_text: str
    question_id: int