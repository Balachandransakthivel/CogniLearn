from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

def create_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm="HS256")
