import { Card, Button, InputNumber } from "antd";

export default function Cartcard({ product, onRemove, onQuantityChange }) {
  const name = product.Name || product.Book?.title;
  const img = product.img || product.Book?.imageUrl;
  const price = product.Price || product.Book?.price;
  const qty = product.qty || product.quantity;

  return (
    <Card
      style={{
        marginBottom: "15px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Product Image */}
        <img
          src={img}
          alt={name}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />

        {/* Product Info */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{name}</h3>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>₹{price}</p>

          {/* Quantity Selector */}
          <InputNumber
            min={1}
            value={qty}
            onChange={(value) => onQuantityChange(product.id, value)}
          />
        </div>

        {/* Remove Button */}
        <Button danger onClick={() => onRemove(product.id)}>
          Remove
        </Button>
      </div>
    </Card>
  );
}
