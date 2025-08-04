import { useEffect, useState } from "react";
import api from "../api/api";
import { Table, Tag, message } from "antd";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my-orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => setOrders(res.data))
      .catch(() => message.error("Error loading orders"));
  }, []);

  const columns = [
    { title: "Order ID", dataIndex: "id" },
    { title: "Total Amount", dataIndex: "totalAmount", render: (v) => `₹${v}` },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "default";
        if (status === "Pending") color = "orange";
        if (status === "Processing") color = "blue";
        if (status === "Shipped") color = "purple";
        if (status === "Delivered") color = "green";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { title: "Date", dataIndex: "createdAt", render: (d) => new Date(d).toLocaleString() }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>
      <Table columns={columns} dataSource={orders} rowKey="id" />
    </div>
  );
}
