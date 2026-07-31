from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


app = FastAPI(
    title="Hash4 API",
    description="Backend API for the Hash4 real estate platform",
    version="1.0.0",
)


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


properties = [
    Property(
        id=1,
        title="Premium 2BHK Apartment in Velachery",
        location="Velachery",
        city="Chennai",
        price=7500000,
        bedrooms=2,
        bathrooms=2,
        property_type="Apartment",
        area_sqft=1100,
        description="Modern 2BHK apartment with covered parking and easy access to schools, hospitals, and IT corridors.",
    ),
    Property(
        id=2,
        title="Luxury 3BHK Apartment in Sholinganallur",
        location="Sholinganallur",
        city="Chennai",
        price=12500000,
        bedrooms=3,
        bathrooms=3,
        property_type="Apartment",
        area_sqft=1650,
        description="Spacious 3BHK apartment located near the OMR IT corridor with clubhouse and security facilities.",
    ),
    Property(
        id=3,
        title="Independent Villa in Porur",
        location="Porur",
        city="Chennai",
        price=18000000,
        bedrooms=4,
        bathrooms=4,
        property_type="Villa",
        area_sqft=2400,
        description="Independent villa with private parking and excellent connectivity to major parts of Chennai.",
    ),
]


@app.get("/")
def root():
    return {
        "message": "Welcome to Hash4 API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/properties")
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


@app.get("/properties/{property_id}")
def get_property(property_id: int):
    for property_item in properties:
        if property_item.id == property_id:
            return property_item

    raise HTTPException(
        status_code=404,
        detail="Property not found"
    )