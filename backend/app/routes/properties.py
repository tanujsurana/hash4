from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PropertyModel
from app.schemas import Property, PropertyCreate, PropertyUpdate


router = APIRouter(
    prefix="/properties",
    tags=["Properties"],
)


@router.get("", response_model=list[Property])
def get_properties(
    location: str | None = None,
    bedrooms: int | None = None,
    max_price: int | None = None,
    database_session: Session = Depends(get_db),
):
    query = select(PropertyModel)

    if location:
        query = query.where(
            PropertyModel.location.ilike(location)
        )

    if bedrooms is not None:
        query = query.where(
            PropertyModel.bedrooms == bedrooms
        )

    if max_price is not None:
        query = query.where(
            PropertyModel.price <= max_price
        )

    query = query.order_by(PropertyModel.id)

    result = database_session.execute(query)

    return result.scalars().all()


@router.post(
    "",
    response_model=Property,
    status_code=status.HTTP_201_CREATED,
)
def create_property(
    property_data: PropertyCreate,
    database_session: Session = Depends(get_db),
):
    new_property = PropertyModel(
        **property_data.model_dump()
    )

    database_session.add(new_property)
    database_session.commit()
    database_session.refresh(new_property)

    return new_property


@router.get("/{property_id}", response_model=Property)
def get_property(
    property_id: int,
    database_session: Session = Depends(get_db),
):
    property_record = database_session.get(
        PropertyModel,
        property_id,
    )

    if property_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

    return property_record


@router.patch("/{property_id}", response_model=Property)
def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    database_session: Session = Depends(get_db),
):
    property_record = database_session.get(
        PropertyModel,
        property_id,
    )

    if property_record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found",
        )

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