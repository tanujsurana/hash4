import { useEffect, useState } from "react"

import PropertyCard from "../components/PropertyCard"
import { apiRequest } from "../services/api"
import type { Property } from "../types/property"

function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [city, setCity] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")

  async function loadProperties(queryString = "") {
    try {
      setLoading(true)
      setError("")

      const endpoint = queryString
        ? `/properties?${queryString}`
        : "/properties"

      const data = await apiRequest(endpoint)
      setProperties(data)
    } catch {
      setError("Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function fetchInitialProperties() {
      try {
        const data = await apiRequest("/properties")

        if (!cancelled) {
          setProperties(data)
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load properties")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void fetchInitialProperties()

    return () => {
      cancelled = true
    }
  }, [])

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams()

    if (search.trim()) {
      params.set("search", search.trim())
    }

    if (city.trim()) {
      params.set("city", city.trim())
    }

    if (propertyType.trim()) {
      params.set("property_type", propertyType.trim())
    }

    if (minPrice) {
      params.set("min_price", minPrice)
    }

    if (maxPrice) {
      params.set("max_price", maxPrice)
    }

    if (bedrooms) {
      params.set("bedrooms", bedrooms)
    }

    params.set("sort_by", sortBy)
    params.set("sort_order", sortOrder)

    void loadProperties(params.toString())
  }

  function handleReset() {
    setSearch("")
    setCity("")
    setPropertyType("")
    setMinPrice("")
    setMaxPrice("")
    setBedrooms("")
    setSortBy("created_at")
    setSortOrder("desc")

    void loadProperties()
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

      <section className="property-search-section">
        <div className="property-search-heading">
          <div>
            <p className="section-eyebrow">SEARCH & FILTER</p>
            <h2>Find the right property</h2>
          </div>

          <p>
            Search by location, price, property type, and more.
          </p>
        </div>

        <form
          className="property-search-form"
          onSubmit={handleSearch}
        >
          <label className="property-search-field property-search-field-wide">
            <span>Search</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, location, or description"
            />
          </label>

          <label className="property-search-field">
            <span>City</span>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="e.g. Chennai"
            />
          </label>

          <label className="property-search-field">
            <span>Property Type</span>
            <input
              type="text"
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              placeholder="Apartment, Villa..."
            />
          </label>

          <label className="property-search-field">
            <span>Min Price</span>
            <input
              type="number"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Minimum"
              min="0"
            />
          </label>

          <label className="property-search-field">
            <span>Max Price</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Maximum"
              min="0"
            />
          </label>

          <label className="property-search-field">
            <span>Bedrooms</span>
            <input
              type="number"
              value={bedrooms}
              onChange={(event) => setBedrooms(event.target.value)}
              placeholder="Any"
              min="0"
            />
          </label>

          <label className="property-search-field">
            <span>Sort By</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="created_at">Newest</option>
              <option value="price">Price</option>
              <option value="bedrooms">Bedrooms</option>
              <option value="area_sqft">Area</option>
            </select>
          </label>

          <label className="property-search-field">
            <span>Order</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="desc">High to Low</option>
              <option value="asc">Low to High</option>
            </select>
          </label>

          <div className="property-search-actions">
            <button
              type="button"
              className="property-search-reset"
              onClick={handleReset}
            >
              Reset
            </button>

            <button
              type="submit"
              className="property-search-submit"
            >
              Search Properties
            </button>
          </div>
        </form>
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

        {loading ? (
          <div className="empty-properties">
            <h3>Loading properties...</h3>
          </div>
        ) : error ? (
          <div className="empty-properties">
            <h3>{error}</h3>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-properties">
            <h3>No matching properties found.</h3>
            <p>Try changing your search or filter options.</p>
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