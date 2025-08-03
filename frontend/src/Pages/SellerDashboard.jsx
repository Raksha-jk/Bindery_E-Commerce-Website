import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Card,
  Typography,
  Space
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../api/api";

const { Title } = Typography;

export default function SellerDashboard() {
  const [books, setBooks] = useState([]);
  const [file, setFile] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // ✅ Fetch seller's books
  const fetchBooks = async () => {
    try {
      const res = await api.get("/book/my-books", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBooks(res.data);
    } catch (err) {
      message.error("Error fetching books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ✅ Add book
  const handleAdd = async (values) => {
    if (!file) {
      message.error("Please upload a book image");
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.append(key, val));
    formData.append("image", file);

    try {
      await api.post("/book", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      message.success("Book added successfully");
      setAddModalVisible(false);
      fetchBooks();
    } catch (err) {
      message.error("Error adding book");
    }
  };

  // ✅ Update book
  const handleUpdate = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.append(key, val));
    if (file) formData.append("image", file);

    try {
      await api.put(`/book/${editingBook.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      message.success("Book updated successfully");
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      message.error("Error updating book");
    }
  };

  // ✅ Delete book
  const handleDelete = async (id) => {
    try {
      await api.delete(`/book/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      message.success("Book deleted");
      fetchBooks();
    } catch (err) {
      message.error("Error deleting book");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Author", dataIndex: "author" },
    { title: "Price", dataIndex: "price" },
    { title: "Stock", dataIndex: "stock" },
    {
      title: "Image",
      render: (record) => (
        <img
          src={record.imageUrl}
          alt={record.title}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      )
    },
    {
      title: "Actions",
      render: (record) => (
        <Space>
          <Button type="primary" onClick={() => setEditingBook(record)}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: "20px" }}>
        <Title level={3}>📚 Seller Dashboard</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          Add New Book
        </Button>
      </Space>

      {/* Books Table */}
      <Card>
        <Table columns={columns} dataSource={books} rowKey="id" />
      </Card>

      {/* Add Book Modal */}
      <Modal
        title="Add New Book"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAdd}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="category_id" label="Category ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Image">
            <Upload beforeUpload={(file) => { setFile(file); return false; }} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit">Add Book</Button>
        </Form>
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        title="Edit Book"
        open={!!editingBook}
        onCancel={() => setEditingBook(null)}
        footer={null}
      >
        {editingBook && (
          <Form
            layout="vertical"
            initialValues={editingBook}
            onFinish={handleUpdate}
          >
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="author" label="Author" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Image">
              <Upload beforeUpload={(file) => { setFile(file); return false; }} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select New Image</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit">Update Book</Button>
          </Form>
        )}
      </Modal>
    </div>
  );
}
