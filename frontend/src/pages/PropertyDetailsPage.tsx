import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
const API_URL = import.meta.env.VITE_API_URL
import PropertyImageUpload from "../components/PropertyImageUpload"
import { apiRequest } from "../services/api"
import type { Property } from "../types/property"

function PropertyDetailsPage() {
  const { id } = useParams()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [favoriteMessage, setFavoriteMessage] = useState("")
  const [addingFavorite, setAddingFavorite] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true)
        setError("")

        const data = await apiRequest(`/properties/${id}`)
        setProperty(data)
      } catch {
        setError("Failed to load property")
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [id, refreshKey])

  useEffect(() => {
    async function loadCurrentUser() {
      const token = localStorage.getItem("access_token")

      if (!token) {
        setCurrentUserId(null)
        return
      }

      try {
        const user = await apiRequest("/auth/me")
        setCurrentUserId(user.id)
      } catch {
        setCurrentUserId(null)
      }
    }

    loadCurrentUser()
  }, [])

  useEffect(() => {
    async function checkFavorite() {
      const token = localStorage.getItem("access_token")

      if (!token || !id) {
        setIsFavorite(false)
        return
      }

      try {
        const favorites = await apiRequest("/favorites")

        const found = favorites.some(
          (favorite: { property_id: number }) =>
            favorite.property_id === Number(id)
        )

        setIsFavorite(found)
      } catch {
        setIsFavorite(false)
      }
    }

    checkFavorite()
  }, [id])

  async function handleAddFavorite() {
    if (!property) {
      return
    }

    const token = localStorage.getItem("access_token")

    if (!token) {
      setFavoriteMessage("Please login first.")
      return
    }

    try {
      setAddingFavorite(true)
      setFavoriteMessage("")

      await apiRequest(`/favorites/${property.id}`, {
        method: "POST",
      })

      setIsFavorite(true)
      setFavoriteMessage("Added to favorites!")
    } catch (error) {
      console.error("Favorite error:", error)

      setFavoriteMessage(
        error instanceof Error
          ? error.message
          : "Could not add to favorites."
      )
    } finally {
      setAddingFavorite(false)
    }
  }

  async function handleDeleteProperty() {
    if (!property) {
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    try {
      await apiRequest(`/properties/${property.id}`, {
        method: "DELETE",
      })

      window.location.href = "/my-properties"
    } catch (error) {
      console.error("Delete property error:", error)
      alert("Failed to delete property.")
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!property) {
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    )

    if (!confirmed) {
      return
    }

    try {
      await apiRequest(
        `/properties/${property.id}/images/${imageId}`,
        {
          method: "DELETE",
        }
      )

      setRefreshKey((current) => current + 1)
    } catch (error) {
      console.error("Delete image error:", error)
      alert("Failed to delete image.")
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading property...</p>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="page">
        <p>{error || "Property not found"}</p>
      </div>
    )
  }

  const displayImages = property.images.map((image) => {
    const rawUrl = image.signed_url

    if (rawUrl.startsWith("/uploads/")) {
      return {
        ...image,
        displayUrl: `${API_URL}${rawUrl}`,
      }
    }

    return {
      ...image,
      displayUrl: rawUrl,
    }
  })

  return (
    <div className="page">
      <Link to="/">← Back to properties</Link>

      <h1>{property.title}</h1>

      {displayImages.length > 0 && (
        <div className="property-gallery">
          <img
            src={displayImages[0].displayUrl}
            alt={property.title}
            className="property-detail-image"
            onError={(event) => {
              event.currentTarget.style.display = "none"
            }}
          />
        </div>
      )}

      <p>
        {property.location}, {property.city}
      </p>

      <h2>₹{property.price.toLocaleString("en-IN")}</h2>

      {localStorage.getItem("access_token") && (
        <>
          <button
            type="button"
            className="favorite-button"
            onClick={handleAddFavorite}
            disabled={addingFavorite || isFavorite}
          >
            {isFavorite
              ? "♥ Added to Favorites"
              : addingFavorite
              ? "Adding..."
              : "♡ Add to Favorites"}
          </button>

          {favoriteMessage && <p>{favoriteMessage}</p>}
        </>
      )}

      <p>
        {property.bedrooms} Beds • {property.bathrooms} Baths •{" "}
        {property.area_sqft} sq.ft
      </p>

      <p>Type: {property.property_type}</p>

      <p>Status: {property.status}</p>

      <h3>Description</h3>

      <p>{property.description}</p>

      <p>Listed by {property.owner.name}</p>

      {currentUserId === property.owner.id && (
        <>
          <div className="property-owner-actions">
            <Link
              to={`/properties/${property.id}/edit`}
              className="edit-property-button"
            >
              Edit Property
            </Link>

            <button
              type="button"
              className="delete-property-button"
              onClick={handleDeleteProperty}
            >
              Delete Property
            </button>
          </div>

          <h3>Manage Images</h3>

          <PropertyImageUpload
            propertyId={property.id}
            onUploadSuccess={() => {
              setRefreshKey((current) => current + 1)
            }}
          />

          {displayImages.length > 0 && (
            <div className="manage-images-list">
              {displayImages.map((image) => (
                <div
                  key={image.id}
                  className="manage-image-item"
                >
                  <img
                    src={image.displayUrl}
                    alt={`Property image ${image.id}`}
                    className="manage-image-preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none"
                    }}
                  />

                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    Delete Image
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PropertyDetailsPage