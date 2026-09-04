from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import UserModel
from app.routers.auth import get_current_user
from app.schemas import Property, PropertyCreate, PropertyUpdate, PropertyImageResponse
from app.services import property_service

from typing import Annotated
from typing import Literal

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status

router = APIRouter(
    prefix="/properties",
    tags=["Properties"],
)


@router.get(
    "",
    response_model=list[Property],
)
def get_properties(
    location: str | None = None,
    city: str | None = None,
    bedrooms: int | None = Query(default=None, ge=0, le=20),
    property_type: str | None = None,
    min_price: int | None = Query(default=None, ge=0),
    max_price: int | None = Query(default=None, ge=0),
    search: str | None = None,
    sort_by: Literal[
        "id",
        "price",
        "created_at",
        "bedrooms",
        "area_sqft",
    ] = "id",
    sort_order: Literal[
        "asc",
        "desc",
    ] = "asc",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    database_session: Session = Depends(get_db),
):
    if (
    min_price is not None
    and max_price is not None
    and min_price > max_price
    ):
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="min_price cannot be greater than max_price",
    )
    return property_service.get_properties(
        database_session=database_session,
        location=location,
        city=city,
        bedrooms=bedrooms,
        property_type=property_type,
        min_price=min_price,
        max_price=max_price,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )
    
@router.post(
    "",
    response_model=Property,
    status_code=status.HTTP_201_CREATED,
)
def create_property(
    property_data: PropertyCreate,
    database_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    return property_service.create_property(
        database_session=database_session,
        property_data=property_data,
        owner_id=current_user.id,
    )

@router.get(
    "/my-properties",
    response_model=list[Property],
)
def get_my_properties(
    database_session: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    return property_service.get_user_properties(
        database_session=database_session,
        owner_id=current_user.id,
    )

@router.get(
    "/{property_id}",
    response_model=Property,
)
def get_property(
    property_id: int,
    database_session: Session = Depends(get_db),
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

    return property_record


@router.patch(
    "/{property_id}",
    response_model=Property,
)
def update_property(
    property_id: int,
    property_data: PropertyUpdate,
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

    if property_record.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this property",
        )

    return property_service.update_property(
        database_session=database_session,
        property_record=property_record,
        property_data=property_data,
    )


@router.delete(
    "/{property_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_property(
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

    if property_record.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this property",
        )

    property_service.delete_property(
        database_session=database_session,
        property_record=property_record,
    )
@router.post(
    "/{property_id}/images",
    response_model=PropertyImageResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_property_image(
    property_id: int,
    image_file: UploadFile = File(...),
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

    if property_record.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to upload images for this property",
        )

    allowed_content_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if image_file.content_type not in allowed_content_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG, and WEBP images are allowed",
        )

    return property_service.save_property_image(
        database_session=database_session,
        property_record=property_record,
        image_file=image_file,
    )
    
@router.delete(
    "/{property_id}/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_property_image(
    property_id: int,
    image_id: int,
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

    if property_record.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete images from this property",
        )

    image_record = property_service.get_property_image(
        database_session=database_session,
        image_id=image_id,
    )

    if image_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )

    if image_record.property_id != property_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image does not belong to this property",
        )

    property_service.delete_property_image(
        database_session=database_session,
        image_record=image_record,
    )
    
@router.post(
    "/{property_id}/images/multiple",
    response_model=list[PropertyImageResponse],
    status_code=status.HTTP_201_CREATED,
)
def upload_multiple_property_images(
    property_id: int,
    image_files: Annotated[list[UploadFile], File(...)] = [],
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

    if property_record.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to upload images for this property",
        )

    allowed_content_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    uploaded_images = []

    for image_file in image_files:
        if image_file.content_type not in allowed_content_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {image_file.filename}",
            )

        image_record = property_service.save_property_image(
            database_session=database_session,
            property_record=property_record,
            image_file=image_file,
        )

        uploaded_images.append(image_record)

    return uploaded_images