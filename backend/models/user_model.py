from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str # "student", "parent", or "teacher"
    
class UserLogin(BaseModel):
    email: str
    password: str
