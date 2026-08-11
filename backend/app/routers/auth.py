from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import UserCreate, UserResponse
from app.services import auth_service
from app.schemas import (
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.security import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_data: UserCreate,
    database_session: Session = Depends(get_db),
):
    existing_user = auth_service.get_user_by_email(
        database_session=database_session,
        email=user_data.email,
    )

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    return auth_service.create_user(
        database_session=database_session,
        user_data=user_data,
    )
    
@router.post(
    "/login",
    response_model=TokenResponse,
)
def login_user(
    login_data: UserLogin,
    database_session: Session = Depends(get_db),
):
    user = auth_service.authenticate_user(
        database_session=database_session,
        email=login_data.email,
        password=login_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        subject=str(user.id)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }