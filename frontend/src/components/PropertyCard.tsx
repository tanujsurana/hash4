import { Link } from "react-router-dom"

import type { Property } from "../types/property"

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
      <article className="property-card">
        <div className="property-card-image-wrapper">
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

          <span className="property-type-badge">
            {property.property_type}
          </span>
        </div>

        <div className="property-card-content">
          <h3>{property.title}</h3>

          <p className="property-location">
            {property.location}, {property.city}
          </p>

          <p className="property-price">
            ₹{property.price.toLocaleString("en-IN")}
          </p>

          <div className="property-meta">
            <span>{property.bedrooms} Beds</span>
            <span>{property.bathrooms} Baths</span>
            <span>{property.area_sqft} sq.ft</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PropertyCard