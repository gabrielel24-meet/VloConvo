from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, text
from database import base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class User(base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)    
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, index=True)
    display_name = Column(String, index=True)
    avatar_url = Column(String, index=True)
    bio = Column(String, index=True)
    # created_at = Column(String, index=True)
    # last_seen = Column(String, index=True)