from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

from pydantic import field_validator
import re

class UserCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    password: str

    @field_validator('phone')
    @classmethod
    def normalize_phone(cls, v):
        digits = re.sub(r'\D', '', v)
        if digits.startswith('91') and len(digits) == 12:
            digits = digits[2:]
        if not re.fullmatch(r'[6-9]\d{9}', digits):
            raise ValueError('Enter a valid 10-digit Indian mobile number')
        return f'+91{digits}'

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    fcm_token: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str]
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
