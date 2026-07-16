# import psycopg

# connection = None
# cursor = None

# try:
#     connection = psycopg.connect(
#         host="localhost",
#         port=5432,
#         dbname="VloConvo",
#         user="VloConvo",
#         password="convo1234"
#     )
#     cursor = connection.cursor()
#     print("Connected to the database successfully!")

#     cursor = connection.cursor()
#     cursor.execute("SELECT version();")
#     db_version = cursor.fetchone()
#     print("Database version:", db_version)

# except Exception as e:
#     print("Error connecting to the database:", e)


# --------------------------------------------------------------

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

settings = {
    "pguser": "postgres",
    "pgpassword": "convo1234",
    "pghost": "localhost",
    "pgport": 5432,
    "pgdatabase": "VloConvo"
}

def get_engine(settings):
    url = f"postgresql+psycopg://{settings['pguser']}:{settings['pgpassword']}@{settings['pghost']}:{settings['pgport']}/{settings['pgdatabase']}"
    engine = create_engine(url, echo=False)
    return engine

engine = get_engine(settings)
session_local = sessionmaker(bind=engine)

def get_session():
    return session_local()

session = get_session()
try:
    result = session.execute(text("SELECT version();"))
    print(result.fetchone())
finally:
    session.close()

print("Database version:", result.fetchone())