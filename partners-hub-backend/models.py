from sqlalchemy import Column, Integer, String, Float, Boolean, Enum
from database import Base
from sqlalchemy.dialects.postgresql import ENUM

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

class Counterparty(Base):
    __tablename__ = "counterparty"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)  # Название
    image = Column(String, nullable=True)  # Картинка
    phone = Column(String, nullable=False)  # Телефон
    email = Column(String, nullable=False, unique=True)  # Email
    country = Column(String, nullable=False)  # Страна (выборка)
    address = Column(String, nullable=True)  # Адрес
    partnership_rating = Column(
        String, nullable=False
    )  # Выгода сотрудничества (выборка)
    counterparty_type = Column(
        String, nullable=False
    )  # Тип контрагента (физ. лицо, юр. лицо, ИП)
    tax_number = Column(String, nullable=False, unique=True)  # УНП/ИНН
    bank_account = Column(String, nullable=False, unique=True)  # Расчетный счет
