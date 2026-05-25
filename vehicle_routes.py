from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.post("/", response_model=schemas.VehicleResponse)
def create_vehicle(vehicle: schemas.VehicleCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_vehicle = models.Vehicle(**vehicle.dict(), user_id=current_user.id)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@router.get("/", response_model=list[schemas.VehicleResponse])
def get_vehicles(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Vehicle).filter(models.Vehicle.user_id == current_user.id).all()

@router.get("/{vehicle_id}", response_model=schemas.VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    vehicle = db.query(models.Vehicle).filter(
        models.Vehicle.id == vehicle_id,
        models.Vehicle.user_id == current_user.id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.put("/{vehicle_id}", response_model=schemas.VehicleResponse)
def update_vehicle(vehicle_id: int, vehicle: schemas.VehicleUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_vehicle = db.query(models.Vehicle).filter(
        models.Vehicle.id == vehicle_id,
        models.Vehicle.user_id == current_user.id
    ).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    update_data = vehicle.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_vehicle, key, value)
    
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_vehicle = db.query(models.Vehicle).filter(
        models.Vehicle.id == vehicle_id,
        models.Vehicle.user_id == current_user.id
    ).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(db_vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}
