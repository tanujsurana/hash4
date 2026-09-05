import { useEffect, useState } from "react"
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom"

import { apiRequest } from "../services/api"

type User = {
  id: number
  name: string
  email: string
}

function Navbar() {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)

  const token = localStorage.getItem("access_token")
  const isLoggedIn = Boolean(token)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null)
        return
      }

      try {
        const data = await apiRequest("/auth/me")
        setUser(data)
      } catch {
        localStorage.removeItem("access_token")
        setUser(null)
      }
    }

    loadUser()
  }, [token])

  function handleLogout() {
    localStorage.removeItem("access_token")
    setUser(null)
    navigate("/login")
  }

  function navLinkClass({
    isActive,
  }: {
    isActive: boolean
  }) {
    return isActive
      ? "navbar-link navbar-link-active"
      : "navbar-link"
  }

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-mark">H4</span>

          <span className="navbar-brand-text">
            Hash4
          </span>
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={navLinkClass}
          >
            Properties
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/favorites"
                className={navLinkClass}
              >
                Favorites
              </NavLink>

              <NavLink
                to="/my-properties"
                className={navLinkClass}
              >
                My Properties
              </NavLink>

              <div className="navbar-divider" />

              {user && (
                <div className="navbar-user">
                  <span className="navbar-user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </span>

                  <span className="navbar-user-name">
                    {user.name}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="navbar-register-button"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar