import { BrowserRouter, Route, Routes } from "react-router-dom"
import PropertyDetailsPage from "./pages/PropertyDetailsPage"
import FavoritesPage from "./pages/FavoritesPage"
import MyPropertiesPage from "./pages/MyPropertiesPage"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CreatePropertyPage from "./pages/CreatePropertyPage"
import "./App.css"
import EditPropertyPage from "./pages/EditPropertyPage"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-properties" element={<MyPropertiesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/properties/:id/edit" element={<EditPropertyPage />} />
        <Route path="/create-property" element={<CreatePropertyPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App