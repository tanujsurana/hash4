from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import UserModel
from app.routers.auth import get_current_user
from app.schemas import FavoriteResponse
from app.services import favorite_service, property_service


router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"],
)


@router.post(
    "/{property_id}",
    response_model=FavoriteResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_favorite(
    property_id: int,
    database_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    property_record = property_service.get_property(
        database_session=database_session,
        property_id=property_id,
    )

    if property_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    existing_favorite = favorite_service.get_favorite(
        database_session=database_session,
        user_id=current_user.id,
        property_id=property_id,
    )

    if existing_favorite is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property is already in favorites",
        )

    return favorite_service.add_favorite(
        database_session=database_session,
        user_id=current_user.id,
        property_id=property_id,
    )


@router.get(
    "",
    response_model=list[FavoriteResponse],
)
def get_favorites(
    database_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    return favorite_service.get_user_favorites(
        database_session=database_session,
        user_id=current_user.id,
    )


@router.delete(
    "/{property_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_favorite(
    property_id: int,
    database_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    favorite_record = favorite_service.get_favorite(
        database_session=database_session,
        user_id=current_user.id,
        property_id=property_id,
    )

    if favorite_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found",
        )

    favorite_service.remove_favorite(
        database_session=database_session,
        favorite_record=favorite_record,
    )