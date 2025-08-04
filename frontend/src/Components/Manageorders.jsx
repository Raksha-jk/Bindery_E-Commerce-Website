// ManageOrders.jsx
import { useEffect, useState } from "react";
import { Table, Tag, Select, message } from "antd";
import api from "../api/api";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get("/orders/manage", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setOrders(res.data))
      .catch(() => message.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = (id, newStatus) => {
    api.put(`/orders/${id}/status`, { status: newStatus }, {
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
    {
      title: "Status",
      render: (record) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={(value) => updateStatus(record.id, value)}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Shipped">Shipped</Select.Option>
          <Select.Option value="Delivered">Delivered</Select.Option>
          <Select.Option value="Cancelled">Cancelled</Select.Option>
        </Select>
      )
    },
    {
      title: "Items",
      render: (record) => (
        <ul>
          {record.OrderItems.map(item => (
            <li key={item.id}>
              <img src={item.Book?.imageUrl} alt={item.Book?.title} width="40" />{" "}
              {item.Book?.title} × {item.quantity}
            </li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Orders</h2>
      <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} />
    </div>
  );
}
