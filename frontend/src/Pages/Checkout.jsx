// src/Pages/Checkout.jsx
import { useEffect, useState } from "react";
import { Form, Input, Button, Select, Card, Radio, message } from "antd";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const navigate = useNavigate();

  // Fetch saved addresses
  useEffect(() => {
    api
      .get("/addresses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => setAddresses(res.data))
      .catch(() => message.error("Failed to load addresses"));
  }, []);

  // Place Order
  const handlePlaceOrder = (values) => {
    let payload = {
      paymentMethod: values.paymentMethod
    };

    if (addingNew) {
      payload.newAddress = {
        fullName: values.fullName,
        phone: values.phone,
        street: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country
      };
    } else {
      payload.addressId = selectedAddressId;
    }

    api
      .post("/orders", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        message.success("Order placed successfully!");
        navigate(`/order-confirmation/${res.data.orderId}`);
      })
      .catch(() => message.error("Failed to place order"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Checkout</h2>

      {/* Existing addresses */}
      {!addingNew && (
        <>
          <h3>Choose a Saved Address</h3>
          <Radio.Group
            onChange={(e) => setSelectedAddressId(e.target.value)}
            value={selectedAddressId}
            style={{ width: "100%" }}
          >
            {addresses.map((addr) => (
              <Card key={addr.id} style={{ marginBottom: "10px" }}>
                <Radio value={addr.id}>
                  {addr.fullName}, {addr.street}, {addr.city}, {addr.state} -{" "}
                  {addr.postalCode}, {addr.country} ({addr.phone})
                </Radio>
              </Card>
            ))}
          </Radio.Group>

          <Button type="link" onClick={() => setAddingNew(true)}>
            + Add New Address
          </Button>
        </>
      )}

      {/* Add new address form */}
      {addingNew && (
        <>
          <h3>Add New Address</h3>
          <Form layout="vertical" onFinish={handlePlaceOrder}>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="street" label="Street" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="COD">Cash on Delivery</Select.Option>
                <Select.Option value="Card">Credit/Debit Card</Select.Option>
                <Select.Option value="UPI">UPI</Select.Option>
              </Select>
            </Form.Item>

            <Button type="primary" htmlType="submit">Place Order</Button>
            <Button type="link" onClick={() => setAddingNew(false)}>Cancel</Button>
          </Form>
        </>
      )}

      {/* Payment form for selected saved address */}
      {!addingNew && selectedAddressId && (
        <div style={{ marginTop: "20px" }}>
          <Form layout="vertical" onFinish={handlePlaceOrder}>
            <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="COD">Cash on Delivery</Select.Option>
                <Select.Option value="Card">Credit/Debit Card</Select.Option>
                <Select.Option value="UPI">UPI</Select.Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">Place Order</Button>
          </Form>
        </div>
      )}
    </div>
  );
}
