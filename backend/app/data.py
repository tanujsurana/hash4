from app.schemas import Property


properties = [
    Property(
        id=1,
        title="Premium 2BHK Apartment in Velachery",
        location="Velachery",
        city="Chennai",
        price=7_500_000,
        bedrooms=2,
        bathrooms=2,
        property_type="Apartment",
        area_sqft=1100,
        description=(
            "Modern 2BHK apartment with covered parking and easy access "
            "to schools, hospitals, and IT corridors."
        ),
    ),
    Property(
        id=2,
        title="Luxury 3BHK Apartment in Sholinganallur",
        location="Sholinganallur",
        city="Chennai",
        price=12_500_000,
        bedrooms=3,
        bathrooms=3,
        property_type="Apartment",
        area_sqft=1650,
        description=(
            "Spacious 3BHK apartment located near the OMR IT corridor "
            "with clubhouse and security facilities."
        ),
    ),
    Property(
        id=3,
        title="Independent Villa in Porur",
        location="Porur",
        city="Chennai",
        price=18_000_000,
        bedrooms=4,
        bathrooms=4,
        property_type="Villa",
        area_sqft=2400,
        description=(
            "Independent villa with private parking and excellent "
            "connectivity to major parts of Chennai."
        ),
    ),
]