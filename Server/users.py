from pydantic import BaseModel
import datetime
import uuid

class UserBase(BaseModel):
    id: uuid.UUID
    username: str
    email: str
    password_hash: str
    display_name: str
    avatar_url: str
    bio: str
    # created_at: datetime.datetime
    # last_seen: datetime.datetime