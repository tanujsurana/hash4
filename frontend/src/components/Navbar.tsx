import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Hash4
      </Link>

      <div className="navbar-links">
        <Link to="/">Properties</Link>

        {isLoggedIn ? (
          <>
            <Link to="/favorites">Favorites</Link>
            <Link to="/my-properties">My Properties</Link>
            {user && <span>Hi, {user.name}</span>}

            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar