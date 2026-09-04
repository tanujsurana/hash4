from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import TokenResponse, UserCreate, UserResponse
from app.security import create_access_token, decode_access_token
from app.services import auth_service


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        409: {
            "description": "Email already registered",
        },
        422: {
            "description": "Validation error",
        },
    },
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
    responses={
        401: {
            "description": "Invalid email or password",
        },
        422: {
            "description": "Validation error",
        },
    },
)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    database_session: Session = Depends(get_db),
):
    user = auth_service.authenticate_user(
        database_session=database_session,
        email=form_data.username,
        password=form_data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        subject=str(user.id)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


def get_current_user(
    token: str = Depends(oauth2_scheme),
    database_session: Session = Depends(get_db),
):
    subject = decode_access_token(token)

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = int(subject)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = auth_service.get_user_by_id(
        database_session=database_session,
        user_id=user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    return user


@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        401: {
            "description": "Invalid or expired token",
        },
        403: {
            "description": "Inactive user",
        },
    },
)
def read_current_user(
    current_user=Depends(get_current_user),
):
    return current_user