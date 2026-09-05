import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

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
    <div className="page create-property-page">
      {property && (
        <Link
          to={`/properties/${property.id}`}
          className="property-back-link"
        >
          ← Back to property
        </Link>
      )}

      <section className="create-property-header">
        <p className="section-eyebrow">MANAGE LISTING</p>

        <h1>Edit Property</h1>

        <p>
          Update the listing information below and keep the property details
          accurate.
        </p>
      </section>

      <form className="property-form" onSubmit={handleSubmit}>
        <section className="property-form-section">
          <div className="property-form-section-heading">
            <span>01</span>

            <div>
              <h2>Basic Information</h2>
              <p>Update the property title, location, and property type.</p>
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
              <p>Update pricing, size, room information, and listing status.</p>
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

            <label className="property-form-field property-form-field-full">
              <span>Listing Status</span>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
        </section>

        <section className="property-form-section">
          <div className="property-form-section-heading">
            <span>03</span>

            <div>
              <h2>Description</h2>
              <p>Update the property description and key selling points.</p>
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
          {property && (
            <Link
              to={`/properties/${property.id}`}
              className="property-form-cancel"
            >
              Cancel
            </Link>
          )}

          <button
            type="submit"
            className="property-form-submit"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPropertyPage