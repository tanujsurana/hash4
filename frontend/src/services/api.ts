const API_URL = import.meta.env.VITE_API_URL

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("access_token")

  const headers = new Headers(options.headers)

  // Only set JSON content type when the request body is not FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    localStorage.removeItem("access_token")

    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/register"
    ) {
      window.location.href = "/login"
    }

    throw new Error("Session expired")
  }

  if (!response.ok) {
    const errorText = await response.text()

    console.error(
      `API Error ${response.status}:`,
      errorText
    )

    throw new Error(
      `API request failed: ${response.status}`
    )
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}