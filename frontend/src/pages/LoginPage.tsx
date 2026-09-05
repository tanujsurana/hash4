import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    try {
      setSubmitting(true)

      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      localStorage.setItem("access_token", data.access_token)

      navigate("/")
    } catch {
      setError("Invalid email or password")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-layout">
        <section className="auth-showcase">
          <p className="auth-eyebrow">WELCOME BACK</p>

          <h1>
            Find the right property.
            <span> Save what matters.</span>
          </h1>

          <p className="auth-showcase-description">
            Sign in to manage your listings, save favorite properties, and
            continue exploring homes on Hash4.
          </p>

          <div className="auth-feature-list">
            <div>
              <strong>01</strong>
              <span>Manage your property listings</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Save properties to your favorites</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Upload and manage listing images</span>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <p className="section-eyebrow">ACCOUNT ACCESS</p>
            <h2>Sign in to Hash4</h2>
            <p>Enter your account details to continue.</p>
          </div>

          <form className="modern-auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Email address</span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Password</span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <p className="modern-auth-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="modern-auth-submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-card-footer">
            <span>Don't have an account?</span>
            <Link to="/register">Create one</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage