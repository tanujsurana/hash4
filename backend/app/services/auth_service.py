from sqlalchemy import select
from sqlalchemy.orm import Session
from app.security import hash_password, verify_password

from app.models import UserModel
from app.schemas import UserCreate
from app.security import hash_password


def get_user_by_email( 
    database_session: Session,
    email: str,
):
    query = select(UserModel).where(
        UserModel.email == email
    )

    result = database_session.execute(query)

    return result.scalar_one_or_none()


def create_user(
    database_session: Session,
    user_data: UserCreate,
):
    new_user = UserModel(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )

    database_session.add(new_user)
    database_session.commit()
    database_session.refresh(new_user)

    return new_user

def authenticate_user(
    database_session: Session,
    email: str,
    password: str,
):
    user = get_user_by_email(
        database_session=database_session,
        email=email,
    )

    if user is None:
        return None

    if not verify_password(
        password,
        user.hashed_password,
    ):
        return None

    return user