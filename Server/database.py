from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from settings import settings

url = f"postgresql+psycopg://{settings['pguser']}:{settings['pgpassword']}@{settings['pghost']}:{settings['pgport']}/{settings['pgdatabase']}"
engine = create_engine(url, echo=False)

session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()

