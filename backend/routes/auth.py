from fastapi import APIRouter, HTTPException, status
from database import users
from models.user_model import UserCreate, UserLogin
from utils.auth_utils import hash_password, verify_password
from utils.jwt_handler import create_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register(user: UserCreate):
    existing_user = users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    
    users.insert_one(user_dict)
    
    # Do not return the hashed password
    del user_dict["password"]
    user_dict["_id"] = str(user_dict["_id"])
    
    return {"msg": "User Registered Successfully", "user": user_dict}

@router.post("/login")
def login(user: UserLogin):
    db_user = users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # create payload for token
    token_payload = {
        "user_id": str(db_user["_id"]),
        "role": db_user.get("role", "student")
    }
    
    token = create_token(token_payload)
    
    return {
        "access_token": token,
        "role": db_user.get("role", "student"),
        "token_type": "bearer",
        "username": db_user.get("username", "Unknown")
    }

@router.get("/users")
def get_users():
    all_users = list(users.find({}, {"_id": 0, "password": 0}))
    return all_users
