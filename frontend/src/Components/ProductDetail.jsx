import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Input, List, Typography, Rate, Divider, message } from "antd";
import api from "../api/api";
import { CartContext } from "./CartContext";

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [role, setRole] = useState(null);

  // Fetch product & reviews
  const fetchBookDetails = () => {
    api.get(`/book/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => message.error("Error loading product details"));
  };

  const fetchReviews = () => {
    api.get(`/reviews/book/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole.toLowerCase());
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  if (!book) return <p>Loading product details...</p>;

  // Buy Now = Add to Cart + Redirect to Checkout
  const handleBuyNow = () => {
    addToCart(book);
    navigate("/checkout");
  };

  // Submit Buyer Review
  const submitReview = () => {
    if (!reviewText.trim()) {
      message.warning("Please write something before submitting.");
      return;
    }

    api.post(
      "/reviews",
      { book_id: id, rating: 5, comment: reviewText },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
      .then(() => {
        message.success("Review added!");
        setReviewText("");
        fetchReviews();
      })
      .catch(() => message.error("Error adding review"));
  };

  // Submit Seller Reply
  const submitReply = (reviewId) => {
    api.post(
      `/reviews/reply/${reviewId}`,
      { reply: replyText },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
      .then(() => {
        message.success("Reply added!");
        setReplyText("");
        fetchReviews();
      })
      .catch(() => message.error("Error adding reply"));
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
      {/* Product Image */}
      <Card
        cover={<img alt={book.title} src={book.imageUrl} />}
        style={{ width: 300 }}
      />

      {/* Product Info */}
      <div style={{ flex: 1 }}>
        <Title level={2}>{book.title}</Title>
        <Text type="secondary">by {book.author}</Text>
        <Divider />
        <Title level={4} style={{ color: "#1890ff" }}>₹{book.price}</Title>
        <Text>Category: {book.Category?.name || "N/A"}</Text>
        <p style={{ marginTop: "10px" }}>{book.description}</p>

        {/* Action Buttons */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <Button type="primary" onClick={() => addToCart(book)}>Add to Cart</Button>
          <Button danger onClick={handleBuyNow}>Buy Now</Button>
        </div>

        <Divider />

        {/* Reviews */}
        <Title level={3}>Reviews</Title>
        {reviews.length === 0 ? (
          <Text type="secondary">No reviews yet</Text>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={reviews}
            renderItem={(r) => (
              <List.Item>
                <Text strong>{r.User?.name}</Text>
                <p>{r.comment}</p>

                {/* Seller Reply */}
                {r.reply && (
                  <Card size="small" style={{ background: "#f9f9f9", marginTop: 8 }}>
                    <Text type="secondary">Seller Reply:</Text>
                    <p>{r.reply}</p>
                  </Card>
                )}

                {/* Seller Reply Box */}
                {role === "seller" && !r.reply && (
                  <div style={{ marginTop: 10 }}>
                    <Input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <Button
                      type="link"
                      onClick={() => submitReply(r.id)}
                      style={{ padding: 0 }}
                    >
                      Reply
                    </Button>
                  </div>
                )}
              </List.Item>
            )}
          />
        )}

        {/* Buyer Review Box */}
        {role === "buyer" && (
          <div style={{ marginTop: 20 }}>
            <Title level={4}>Leave a Review</Title>
            <TextArea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              rows={3}
            />
            <Button
              type="primary"
              style={{ marginTop: 10 }}
              onClick={submitReview}
            >
              Submit Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
