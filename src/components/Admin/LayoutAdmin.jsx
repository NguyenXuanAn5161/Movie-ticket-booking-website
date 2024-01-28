import {
  AppstoreOutlined,
  DollarCircleOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Space, message } from "antd";
import React, { useState } from "react";
import { RiMovie2Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";
import "./layout.scss";

const { Content, Footer, Sider } = Layout;

const items = [
  {
    label: <Link to="/admin">Tổng quan</Link>,
    key: "dashboard",
    icon: <AppstoreOutlined />,
  },
  {
    label: <label>Quản lý người dùng</label>,
    icon: <UserOutlined />,
    children: [
      {
        label: <Link to="/admin/user">CRUD</Link>,
        key: "crud",
        icon: <TeamOutlined />,
      },
      {
        label: "Files1",
        key: "file1",
        icon: <TeamOutlined />,
      },
    ],
  },
  {
    label: <Link to="/admin/movie">Quản lý phim</Link>,
    key: "movie",
    icon: <RiMovie2Line />,
  },
  {
    label: <Link to="/admin/order">Quản lý đơn hàng</Link>,
    key: "order",
    icon: <DollarCircleOutlined />,
  },
];

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const user = useSelector((state) => state.account.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success(res.data);
      navigate("/");
    }
  };

  const itemsDropdown = [
    {
      label: (
        <Link className="custom-link" to={"/"} style={{ cursor: "pointer" }}>
          Trang chủ
        </Link>
      ),
      key: "home",
    },
    {
      label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
      key: "account",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <Sider
        width={230}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 32, margin: 16, textAlign: "center" }}>Admin</div>
        <Menu
          defaultSelectedKeys={[activeMenu]}
          mode="inline"
          items={items}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <span>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </span>
          <Dropdown menu={{ items: itemsDropdown }} trigger={["hover"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar src={urlAvatar} />
                {user?.fullName}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <Content style={{ margin: 10 }}>
          <Outlet />
        </Content>
        {/* <Footer style={{ padding: 0 }}>
          &copy; {new Date().getFullYear()} Made with <HeartTwoTone />
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
