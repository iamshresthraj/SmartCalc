from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api_routes import router

app = FastAPI(title="SmartCalc Financial Learning API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "SmartCalc API is running"}
