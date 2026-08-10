from passlib.context import CryptContext
import bcrypt


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

password_hash = pwd_context.hash("string")

if pwd_context.verify("string", password_hash):
    print("Password is valid")