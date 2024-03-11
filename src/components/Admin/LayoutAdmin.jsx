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
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import Home from "../Home";
import "./layout.scss";

const { Content, Footer, Sider } = Layout;

// hàm tạo 1 mục menu
const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
};

// tạo các mục menu
const items = [
  getItem(
    <Link to="/admin/dashboard">Tổng quan</Link>,
    "dashboard",
    <AppstoreOutlined />
  ),
  getItem(
    <Link to="/admin/order">Quản lý đơn hàng</Link>,
    "order",
    <DollarCircleOutlined />
  ),
  getItem("Quản lý người dùng", "manageUser", <UserOutlined />, [
    getItem(<Link to="/admin/user">Người dùng</Link>, "user", <TeamOutlined />),
    getItem("Comming Soon", "commingsoon", <TeamOutlined />),
  ]),
  getItem("Quản lý rạp phim", "manageTheater", <GiTheater />, [
    getItem(<Link to="/admin/cinema">Rạp phim</Link>, "cinema", <GiTheater />),
    getItem(
      <Link to="/admin/cinema/room">Phòng chiếu</Link>,
      "room",
      <TbTheater />
    ),
    getItem(
      <Link to="/admin/cinema/room/seat">Ghế</Link>,
      "seat",
      <MdEventSeat />
    ),
    // getItem(
    //   <Link to="/admin/cinema/room/seatType">Loại ghế</Link>,
    //   "seatType",
    //   <BiCategoryAlt />
    // ),
  ]),
  getItem("Quản lý phim", "manageMovie", <RiMovie2Line />, [
    getItem(<Link to="/admin/movie">Phim</Link>, "movie", <RiMovie2Line />),
    getItem(
      <Link to="/admin/movieGenre">Thể loại phim</Link>,
      "movieGenre",
      <BiCategoryAlt />
    ),
  ]),
  getItem(<label>Quản lý đồ ăn</label>, "manageFood", <IoFastFoodOutline />, [
    getItem(<Link to="/admin/food">Đồ ăn</Link>, "food", <IoFastFoodOutline />),
    getItem(
      <Link to="/admin/foodCategories">Loại đồ ăn</Link>,
      "foodCategories",
      <BiCategoryAlt />
    ),
  ]),
  getItem(
    <Link to="/admin/promotion">Khuyến mãi</Link>,
    "promotion",
    <TbDiscount2 />
  ),
];

// Các keys của submenu cấp 1
const rootSubmenuKeys = [
  "manageUser",
  "manageTheater",
  "manageMovie",
  "manageFood",
];

const LayoutAdmin = () => {
  const [openKeys, setOpenKeys] = useState([]); // State để lưu các keys của submenu đang mở
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const currentPath = location.pathname;
  // lastIndexOf('a') lấy vị trí phần tử cuối cùng trong chuỗi
  // substring lấy chuỗi còn lại từ vị trí đó
  const lastSegment = pathname.substring(pathname.lastIndexOf("/") + 1);

  const user = useSelector((state) => state.account.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Hàm này xử lý sự kiện khi mở hoặc đóng một submenu
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys); // Mở submenu nếu chưa được mở
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []); // Đóng các submenu khác nếu đã mở
    }
  };

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
          openKeys={openKeys}
          selectedKeys={[lastSegment]}
          mode="inline"
          items={items}
          onOpenChange={onOpenChange}
          onClick={(e) => {
            setCollapsed(collapsed);
          }}
        />
      </Sider>
      <Layout style={{ backgroundColor: "white" }}>
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
        <Content
          style={{
            backgroundColor: "#F5F5F5",
            padding: 10,
          }}
        >
          {currentPath === "/admin" ? <Home /> : <CustomBreadcrumb />}
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
