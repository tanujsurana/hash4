import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { apiRequest } from "../services/api"
import PropertyCard from "../components/PropertyCard"
import type { Property } from "../types/property"

function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    async function loadMyProperties() {
      try {
        const data = await apiRequest("/properties/my-properties")
        setProperties(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load your properties")
      } finally {
        setLoading(false)
      }
    }

    loadMyProperties()
  }, [])

  async function handleDelete(property: Property) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"?`
    )

    if (!confirmed) {
      return
    }

    setActionError("")
    setDeletingId(property.id)

    try {
      await apiRequest(`/properties/${property.id}`, {
        method: "DELETE",
      })

      setProperties((currentProperties) =>
        currentProperties.filter(
          (currentProperty) => currentProperty.id !== property.id
        )
      )
    } catch (err) {
      console.error(err)
      setActionError(
        "Unable to delete this property. Please try again."
      )
    } finally {
      setDeletingId(null)
    }
  }

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

        <Link
          to="/create-property"
          className="create-property-button"
        >
          + Create Property
        </Link>
      </section>

      <div className="my-properties-summary">
        <span className="summary-number">
          {properties.length}
        </span>

        <span className="summary-label">
          {properties.length === 1
            ? " Property listed"
            : " Properties listed"}
        </span>
      </div>

      {actionError && (
        <div className="my-properties-action-error">
          {actionError}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="my-properties-empty">
          <h2>No properties yet</h2>

          <p>
            Create your first property listing and it will appear here.
          </p>

          <Link
            to="/create-property"
            className="create-property-button"
          >
            + Create Property
          </Link>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div
              key={property.id}
              className="my-property-wrapper"
            >
              <PropertyCard property={property} />

              <div className="my-property-actions">
                <Link
                  to={`/properties/${property.id}/edit`}
                  className="property-action-button"
                >
                  Edit
                </Link>

                <Link
                  to={`/properties/${property.id}`}
                  className="property-action-button"
                >
                  View
                </Link>

                <button
                  type="button"
                  className="property-action-button property-delete-button"
                  disabled={deletingId === property.id}
                  onClick={() => handleDelete(property)}
                >
                  {deletingId === property.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyPropertiesPage