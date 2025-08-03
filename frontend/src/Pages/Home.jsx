import { useState, useEffect } from "react";
import { Row, Col, Input } from "antd";
import Productcard from "../Components/ProductCard";
import api from "../api/api"; // axios instance pointing to backend

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchvalue, setSearchvalue] = useState("");

  // Fetch books from backend
  useEffect(() => {
    api.get("/book")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Filtered search
  const filteredProducts = products.filter((pros) => {
    const search = searchvalue.toLowerCase();
    return (
      pros.title?.toLowerCase().includes(search) ||
      pros.author?.toLowerCase().includes(search) ||
      pros.Category?.name?.toLowerCase().includes(search)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* Search Bar */}
      <div style={{ maxWidth: "400px", margin: "0 auto 20px auto" }}>
        <Input.Search
          placeholder="Search books..."
          allowClear
          enterButton="Search"
          size="large"
          value={searchvalue}
          onChange={(e) => setSearchvalue(e.target.value)}
          onSearch={(value) => setSearchvalue(value)}
        />
      </div>

      {/* Product Grid */}
      <Row gutter={[20, 20]}>
        {filteredProducts.map((pro) => (
          <Col
            key={pro.id}
            xs={24} // mobile: 1 per row
            sm={12} // tablet: 2 per row
            md={8} // desktop: 3 per row
            lg={6} // large desktop: 4 per row
          >
            <Productcard product={pro} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
