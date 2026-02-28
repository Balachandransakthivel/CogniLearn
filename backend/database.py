from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))

db = client["cognilearn_db"]

users = db["users"]
behavior = db["behavior"]
