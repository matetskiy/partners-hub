from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(BaseModel):
    id: int
    username: str
    is_admin: bool

    class Config:
        orm_mode = True

class CounterpartyBase(BaseModel):
    name: str
    image: Optional[str] = None
    phone: str
    email: EmailStr
    country: str
    address: Optional[str] = None
    partnership_rating: str
    counterparty_type: str
    tax_number: str
    bank_account: str

class CounterpartyCreate(CounterpartyBase):
    pass

class Counterparty(CounterpartyBase):
    id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
