from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, require_admin
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter(prefix="/api/customers", tags=["Customers"])

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/", response_model=List[UserOut], dependencies=[Depends(require_admin)])
def list_customers(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "customer").offset(skip).limit(limit).all()

@router.get("/{customer_id}", response_model=UserOut, dependencies=[Depends(require_admin)])
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")
    return user
