import type { Property } from "../types/property"
import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL

type PropertyCardProps = {
  property: Property
}

function PropertyCard({ property }: PropertyCardProps) {
  const preferredImage =
    property.images?.find((image) =>
      image.signed_url?.startsWith("http")
    ) ?? property.images?.[0]

  const rawImageUrl = preferredImage?.signed_url

  const imageUrl = rawImageUrl?.startsWith("/uploads/")
    ? `${API_URL}${rawImageUrl}`
    : rawImageUrl

  return (
    <Link
      to={`/properties/${property.id}`}
      className="property-card-link"
    >
      <div className="property-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="property-image"
          />
        ) : (
          <div className="property-image-placeholder">
            No image available
          </div>
        )}

        <h3>{property.title}</h3>

        <p>
          {property.location}, {property.city}
        </p>

        <p className="property-price">
          ₹{property.price.toLocaleString("en-IN")}
        </p>

        <p className="property-details">
          {property.bedrooms} Beds • {property.bathrooms} Baths •{" "}
          {property.area_sqft} sq.ft
        </p>

        <p>{property.property_type}</p>
      </div>
    </Link>
  )
}

export default PropertyCard