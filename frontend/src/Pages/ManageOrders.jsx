// src/Pages/ManageOrders.jsx
import { useEffect, useState } from "react";
import { Table, Select, message } from "antd";
import api from "../api/api";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    api.get("/orders/manage", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setOrders(res.data))
    .catch(() => message.error("Failed to load orders"));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = (id, status) => {
    api.put(`/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => {
      message.success("Status updated");
      fetchOrders();
    })
    .catch(() => message.error("Failed to update status"));
  };

  const columns = [
    { title: "Order ID", dataIndex: "id" },
    { title: "Total", dataIndex: "totalAmount" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select value={status} onChange={(value) => updateStatus(record.id, value)}>
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Processing">Processing</Select.Option>
          <Select.Option value="Shipped">Shipped</Select.Option>
          <Select.Option value="Delivered">Delivered</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Orders</h2>
      <Table columns={columns} dataSource={orders} rowKey="id" />
    </div>
  );
}
