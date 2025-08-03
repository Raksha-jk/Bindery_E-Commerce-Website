import { createContext, useEffect, useState } from "react";
import api from "../api/api"; // Axios instance

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/cart")
        .then((res) => setCart(res.data))
        .catch((err) => console.error("Error fetching cart:", err));
    } else {
      setCart([]);
    }
  }, []);

  const addToCart = async (product) => {
    try {
      await api.post("/cart", { book_id: product.id, quantity: 1 });
      // Re-fetch updated cart
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.error || "Could not add to cart");
    }
  };

  // ✅ Remove item from backend cart
  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      setCart(cart.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
