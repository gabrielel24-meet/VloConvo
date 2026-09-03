from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime,text
from datetime import datetime
from database import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)    
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, index=True)
    display_name = Column(String, index=True)
    avatar_url = Column(String, index=True)
    bio = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    last_seen = Column(DateTime, index=True)

class Server(Base):
    __tablename__ = "servers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)    
    name = Column(String, index=True)
    description = Column(String)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class ServerMember(Base):
    __tablename__ = "server_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)
    server_id = Column(UUID(as_uuid=True), ForeignKey("servers.id"), index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    role = Column(String, default="member", index=True)
    joined_at = Column(DateTime, default=datetime.utcnow, index=True)

class Channel(Base):
    __tablename__ = "channels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)    
    name = Column(String, index=True)
    server_id = Column(UUID(as_uuid=True), ForeignKey("servers.id"), index=True)
    type = Column(String, index=True)  # "text" or "voice"
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"), index=True)    
    content = Column(String)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    channel_id = Column(UUID(as_uuid=True), ForeignKey("channels.id"), index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    edited_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=True)
    replay_to = Column(UUID(as_uuid=True), ForeignKey("messages.id"), index=True, nullable=True)
    is_deleted = Column(Boolean, default=False, index=True)