from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from typing import List, Annotated
from sqlalchemy.orm import Session
from database import engine, session_local
from users import *
import models
import auth
from auth import get_current_user
from multiprocessing.managers import Token
from datetime import timedelta, datetime
from dependencies import db_dependency, pwd_context

# ---------------- Settings ----------------

app = FastAPI()
app.include_router(auth.router)

origins = ["http://localhost:3000"]

user_dependency = Annotated[dict, Depends(get_current_user)]

models.Base.metadata.create_all(bind=engine)


# ------------------- Routes -------------------

# GET
@app.get("/")
def root():
    return "Hello"

@app.get("/users/{username}")
async def get_user(username: str, db: db_dependency):
        result = db.query(models.User).filter(models.User.username == username).first()
        if result:
            return result
        raise HTTPException(status_code=404, detail="user not found")

@app.get("/me")
async def get_me(user: user_dependency):
    return user

# POST
@app.post("/users")
async def create_user(user: UserBase,  db: db_dependency):
    user_exists = db.query(models.User).filter(models.User.username == user.username).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="username already exists")
    else:
        db_user = models.User(
            username=user.username,
            email=user.email,
            password_hash=pwd_context.hash(user.password_hash),
            display_name=user.display_name,
            avatar_url=user.avatar_url,
            bio=user.bio,
            # created_at=user.created_at.isoformat(),
            # last_seen=user.last_seen.isoformat()
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user



# DELETE
# @app.delete("/users/{user_id}")
# def delete_user(user_id: int):
#         for user in users:
#             if user.id == user_id:
#                 users.remove(user)
#                 return users
#         raise HTTPException(status_code=404, detail="user not found")
    

# PUT
# @app.put("/users/{user_id}")
# def update_user(user_id: int, new_user: User):
#         for user in users:
#             if user.id == user_id:
#                 users[users.index(user)] = new_user
#                 return users    
#         raise HTTPException(status_code=404, detail="user not found")
    
# -----------------------------------------------------------------------------


    