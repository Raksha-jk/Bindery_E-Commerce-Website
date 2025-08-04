import { useContext, useEffect} from "react";
import { CartContext } from "../Components/CartContext";
import Cartcard from "../Components/CartCard";
import api from "../api/api";
import { message, Card, Button, Divider } from "antd";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  // Load cart from backend when page loads
  useEffect(() => {
    api.get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => message.error("Error loading cart"));
  }, [setCart]);

  const handleRemove = (id) => {
    api.delete(`/cart/${id}`)
      .then(() => {
        setCart((prev) => prev.filter((item) => item.id !== id));
        message.success("Item removed from cart");
      })
      .catch(() => message.error("Error removing item"));
  };

  const handleQtyChange = (id, newQty) => {
    api.put(`/cart/${id}`, { quantity: newQty })
      .then(() => {
        setCart((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, qty: newQty } : item
          )
        );
      })
      .catch(() => message.error("Error updating quantity"));
  };

  const total = cart.reduce((acc, item) => {
    const price = item.Book?.price || item.Price || 0;
    return acc + price * (item.qty || item.quantity || 1);
  }, 0);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Card>
        <h2 style={{ marginBottom: "20px" }}>Your Cart</h2>

        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cart.map((product) => (
              <Cartcard
                key={product.id}
                product={product}
                onRemove={handleRemove}
                onQuantityChange={handleQtyChange}
              />
            ))}

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <span>Total: ₹{total}</span>
              <Button type="primary" size="large" onClick={() => navigate("/checkout")}>
                Checkout
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
