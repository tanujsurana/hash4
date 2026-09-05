import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { apiRequest } from "../services/api"

function RegisterPage() {
  const [name, setName] = useState("")
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

      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      navigate("/login")
    } catch {
      setError("Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-layout">
        <section className="auth-showcase">
          <p className="auth-eyebrow">JOIN HASH4</p>

          <h1>
            Start exploring.
            <span> Start listing.</span>
          </h1>

          <p className="auth-showcase-description">
            Create an account to save your favorite properties, manage your own
            listings, and upload property images.
          </p>

          <div className="auth-feature-list">
            <div>
              <strong>01</strong>
              <span>Create and manage property listings</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Save properties you want to revisit</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Manage images and listing details securely</span>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <p className="section-eyebrow">CREATE ACCOUNT</p>
            <h2>Join Hash4</h2>
            <p>Set up your account to get started.</p>
          </div>

          <form className="modern-auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Full name</span>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>

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
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength={8}
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
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-card-footer">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RegisterPage