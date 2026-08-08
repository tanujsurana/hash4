"""create properties table

Revision ID: 5ec91a3e088c
Revises: 
Create Date: 2026-08-08 18:14:07.987028

"""
"""create properties table"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# Keep the generated revision value from your file.
revision: str = "5ec91a3e088c"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "properties",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("location", sa.String(length=100), nullable=False),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.Column("bedrooms", sa.Integer(), nullable=False),
        sa.Column("bathrooms", sa.Integer(), nullable=False),
        sa.Column(
            "property_type",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column("area_sqft", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_properties_id"),
        "properties",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_properties_location"),
        "properties",
        ["location"],
        unique=False,
    )

    op.create_index(
        op.f("ix_properties_city"),
        "properties",
        ["city"],
        unique=False,
    )

    op.create_index(
        op.f("ix_properties_price"),
        "properties",
        ["price"],
        unique=False,
    )

    op.create_index(
        op.f("ix_properties_property_type"),
        "properties",
        ["property_type"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_properties_property_type"),
        table_name="properties",
    )

    op.drop_index(
        op.f("ix_properties_price"),
        table_name="properties",
    )

    op.drop_index(
        op.f("ix_properties_city"),
        table_name="properties",
    )

    op.drop_index(
        op.f("ix_properties_location"),
        table_name="properties",
    )

    op.drop_index(
        op.f("ix_properties_id"),
        table_name="properties",
    )

    op.drop_table("properties")