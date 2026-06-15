# DevConnect Backend

A backend API for a developer community platform built using FastAPI and PostgreSQL.

## Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Question Creation
- Answer Creation
- PostgreSQL Database Integration

## Tech Stack

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Uvicorn

## API Endpoints

### User

POST /users/register
POST /users/login

### Questions

GET /questions
POST /questions

### Answers

GET /answers
POST /answers

## Installation

```bash
git clone https://github.com/srinithisaravanakumar11/DevConnect.git
cd DevConnect

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

## Author

Srinithi Saravanakumar
