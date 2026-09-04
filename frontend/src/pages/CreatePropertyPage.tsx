import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { apiRequest } from "../services/api"

function CreatePropertyPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [city, setCity] = useState("")
  const [price, setPrice] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [areaSqft, setAreaSqft] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError("")

      await apiRequest("/properties", {
        method: "POST",
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
        }),
      })

      navigate("/my-properties")
    } catch {
      setError("Failed to create property")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="auth-container">
        <h1>Create Property</h1>

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
            {submitting ? "Creating..." : "Create Property"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePropertyPage