from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import PropertyImageModel, PropertyModel
from app.schemas import PropertyCreate, PropertyUpdate
from app.services.s3_service import (
    upload_property_image,
    delete_property_image as delete_s3_property_image,
)

def get_properties(
    database_session: Session,
    location: str | None = None,
    city: str | None = None,
    bedrooms: int | None = None,
    property_type: str | None = None,
    min_price: int | None = None,
    max_price: int | None = None,
    search: str | None = None,
    sort_by: str = "id",
    sort_order: str = "asc",
    page: int = 1,
    page_size: int = 10,
):
    query = select(PropertyModel)

    if location:
        query = query.where(
            PropertyModel.location.ilike(f"%{location}%")
        )

    if city:
        query = query.where(
            PropertyModel.city.ilike(f"%{city}%")
        )

    if bedrooms is not None:
        query = query.where(
            PropertyModel.bedrooms == bedrooms
        )

    if property_type:
        query = query.where(
            PropertyModel.property_type.ilike(f"%{property_type}%")
        )

    if min_price is not None:
        query = query.where(
            PropertyModel.price >= min_price
        )

    if max_price is not None:
        query = query.where(
            PropertyModel.price <= max_price
        )

    if search:
        search_pattern = f"%{search}%"

        query = query.where(
            PropertyModel.title.ilike(search_pattern)
            | PropertyModel.location.ilike(search_pattern)
            | PropertyModel.city.ilike(search_pattern)
            | PropertyModel.description.ilike(search_pattern)
        )

    allowed_sort_fields = {
        "id": PropertyModel.id,
        "price": PropertyModel.price,
        "created_at": PropertyModel.created_at,
        "bedrooms": PropertyModel.bedrooms,
        "area_sqft": PropertyModel.area_sqft,
    }

    sort_column = allowed_sort_fields.get(
        sort_by,
        PropertyModel.id,
    )

    if sort_order.lower() == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    offset = (page - 1) * page_size

    query = query.offset(offset).limit(page_size)

    result = database_session.execute(query)

    return result.scalars().all()

def get_property(
    database_session: Session,
    property_id: int,
):
    return database_session.get(
        PropertyModel,
        property_id,
    )


def create_property(
    database_session: Session,
    property_data: PropertyCreate,
    owner_id: int,
):
    new_property = PropertyModel(
        **property_data.model_dump(),
        owner_id=owner_id,
    )

    database_session.add(new_property)
    database_session.commit()
    database_session.refresh(new_property)

    return new_property


def update_property(
    database_session: Session,
    property_record: PropertyModel,
    property_data: PropertyUpdate,
):
    update_data = property_data.model_dump(
        exclude_unset=True
    )

    for field_name, field_value in update_data.items():
        setattr(
            property_record,
            field_name,
            field_value,
        )

    database_session.commit()
    database_session.refresh(property_record)

    return property_record


def delete_property(
    database_session: Session,
    property_record: PropertyModel,
):
    database_session.delete(property_record)
    database_session.commit()


def save_property_image(
    database_session: Session,
    property_record: PropertyModel,
    image_file: UploadFile,
):
    image_key = upload_property_image(image_file)

    new_image = PropertyImageModel(
        property_id=property_record.id,
        image_url=image_key,
    )

    database_session.add(new_image)
    database_session.commit()
    database_session.refresh(new_image)

    return new_image


def get_property_image(
    database_session: Session,
    image_id: int,
):
    return database_session.get(
        PropertyImageModel,
        image_id,
    )


def delete_property_image(
    database_session: Session,
    image_record: PropertyImageModel,
):
    delete_s3_property_image(
        image_record.image_url
    )

    database_session.delete(image_record)
    database_session.commit()
    
def get_user_properties(
    database_session: Session,
    owner_id: int,
):
    query = (
        select(PropertyModel)
        .where(PropertyModel.owner_id == owner_id)
        .order_by(PropertyModel.created_at.desc())
    )

    result = database_session.execute(query)

    return result.scalars().all()