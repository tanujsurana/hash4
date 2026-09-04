import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { apiRequest } from "../services/api"
import type { Property } from "../types/property"

const API_URL = import.meta.env.VITE_API_URL

type Favorite = {
  id: number
  user_id: number
  property_id: number
  created_at: string
}

type FavoriteProperty = {
  favoriteId: number
  property: Property
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadFavorites() {
      try {
        const favoriteRecords: Favorite[] = await apiRequest("/favorites")

        const propertyResults = await Promise.all(
          favoriteRecords.map(async (favorite) => {
            const property: Property = await apiRequest(
              `/properties/${favorite.property_id}`
            )

            return {
              favoriteId: favorite.id,
              property,
            }
          })
        )

        setFavorites(propertyResults)
      } catch (error) {
        console.error("Failed to load favorites:", error)
        setError("Failed to load favorites")
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  async function handleRemoveFavorite(propertyId: number) {
    try {
      await apiRequest(`/favorites/${propertyId}`, {
        method: "DELETE",
      })

      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          ({ property }) => property.id !== propertyId
        )
      )
    } catch (error) {
      console.error("Failed to remove favorite:", error)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading favorites...</p>
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
      <h1>My Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorite properties yet.</p>
      ) : (
        <div className="property-grid">
          {favorites.map(({ property }) => {
            const preferredImage =
              property.images.find((image) =>
                image.signed_url?.startsWith("http")
              ) ?? property.images[0]

            const rawImageUrl = preferredImage?.signed_url

            const imageUrl = rawImageUrl?.startsWith("/uploads/")
              ? `${API_URL}${rawImageUrl}`
              : rawImageUrl

            return (
              <div key={property.id} className="property-card">
                <Link
                  to={`/properties/${property.id}`}
                  className="property-card-link"
                >
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

                  <h3>₹{property.price.toLocaleString("en-IN")}</h3>

                  <p>
                    {property.bedrooms} Beds • {property.bathrooms} Baths •{" "}
                    {property.area_sqft} sq.ft
                  </p>

                  <p>{property.property_type}</p>
                </Link>

                <button
                  type="button"
                  className="remove-favorite-button"
                  onClick={() => handleRemoveFavorite(property.id)}
                >
                  Remove from Favorites
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage