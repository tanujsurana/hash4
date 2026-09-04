import { useEffect, useState } from "react"

import PropertyCard from "../components/PropertyCard"
import { apiRequest } from "../services/api"
import type { Property } from "../types/property"

function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await apiRequest("/properties")
        setProperties(data)
      } catch {
        setError("Failed to load properties")
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  if (loading) {
    return (
      <div className="page">
        <p>Loading properties...</p>
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
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">Find your next place</p>

          <h1>
            Discover homes that
            <span> fit your lifestyle.</span>
          </h1>

          <p className="home-hero-description">
            Explore carefully listed apartments, villas, and homes with
            detailed property information, secure user accounts, favorites,
            and image-based listings.
          </p>
        </div>
      </section>

      <section className="properties-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Explore</p>
            <h2>Available Properties</h2>
          </div>

          <p className="property-count">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="empty-properties">
            <h3>No properties available yet.</h3>
            <p>New listings will appear here when they are added.</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage