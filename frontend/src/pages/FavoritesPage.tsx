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
    <div className="page favorites-page">
      <section className="favorites-header">
        <div>
          <p className="section-eyebrow">SAVED LISTINGS</p>
          <h1>My Favorites</h1>
          <p className="favorites-subtitle">
            Keep track of the properties you like and revisit them anytime.
          </p>
        </div>

        <div className="favorites-count">
          <strong>{favorites.length}</strong>
          <span>{favorites.length === 1 ? "Saved property" : "Saved properties"}</span>
        </div>
      </section>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">♡</div>
          <h2>No favorites yet</h2>
          <p>
            Browse available properties and save the ones you want to revisit.
          </p>

          <Link to="/" className="favorites-browse-button">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
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
              <article key={property.id} className="favorite-property-card">
                <Link
                  to={`/properties/${property.id}`}
                  className="favorite-property-link"
                >
                  <div className="favorite-property-image-wrapper">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="favorite-property-image"
                        onError={(event) => {
                          event.currentTarget.style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="favorite-property-placeholder">
                        No image available
                      </div>
                    )}

                    <span className="favorite-property-type">
                      {property.property_type}
                    </span>
                  </div>

                  <div className="favorite-property-content">
                    <h2>{property.title}</h2>

                    <p className="favorite-property-location">
                      {property.location}, {property.city}
                    </p>

                    <p className="favorite-property-price">
                      ₹{property.price.toLocaleString("en-IN")}
                    </p>

                    <div className="favorite-property-stats">
                      <span>{property.bedrooms} Beds</span>
                      <span>{property.bathrooms} Baths</span>
                      <span>{property.area_sqft} sq.ft</span>
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  className="remove-favorite-button"
                  onClick={() => handleRemoveFavorite(property.id)}
                >
                  Remove from Favorites
                </button>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage