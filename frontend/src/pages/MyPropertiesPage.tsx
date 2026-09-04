import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { apiRequest } from "../services/api"
import type { Property } from "../types/property"

const API_URL = import.meta.env.VITE_API_URL

function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadMyProperties() {
      try {
        const data = await apiRequest("/properties/my-properties")
        setProperties(data)
      } catch {
        setError("Failed to load your properties")
      } finally {
        setLoading(false)
      }
    }

    loadMyProperties()
  }, [])

  if (loading) {
    return (
      <div className="page">
        <p>Loading your properties...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>My Properties</h1>

      <Link to="/create-property" className="create-property-button">
        + Create Property
      </Link>

      {properties.length === 0 ? (
        <p>You have not listed any properties yet.</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => {
            const preferredImage =
              property.images.find((image) =>
                image.signed_url?.startsWith("http")
              ) ?? property.images[0]

            const rawImageUrl = preferredImage?.signed_url

            const imageUrl = rawImageUrl?.startsWith("/uploads/")
              ? `${API_URL}${rawImageUrl}`
              : rawImageUrl

            return (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="property-card-link"
              >
                <div className="property-card">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="property-image"
                      onError={(event) => {
                        event.currentTarget.style.display = "none"
                      }}
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
          })}
        </div>
      )}
    </div>
  )
}

export default MyPropertiesPage