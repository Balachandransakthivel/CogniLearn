from fastapi import APIRouter
from database import behavior

router = APIRouter(prefix="/behavior")

@router.post("/add")
def add_behavior(data: dict):
    behavior.insert_one(data)
    return {"msg": "Behavior Stored"}
