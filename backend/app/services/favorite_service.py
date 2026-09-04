from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import FavoriteModel


def get_favorite(
    database_session: Session,
    user_id: int,
    property_id: int,
):
    query = select(FavoriteModel).where(
        FavoriteModel.user_id == user_id,
        FavoriteModel.property_id == property_id,
    )

    result = database_session.execute(query)

    return result.scalar_one_or_none()


def add_favorite(
    database_session: Session,
    user_id: int,
    property_id: int,
):
    new_favorite = FavoriteModel(
        user_id=user_id,
        property_id=property_id,
    )

    database_session.add(new_favorite)
    database_session.commit()
    database_session.refresh(new_favorite)

    return new_favorite


def get_user_favorites(
    database_session: Session,
    user_id: int,
):
    query = (
        select(FavoriteModel)
        .where(FavoriteModel.user_id == user_id)
        .order_by(FavoriteModel.created_at.desc())
    )

    result = database_session.execute(query)

    return result.scalars().all()


def remove_favorite(
    database_session: Session,
    favorite_record: FavoriteModel,
):
    database_session.delete(favorite_record)
    database_session.commit()