from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
import auth_routes
import vehicle_routes
import expense_routes

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fuel Expense Tracker API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_routes.router)
app.include_router(vehicle_routes.router)
app.include_router(expense_routes.router)

@app.get("/")
def read_root():
    return {"message": "Fuel Expense Tracker API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
