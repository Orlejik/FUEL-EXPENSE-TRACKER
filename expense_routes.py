from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import models, schemas
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.post("/", response_model=schemas.ExpenseResponse)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Verify vehicle belongs to user
    vehicle = db.query(models.Vehicle).filter(
        models.Vehicle.id == expense.vehicle_id,
        models.Vehicle.user_id == current_user.id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db_expense = models.Expense(**expense.dict(), user_id=current_user.id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.get("/", response_model=list[schemas.ExpenseResponse])
def get_expenses(vehicle_id: int = Query(None), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Expense).filter(models.Expense.user_id == current_user.id)
    if vehicle_id:
        query = query.filter(models.Expense.vehicle_id == vehicle_id)
    return query.order_by(models.Expense.date.desc()).all()

@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(expense_id: int, expense: schemas.ExpenseUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    update_data = expense.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense

@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

@router.get("/stats/vehicle-stats", response_model=list[schemas.VehicleStats])
def get_vehicle_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    vehicles = db.query(models.Vehicle).filter(models.Vehicle.user_id == current_user.id).all()
    
    stats = []
    for vehicle in vehicles:
        expenses = db.query(models.Expense).filter(models.Expense.vehicle_id == vehicle.id).all()
        total_spent = sum(e.cost for e in expenses) if expenses else 0
        total_liters = sum(e.liters for e in expenses) if expenses else 0
        avg_cost = (total_spent / total_liters) if total_liters > 0 else 0
        
        stats.append(schemas.VehicleStats(
            vehicle_id=vehicle.id,
            vehicle_name=vehicle.name,
            total_spent=total_spent,
            total_liters=total_liters,
            average_cost_per_liter=avg_cost,
            expense_count=len(expenses)
        ))
    
    return stats

@router.get("/stats/total-spent")
def get_total_spent(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    total = db.query(func.sum(models.Expense.cost)).filter(models.Expense.user_id == current_user.id).scalar() or 0
    return {"total_spent": total}
