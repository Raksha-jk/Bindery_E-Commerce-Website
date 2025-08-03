import { Layout, Menu, Dropdown, Avatar, Typography } from "antd";
import { UserOutlined, LogoutOutlined, HomeOutlined, ShoppingCartOutlined, ShopOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // ✅ Always lowercase role for safe comparison
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole.toLowerCase());
    }
    const storedUser = localStorage.getItem("userName");
    if (storedUser) setUserName(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="username" disabled>
        <Text strong>{userName}</Text> <br />
        <Text type="secondary">{role}</Text>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 20px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      {/* Left: Logo + Name */}
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => navigate("/home")}
      >
        <img
          src="/images/logo.png"
          alt="Bindery Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
        <h2 style={{ margin: 0, fontWeight: "bold", color: "#000" }}>Bindery</h2>
      </div>

      {/* Right: Navigation + Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Menu mode="horizontal" selectable={false} style={{ borderBottom: "none" }}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/home">Home</Link>
          </Menu.Item>

          {/* ✅ Hide cart for sellers/admins */}
          {role && role !== "seller" && role !== "admin" && (
            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
              <Link to="/cart">Cart</Link>
            </Menu.Item>
          )}

          {/* ✅ Show seller dashboard for sellers/admins */}
          {role && (role === "seller" || role === "admin") && (
            <Menu.Item key="seller" icon={<ShopOutlined />}>
              <Link to="/seller">Seller Dashboard</Link>
            </Menu.Item>
          )}
        </Menu>

        {/* Profile Dropdown */}
        <Dropdown overlay={profileMenu} placement="bottomRight">
          <Avatar style={{ backgroundColor: "#1890ff", cursor: "pointer" }} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
