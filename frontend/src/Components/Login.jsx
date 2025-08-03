import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import api from "../api/api";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🚫 Redirect to /home if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
  
      // Save token & role
      localStorage.setItem("token", res.data.token);
      if (res.data.user?.role) {
        localStorage.setItem("role", res.data.user.role);
      } else {
        console.warn("No role in login response");
      }
      localStorage.setItem("userName", res.data.user?.name || "User");
      message.success("Login successful!");
      navigate("/home", { replace: true });
    } catch (err) {
      message.error(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px"
      }}
    >
      <h2>Login</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      <p style={{ textAlign: "center" }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
