from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import UserCreate, UserOut, Token
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.core.crypto.rsa_utils import generate_rsa_keypair, serialize_public_key, serialize_private_key
import base64

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    user = db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="User with this email or username already exists"
        )
    
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(deps.get_db)):
    # form_data.username is standard for OAuth2 request, we accept either email or username in it
    user = db.query(User).filter((User.email == form_data.username) | (User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.TOKEN_EXPIRY)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(deps.get_current_user)):
    return current_user

@router.post("/keys/generate")
def generate_keys(current_user: User = Depends(deps.get_current_user), db: Session = Depends(deps.get_db)):
    if current_user.public_key:
        raise HTTPException(status_code=400, detail="Keys already generated for this user")
        
    private_key, public_key = generate_rsa_keypair()
    
    # Store public key in DB (base64 or hex, let's use string for simplicity, or bytes if column is BLOB)
    # The models/user.py public_key column is a String, so we'll store it as base64 encoded PEM
    pub_pem = serialize_public_key(public_key)
    current_user.public_key = base64.b64encode(pub_pem).decode('utf-8')
    db.commit()
    
    priv_pem = serialize_private_key(private_key)
    return {"private_key": priv_pem.decode('utf-8')}
