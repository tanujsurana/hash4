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
    <div className="page my-properties-page">
      <section className="my-properties-header">
        <div>
          <p className="section-eyebrow">YOUR LISTINGS</p>

          <h1>My Properties</h1>

          <p className="my-properties-subtitle">
            Manage your property listings, update details, and add new homes.
          </p>
        </div>

        <Link to="/create-property" className="create-property-button">
          + Create Property
        </Link>
      </section>

      <div className="my-properties-summary">
        <div>
          <span className="summary-number">{properties.length}</span>
          <span className="summary-label">
            {properties.length === 1 ? "Property listed" : "Properties listed"}
          </span>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="my-properties-empty">
          <h2>No properties yet</h2>

          <p>
            Create your first property listing and it will appear here.
          </p>

          <Link to="/create-property" className="create-property-button">
            + Create Property
          </Link>
        </div>
      ) : (
        <div className="my-properties-grid">
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
                className="my-property-card"
              >
                <div className="my-property-image-wrapper">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="my-property-image"
                      onError={(event) => {
                        event.currentTarget.style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="my-property-image-placeholder">
                      No image available
                    </div>
                  )}

                  <span className="my-property-type">
                    {property.property_type}
                  </span>

                  <span
                    className={`my-property-status my-property-status-${property.status.toLowerCase()}`}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="my-property-content">
                  <h2>{property.title}</h2>

                  <p className="my-property-location">
                    {property.location}, {property.city}
                  </p>

                  <p className="my-property-price">
                    ₹{property.price.toLocaleString("en-IN")}
                  </p>

                  <div className="my-property-stats">
                    <span>{property.bedrooms} Beds</span>
                    <span>{property.bathrooms} Baths</span>
                    <span>{property.area_sqft} sq.ft</span>
                  </div>

                  <div className="my-property-footer">
                    <span>View & manage listing</span>
                    <span>→</span>
                  </div>
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