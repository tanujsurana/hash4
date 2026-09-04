from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, computed_field

from app.services.s3_service import generate_presigned_url
from typing import Literal

class PropertyBase(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200,
    )
    location: str = Field(
        min_length=2,
        max_length=100,
    )
    city: str = Field(
        min_length=2,
        max_length=100,
    )
    price: int = Field(
        gt=0,
    )
    bedrooms: int = Field(
        ge=0,
        le=20,
    )
    bathrooms: int = Field(
        ge=0,
        le=20,
    )
    property_type: str = Field(
        min_length=2,
        max_length=50,
    )
    area_sqft: int = Field(
        gt=0,
    )
    description: str = Field(
        min_length=10,
        max_length=5000,
    )


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )
    location: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    city: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )
    price: int | None = Field(
        default=None,
        gt=0,
    )
    bedrooms: int | None = Field(
        default=None,
        ge=0,
        le=20,
    )
    bathrooms: int | None = Field(
        default=None,
        ge=0,
        le=20,
    )
    property_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )
    area_sqft: int | None = Field(
        default=None,
        gt=0,
    )
    description: str | None = Field(
        default=None,
        min_length=10,
        max_length=5000,
    )
    status: Literal[
    "active",
    "sold",
    "inactive",
] | None = None


class PropertyImageResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    property_id: int
    image_url: str
    created_at: datetime

    @computed_field
    @property
    def signed_url(self) -> str:
        if self.image_url.startswith("properties/"):
            return generate_presigned_url(
                self.image_url
            )

        return self.image_url


class PropertyOwnerResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    name: str


class Property(PropertyBase):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    owner: PropertyOwnerResponse
    images: list[PropertyImageResponse] = []


class UserCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100,
    )
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )



class UserResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    name: str
    email: str
    is_active: bool
    created_at: datetime


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class FavoriteResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    user_id: int
    property_id: int
    created_at: datetime