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
import React, { useEffect, useState } from "react";
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

const items = [
  {
    label: <Link to="/admin/dashboard">Tổng quan</Link>,
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
    key: "manageUser",
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
    key: "manageTheater",
    children: [
      {
        label: <Link to="/admin/cinema">Rạp phim</Link>,
        key: "cinema",
        icon: <GiTheater />,
      },
      {
        label: <Link to="/admin/cinema/room">Phòng chiếu</Link>,
        key: "room",
        icon: <TbTheater />,
      },
      {
        label: <Link to="/admin/cinema/room/seat">Ghế</Link>,
        key: "seat",
        icon: <MdEventSeat />,
      },
      {
        label: <Link to="/admin/cinema/room/seatType">Loại ghế</Link>,
        key: "seatType",
        icon: <BiCategoryAlt />,
      },
    ],
  },
  {
    label: <label>Quản lý phim</label>,
    icon: <RiMovie2Line />,
    key: "manageMovie",
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
    key: "manageFood",
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
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();
  const { pathname } = location;
  const currentPath = location.pathname;
  const [openKeys, setOpenKeys] = useState([]);
  // lastIndexOf('a') lấy vị trí phần tử cuối cùng trong chuỗi
  // substring lấy chuỗi còn lại từ vị trí đó
  const lastSegment = pathname.substring(pathname.lastIndexOf("/") + 1);

  const user = useSelector((state) => state.account.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("openkeys: ", openKeys);
  }, [openKeys]);

  // Hàm xử lý sự kiện khi một sub-menu được mở
  const handleSubMenuOpen = (key) => {
    setOpenKeys((prevOpenKeys) => {
      if (prevOpenKeys.includes(key)) {
        return prevOpenKeys.filter((k) => k !== key);
      } else {
        return [...prevOpenKeys, key];
      }
    });
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
        {/* <Menu
          openKeys={openKeys}
          selectedKeys={[lastSegment]}
          mode="inline"
          items={items}
          onClick={(e) => {
            setCollapsed(collapsed);
          }}
        /> */}
        <Menu
          mode="inline"
          openKeys={openKeys}
          selectedKeys={[lastSegment]}
          onClick={(e) => {
            const { key } = e;
            const subMenuKeys = items.map((item) => item.key);
            if (!subMenuKeys.includes(key)) {
              // Nếu không phải là sub-menu thì đóng toàn bộ các sub-menu
              setOpenKeys([]);
              // Kiểm tra xem key này thuộc subMenuKeys nào
              items.forEach((item) => {
                if (
                  item.children &&
                  item.children.some((child) => child.key === key)
                ) {
                  setOpenKeys([item.key]);
                }
              });
            }
          }}
          onOpenChange={(keys) => {
            console.log("keys onchange: ", keys);
            // Xóa các key đã có trong mảng keys
            const newOpenKeys = keys.filter((key) => !openKeys.includes(key));
            // Thêm key hiện tại vào mảng mới
            setOpenKeys(newOpenKeys);
          }}
        >
          {items.map((item) => {
            if (item.children) {
              return (
                <Menu.SubMenu
                  key={item.key}
                  title={
                    <span>
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                  }
                  onTitleClick={() => handleSubMenuOpen(item.key)}
                >
                  {item.children.map((child) => (
                    <Menu.Item key={child.key} icon={child.icon}>
                      {child.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              );
            }
          })}
        </Menu>
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
