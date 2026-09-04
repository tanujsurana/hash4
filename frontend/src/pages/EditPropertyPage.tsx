import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { apiRequest } from "../services/api"
import type { Property } from "../types/property"

function EditPropertyPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [property, setProperty] = useState<Property | null>(null)

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [city, setCity] = useState("")
  const [price, setPrice] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [areaSqft, setAreaSqft] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("active")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProperty() {
      try {
        const data: Property = await apiRequest(`/properties/${id}`)

        setProperty(data)

        setTitle(data.title)
        setLocation(data.location)
        setCity(data.city)
        setPrice(String(data.price))
        setBedrooms(String(data.bedrooms))
        setBathrooms(String(data.bathrooms))
        setPropertyType(data.property_type)
        setAreaSqft(String(data.area_sqft))
        setDescription(data.description)
        setStatus(data.status)
      } catch {
        setError("Failed to load property")
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!property) {
      return
    }

    try {
      setSubmitting(true)
      setError("")

      await apiRequest(`/properties/${property.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          location,
          city,
          price: Number(price),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          property_type: propertyType,
          area_sqft: Number(areaSqft),
          description,
          status,
        }),
      })

      navigate(`/properties/${property.id}`)
    } catch {
      setError("Failed to update property")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Loading property...</p>
      </div>
    )
  }

  if (error && !property) {
    return (
      <div className="page">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="auth-container">
        <h1>Edit Property</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            Location
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
            />
          </label>

          <label>
            City
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
            />
          </label>

          <label>
            Price
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              min="1"
              required
            />
          </label>

          <label>
            Bedrooms
            <input
              type="number"
              value={bedrooms}
              onChange={(event) => setBedrooms(event.target.value)}
              min="0"
              required
            />
          </label>

          <label>
            Bathrooms
            <input
              type="number"
              value={bathrooms}
              onChange={(event) => setBathrooms(event.target.value)}
              min="0"
              required
            />
          </label>

          <label>
            Property Type
            <input
              type="text"
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              required
            />
          </label>

          <label>
            Area (sq.ft)
            <input
              type="number"
              value={areaSqft}
              onChange={(event) => setAreaSqft(event.target.value)}
              min="1"
              required
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditPropertyPage