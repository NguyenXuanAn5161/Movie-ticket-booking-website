import {
  AppstoreOutlined,
  DollarCircleOutlined,
  HeartTwoTone,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, Space, message } from "antd";
import React, { useState } from "react";
import { BiCategoryAlt } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { GiTheater } from "react-icons/gi";
import { GrSchedules } from "react-icons/gr";
import {
  IoFastFoodOutline,
  IoPricetagsOutline,
  IoStatsChartOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { RiMovie2Line } from "react-icons/ri";
import { TbDiscount2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import avatarDefault from "../../assets/logo/avatarDefault.png";
import DashBoardShow from "../../pages/dashboard/Show";
import { doLogoutAction } from "../../redux/account/accountSlice";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import LogoApp from "../LogoApp/LogoApp";
import ProtectedRoute from "../ProtectedRoute";
import "./layout.scss";

const { Content, Footer, Sider, Header } = Layout;

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

  const dispatch = useDispatch();

  const handleLogout = async () => {
    // const res = await callLogout();
    // if (res?.data) {
    dispatch(doLogoutAction());
    message.success("Đăng xuất thành công!");
    // }
  };

  // tạo các mục menu
  const items = [
    getItem(
      collapsed ? null : "Tổng quan",
      "grpDashboard",
      null,
      [
        getItem(
          <Link to="/dashboard">Tổng quan</Link>,
          "dashboard",
          <AppstoreOutlined />
        ),
        getItem("Thống kê", "statistical", <IoStatsChartOutline />, [
          getItem(
            <Link to="/statisticalCinema">Doanh thu theo rạp</Link>,
            "statisticalCinema"
          ),
          getItem(
            <Link to="/statisticalMovie">Doanh thu theo phim</Link>,
            "statisticalMovie"
          ),
          getItem(
            <Link to="/statisticalUser">Doanh thu theo khách hàng</Link>,
            "statisticalUser"
          ),
          getItem(
            <Link to="/statisticalStaff">Doanh số bán theo nhân viên</Link>,
            "statisticalStaff"
          ),
          getItem(
            <Link to="/statisticalReturnInvoice">Thống kê trả hóa đơn</Link>,
            "statisticalReturnInvoice"
          ),
          getItem(
            <Link to="/statisticalPromotion">Thống kê khuyến mãi</Link>,
            "statisticalPromotion"
          ),
        ]),
      ],
      "group"
    ),
    getItem(
      collapsed ? null : "Thông tin cơ bản",
      "grpData",
      null,
      [
        getItem(
          <Link to="/order">Quản lý hoá đơn</Link>,
          "order",
          <DollarCircleOutlined />
        ),
        getItem(
          <Link to="/returnInvoice">Quản lý hoá đơn trả</Link>,
          "returnInvoice",
          <DollarCircleOutlined />
        ),
        // getItem("Quản lý người dùng", "manageUser", <UserOutlined />, [
        getItem(
          <Link to="/user">Quản lý người dùng</Link>,
          "user",
          <TeamOutlined />
        ),
        //   getItem("Comming Soon", "commingsoon", <TeamOutlined />),
        // ]),
        // getItem("Quản lý rạp phim", "manageTheater", <GiTheater />, [
        getItem(
          <Link to="/cinema">Quản lý rạp phim</Link>,
          "cinema",
          <GiTheater />
        ),
        // getItem(
        //   <Link to="/cinema/room">Phòng chiếu</Link>,
        //   "room",
        //   <TbTheater />
        // ),
        // getItem(
        //   <Link to="/cinema/room/seat">Ghế</Link>,
        //   "seat",
        //   <MdEventSeat />
        // ),
        // getItem(
        //   <Link to="/cinema/room/seatType">Loại ghế</Link>,
        //   "seatType",
        //   <BiCategoryAlt />
        // ),
        // ]),
        getItem("Quản lý phim", "manageMovie", <RiMovie2Line />, [
          getItem(<Link to="/movie">Phim</Link>, "movie", <RiMovie2Line />),
          getItem(
            <Link to="/movieGenre">Thể loại phim</Link>,
            "movieGenre",
            <BiCategoryAlt />
          ),
          getItem(
            <Link to="/schedule">Lịch chiếu phim</Link>,
            "schedule",
            <GrSchedules />
          ),
        ]),
        getItem("Quản lý đồ ăn", "manageFood", <IoFastFoodOutline />, [
          getItem(<Link to="/food">Đồ ăn</Link>, "food", <IoFastFoodOutline />),
          getItem(
            <Link to="/foodCategories">Loại đồ ăn</Link>,
            "foodCategories",
            <BiCategoryAlt />
          ),
        ]),
        getItem(
          <Link to="/price">Quản lý giá bán</Link>,
          "price",
          <IoPricetagsOutline />
        ),
        getItem(
          <Link to="/promotion">Quản lý khuyến mãi</Link>,
          "promotion",
          <TbDiscount2 />
        ),
      ],
      "group"
    ),
    { type: "divider" },
    getItem(
      collapsed ? null : "Đặt vé",
      "grpAction",
      null,
      [
        getItem(
          <Link to="/booking">Đặt vé</Link>,
          "booking",
          <IoTicketOutline />
        ),
      ],
      "group"
    ),
    { type: "divider" },
    getItem(
      collapsed ? null : "Đăng xuất",
      "grpAccount",
      null,
      [
        getItem(
          <Link to="/login" onClick={handleLogout}>
            Đăng xuất
          </Link>,
          "logout",
          <CiLogout />
        ),
      ],
      "group"
    ),
  ];

  // Các keys của submenu cấp 1
  const rootSubmenuKeys = [
    "manageUser",
    "manageTheater",
    "manageMovie",
    "manageFood",
  ];

  // Hàm này xử lý sự kiện khi mở hoặc đóng một submenu
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys); // Mở submenu nếu chưa được mở
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []); // Đóng các submenu khác nếu đã mở
    }
  };

  return (
    <Layout hasSider>
      <Sider
        breakpoint="lg"
        collapsedWidth="50"
        width={230}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div>
          <Link
            to="/dashboard"
            style={{
              height: 32,
              margin: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            }}
          >
            <LogoApp style={{ cursor: "pointer" }} />
            <span
              style={{
                marginLeft: 10,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 18,
                display: collapsed ? "none" : "",
              }}
            >
              InfinityCine
            </span>
          </Link>
        </div>
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
      <Layout>
        <Header style={{ backgroundColor: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </span>
            <Space>
              <Avatar src={user?.avatar || avatarDefault} />
              {user?.username}
            </Space>
          </div>
        </Header>
        <Content style={{ backgroundColor: "#F5F5F5", padding: 10 }}>
          {currentPath === "/" ? (
            <ProtectedRoute>
              <DashBoardShow />
            </ProtectedRoute>
          ) : (
            <CustomBreadcrumb />
          )}
          <Outlet />
        </Content>
        <Footer style={{ padding: 0, textAlign: "center" }}>
          &copy; {new Date().getFullYear()} Infinity Cinema <HeartTwoTone />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
