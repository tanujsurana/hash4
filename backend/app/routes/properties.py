from fastapi import APIRouter, HTTPException, status

from app.data import properties
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
):
    filtered_properties = properties

    if location:
        filtered_properties = [
            property_item
            for property_item in filtered_properties
            if property_item.location.lower() == location.lower()
        ]

    if bedrooms is not None:
        filtered_properties = [
            property_item
            for property_item in filtered_properties
            if property_item.bedrooms == bedrooms
        ]

    if max_price is not None:
        filtered_properties = [
            property_item
            for property_item in filtered_properties
            if property_item.price <= max_price
        ]

    return filtered_properties


@router.post(
    "",
    response_model=Property,
    status_code=status.HTTP_201_CREATED,
)
def create_property(property_data: PropertyCreate):
    new_id = max(
        (property_item.id for property_item in properties),
        default=0,
    ) + 1

    new_property = Property(
        id=new_id,
        **property_data.model_dump(),
    )

    properties.append(new_property)

    return new_property


@router.get("/{property_id}", response_model=Property)
def get_property(property_id: int):
    for property_item in properties:
        if property_item.id == property_id:
            return property_item

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Property not found",
    )


@router.patch("/{property_id}", response_model=Property)
def update_property(
    property_id: int,
    property_data: PropertyUpdate,
):
    for index, property_item in enumerate(properties):
        if property_item.id == property_id:
            update_data = property_data.model_dump(exclude_unset=True)

            updated_property = property_item.model_copy(
                update=update_data
            )

            properties[index] = updated_property

            return updated_property

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Property not found",
    )