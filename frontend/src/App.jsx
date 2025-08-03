import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import ProductDetail from "./Components/ProductDetail";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Cart from "./Pages/Cart";
import Title from "./Pages/Title";
import SellerDashboard from "./Pages/SellerDashboard";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  // General login check
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  // Seller/Admin only
  const SellerRoute = ({ children }) => {
    const role = localStorage.getItem("role");
    if (role === "seller" || role === "admin") {
      return children;
    }
    return <Navigate to="/home" replace />;
  };

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Title />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer/Seller/Admin */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

        {/* Seller/Admin only */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute>
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
