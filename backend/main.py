from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from typing import List

# Please set your MONGODB_URL environment variable containing your Atlas connection string
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority")

app = FastAPI(title="CogniLearn API")

# Enable CORS for the mobile app bridging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = AsyncIOMotorClient(MONGODB_URL)
db = client.cognilearn # Creates/connects to a database named 'cognilearn'

class DemoUser(BaseModel):
    role: str
    name: str

@app.on_event("startup")
async def startup_db_client():
    try:
        # Ping the database to verify the connection
        await client.admin.command('ping')
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.get("/")
async def root():
    return {"message": "Welcome to CogniLearn API!"}

@app.get("/health")
async def health_check():
    try:
        await client.admin.command('ping')
        return {"status": "Database connection is healthy!"}
    except Exception:
        raise HTTPException(status_code=503, detail="Database connection failed")

# Add a simple endpoint to test writing data to Atlas
@app.post("/test-data")
async def add_test_data(user: DemoUser):
    new_user = await db["users"].insert_one(user.model_dump())
    return {"message": "User added successfully", "id": str(new_user.inserted_id)}

@app.get("/test-data", response_model=List[DemoUser])
async def get_test_data():
    users = await db["users"].find().to_list(100)
    return users
