from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session
from database import session_local
from passlib.context import CryptContext


def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]



pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)