import { useRef, useState } from "react"

import { apiRequest } from "../services/api"

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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function handleUpload() {
    if (!file) {
      setMessage("Please choose an image first.")
      return
    }

    try {
      setUploading(true)
      setMessage("")

      const formData = new FormData()

      // Must match the FastAPI parameter name
      formData.append("image_file", file)

      await apiRequest(
        `/properties/${propertyId}/images`,
        {
          method: "POST",
          body: formData,
        }
      )

      setMessage("Image uploaded successfully!")
      setFile(null)

      // Clear the file input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (error) {
      console.error("Image upload error:", error)

      if (
        error instanceof Error &&
        error.message === "Session expired"
      ) {
        return
      }

      setMessage("Failed to upload image.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const selectedFile =
            event.target.files?.[0] ?? null

          setFile(selectedFile)
          setMessage("")
        }}
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {message && (
        <p className="image-upload-message">
          {message}
        </p>
      )}
    </div>
  )
}

export default PropertyImageUpload