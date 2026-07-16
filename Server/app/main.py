from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
users= []

class User(BaseModel):
    username: str
    id: int



# GET
@app.get("/")
def root():
    return users

@app.get("/users/{user_id}")
def get_user(user_id: int):
        for user in users:
            if user.id == user_id:
                return user
        raise HTTPException(status_code=404, detail="user not found")


# POST
@app.post("/users")
def create_user(user: User):
    users.append(user)
    return users


# DELETE
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
        for user in users:
            if user.id == user_id:
                users.remove(user)
                return users
        raise HTTPException(status_code=404, detail="user not found")
    

# PUT
@app.put("/users/{user_id}")
def update_user(user_id: int, new_user: User):
        for user in users:
            if user.id == user_id:
                users[users.index(user)] = new_user
                return users    
        raise HTTPException(status_code=404, detail="user not found")
    
# -----------------------------------------------------------------------------


    