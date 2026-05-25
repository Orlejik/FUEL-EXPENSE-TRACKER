from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# Login schema
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Vehicle schemas
class VehicleBase(BaseModel):
    name: str
    model: str
    license_plate: str

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None
    license_plate: Optional[str] = None

class VehicleResponse(VehicleBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Expense schemas
class ExpenseBase(BaseModel):
    vehicle_id: int
    liters: float
    cost: float
    date: datetime

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    liters: Optional[float] = None
    cost: Optional[float] = None
    date: Optional[datetime] = None

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Stats schemas
class VehicleStats(BaseModel):
    vehicle_id: int
    vehicle_name: str
    total_spent: float
    total_liters: float
    average_cost_per_liter: float
    expense_count: int

class MonthlyStats(BaseModel):
    month: str
    total_spent: float
    total_liters: float
    expense_count: int
