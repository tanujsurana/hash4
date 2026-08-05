from pydantic import BaseModel


class Property(BaseModel):
    id: int
    title: str
    location: str
    city: str
    price: int
    bedrooms: int
    bathrooms: int
    property_type: str
    area_sqft: int
    description: str


class PropertyCreate(BaseModel):
    title: str
    location: str
    city: str
    price: int
    bedrooms: int
    bathrooms: int
    property_type: str
    area_sqft: int
    description: str


class PropertyUpdate(BaseModel):
    title: str | None = None
    location: str | None = None
    city: str | None = None
    price: int | None = None
    bedrooms: int | None = None
    bathrooms: int | None = None
    property_type: str | None = None
    area_sqft: int | None = None
    description: str | None = None