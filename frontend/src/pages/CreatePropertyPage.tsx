import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

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
    <div className="page create-property-page">
      <Link to="/my-properties" className="property-back-link">
        ← Back to my properties
      </Link>

      <section className="create-property-header">
        <p className="section-eyebrow">NEW LISTING</p>
        <h1>Create Property</h1>
        <p>
          Add the property details below. You can upload listing images after
          the property is created.
        </p>
      </section>

      <form className="property-form" onSubmit={handleSubmit}>
        <section className="property-form-section">
          <div className="property-form-section-heading">
            <span>01</span>
            <div>
              <h2>Basic Information</h2>
              <p>Give your listing a clear title and location.</p>
            </div>
          </div>

          <div className="property-form-grid">
            <label className="property-form-field property-form-field-full">
              <span>Property Title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Modern Sea View Apartment"
                required
              />
            </label>

            <label className="property-form-field">
              <span>Location</span>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Besant Nagar"
                required
              />
            </label>

            <label className="property-form-field">
              <span>City</span>
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="e.g. Chennai"
                required
              />
            </label>

            <label className="property-form-field property-form-field-full">
              <span>Property Type</span>
              <input
                type="text"
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                placeholder="Apartment, Villa, Commercial Space..."
                required
              />
            </label>
          </div>
        </section>

        <section className="property-form-section">
          <div className="property-form-section-heading">
            <span>02</span>
            <div>
              <h2>Property Details</h2>
              <p>Add pricing, size, and room information.</p>
            </div>
          </div>

          <div className="property-form-grid">
            <label className="property-form-field">
              <span>Price (₹)</span>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="12500000"
                min="1"
                required
              />
            </label>

            <label className="property-form-field">
              <span>Area (sq.ft)</span>
              <input
                type="number"
                value={areaSqft}
                onChange={(event) => setAreaSqft(event.target.value)}
                placeholder="1850"
                min="1"
                required
              />
            </label>

            <label className="property-form-field">
              <span>Bedrooms</span>
              <input
                type="number"
                value={bedrooms}
                onChange={(event) => setBedrooms(event.target.value)}
                placeholder="3"
                min="0"
                required
              />
            </label>

            <label className="property-form-field">
              <span>Bathrooms</span>
              <input
                type="number"
                value={bathrooms}
                onChange={(event) => setBathrooms(event.target.value)}
                placeholder="2"
                min="0"
                required
              />
            </label>
          </div>
        </section>

        <section className="property-form-section">
          <div className="property-form-section-heading">
            <span>03</span>
            <div>
              <h2>Description</h2>
              <p>Describe the property and its key selling points.</p>
            </div>
          </div>

          <label className="property-form-field">
            <span>Property Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={7}
              placeholder="Describe the property, nearby landmarks, amenities, parking, views, and other important details..."
              required
            />
          </label>
        </section>

        {error && <p className="property-form-error">{error}</p>}

        <div className="property-form-actions">
          <Link to="/my-properties" className="property-form-cancel">
            Cancel
          </Link>

          <button
            type="submit"
            className="property-form-submit"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Property"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePropertyPage