from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, behavior

app = FastAPI(title="CogniLearn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router)
app.include_router(behavior.router)

@app.get("/")
def home():
    return {"message": "CogniLearn Backend Running"}
