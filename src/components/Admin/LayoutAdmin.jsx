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
import { BiCategoryAlt } from "react-icons/bi";
import { GiTheater } from "react-icons/gi";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdEventSeat } from "react-icons/md";
import { RiMovie2Line } from "react-icons/ri";
import { TbDiscount2, TbTheater } from "react-icons/tb";
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
    label: <Link to="/admin/order">Quản lý đơn hàng</Link>,
    key: "order",
    icon: <DollarCircleOutlined />,
  },
  {
    label: <label>Quản lý người dùng</label>,
    icon: <UserOutlined />,
    children: [
      {
        label: <Link to="/admin/user">Người dùng</Link>,
        key: "user",
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
    label: <label>Quản lý rạp phim</label>,
    icon: <GiTheater />,
    children: [
      {
        label: <Link to="/admin/cinema">Rạp phim</Link>,
        key: "food",
        icon: <GiTheater />,
      },
      {
        label: <Link to="/admin/room">Phòng chiếu</Link>,
        key: "room",
        icon: <TbTheater />,
      },
      {
        label: <Link to="/admin/room/seat">Ghế</Link>,
        key: "seat",
        icon: <MdEventSeat />,
      },
      {
        label: <Link to="/admin/room/seatType">Loại ghế</Link>,
        key: "seatType",
        icon: <BiCategoryAlt />,
      },
    ],
  },
  {
    label: <label>Quản lý phim</label>,
    icon: <RiMovie2Line />,
    children: [
      {
        label: <Link to="/admin/movie">Phim</Link>,
        key: "movie",
        icon: <RiMovie2Line />,
      },
      {
        label: <label>Thể loại phim</label>,
        key: "movieCategories",
        icon: <BiCategoryAlt />,
      },
    ],
  },
  {
    label: <label>Quản lý đồ ăn</label>,
    icon: <IoFastFoodOutline />,
    children: [
      {
        label: <Link to="/admin/food">Đồ ăn</Link>,
        key: "food",
        icon: <IoFastFoodOutline />,
      },
      {
        label: <Link to="/admin/foodCategories">Loại đồ ăn</Link>,
        key: "foodCategories",
        icon: <BiCategoryAlt />,
      },
    ],
  },
  {
    label: <Link to="/admin/promotion">Khuyến mãi</Link>,
    key: "promotion",
    icon: <TbDiscount2 />,
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
      navigate("/login");
    }
  };

  const itemsDropdown = [
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
