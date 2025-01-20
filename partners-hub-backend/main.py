from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine, get_db
import models, schemas, auth
from datetime import timedelta
import base64
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/counterparties", response_model=list[schemas.Counterparty])
async def get_counterparties(db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    counterparties = db.query(models.Counterparty).all()
    return counterparties

@app.post("/counterparties", response_model=schemas.Counterparty)
async def add_counterparty(counterparty: schemas.CounterpartyCreate, db: Session = Depends(get_db),
                           current_user: schemas.User = Depends(auth.get_current_active_user)):
    print("HELP")
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Создание записи контрагента в базе данных
    db_counterparty = models.Counterparty(**counterparty.dict())  # Передаем данные из схемы
    db.add(db_counterparty)
    db.commit()
    db.refresh(db_counterparty)
    return db_counterparty


@app.post("/upload-image")
async def upload_image(image: str, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        image_data = base64.b64decode(image)
        return {"message": "Image uploaded successfully"}
    except:
        raise HTTPException(status_code=400, detail="Invalid image data")

@app.delete("/counterparties/{counterparty_id}")
async def delete_counterparty(
    counterparty_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(auth.get_current_active_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    counterparty = db.query(models.Counterparty).filter(models.Counterparty.id == counterparty_id).first()
    if not counterparty:
        raise HTTPException(status_code=404, detail="Counterparty not found")

    db.delete(counterparty)
    db.commit()

    return {"message": "Counterparty deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

