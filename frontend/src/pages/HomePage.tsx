import { useEffect, useState } from "react"
import { apiRequest } from "../services/api"
import type { Property } from "../types/property"
import PropertyCard from "../components/PropertyCard"

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
    return <p>Loading properties...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
  <div className="page">
    <h1>Hash4</h1>
    <p>Real estate platform</p>

    <h2>Properties</h2>

    {properties.length === 0 ? (
      <p>No properties available.</p>
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
  </div>
)
}

export default HomePage