import { useNavigate } from "react-router-dom";
import { Card } from "antd";

export default function Productcard({ product }) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        width: 240,
        borderRadius: "10px",
        overflow: "hidden",
      }}
      cover={
        <img
          alt={product.title}
          src={product.imageUrl}
          style={{
            height: 300,
            objectFit: "cover",
            borderBottom: "1px solid #f0f0f0",
          }}
        />
      }
    >
      <Card.Meta
        title={product.title}
        description={
          <>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Author:</strong> {product.author}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Price:</strong> ₹{product.price}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#888" }}>
              {product.Category?.name}
            </p>
          </>
        }
      />
    </Card>
  );
}
