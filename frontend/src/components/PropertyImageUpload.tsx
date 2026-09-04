import { useState } from "react"
const API_URL = import.meta.env.VITE_API_URL

type PropertyImageUploadProps = {
  propertyId: number
  onUploadSuccess?: () => void
}

function PropertyImageUpload({
  propertyId,
  onUploadSuccess,
}: PropertyImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleUpload() {
    if (!file) {
      setMessage("Please choose an image first.")
      return
    }

    const token = localStorage.getItem("access_token")

    if (!token) {
      setMessage("Please login first.")
      return
    }

    try {
      setUploading(true)
      setMessage("")

      const formData = new FormData()

      // Must match the FastAPI parameter name: image_file
      formData.append("image_file", file)

      const response = await fetch(
        `${API_URL}/properties/${propertyId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      setMessage("Image uploaded successfully!")
      setFile(null)

      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (error) {
      console.error("Image upload error:", error)
      setMessage("Failed to upload image.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0] ?? null
          setFile(selectedFile)
        }}
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {message && <p>{message}</p>}
    </div>
  )
}

export default PropertyImageUpload