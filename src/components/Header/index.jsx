import { Avatar, Divider, Drawer, Dropdown, Menu, Space, message } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo.jpg";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";
import "./header.scss";

const itemsMenu = [
  {
    label: "Phim",
    key: "movie",
    children: [
      {
        type: "dangchieu",
        label: "Phim đang chiếu",
        children: [
          {
            label: "api phim",
            key: "setting:1",
          },
          {
            label: "api phim",
            key: "setting:2",
          },
        ],
      },
      {
        type: "sapchieu",
        label: "Phim sắp chiếu",
        children: [
          {
            label: "api phim",
            key: "setting:3",
          },
          {
            label: "api phim",
            key: "setting:4",
          },
        ],
      },
    ],
  },
  {
    label: "Thể loại phim",
    key: "categoryMovie",
    // disabled: true,
    children: [{ label: "api thể loại", key: "api1" }],
  },
  {
    label: "Sự kiện",
    key: "eventSubmenu",
    children: [
      {
        label: "Khuyến mãi",
        key: "promotion",
      },
      {
        label: "Combo đồ ăn",
        key: "comboFood",
      },
    ],
  },
];

const Header = () => {
  const [current, setCurrent] = useState("movie");
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
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

  //submenu tai khoan
  let items = [
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

  if (user?.role === "ADMIN") {
    items.unshift({
      label: (
        <Link className="custom-link" to="/admin">
          Trang quản trị
        </Link>
      ),
      key: "admin",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  const onClick = (e) => {
    // console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div className="custom-wrapper">
      <div className="container">
        <div className="container-header d-flex">
          <div className="container-header__left">
            <Link to={"/"}>
              <img className="logo" src={logo} alt="logo" />
            </Link>
          </div>
          <div className="container-header__center">
            <Menu
              className="center-menu custom-menu"
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={itemsMenu}
            />
          </div>
          <div className="container-header__right">
            {!isAuthenticated ? (
              <span className="custom-menu" onClick={() => navigate("/login")}>
                Tài khoản
              </span>
            ) : (
              <Dropdown menu={{ items }} trigger={["hover"]}>
                <Space className="custom-menu" style={{ cursor: "pointer" }}>
                  <Avatar src={urlAvatar} />
                  {user?.fullName}
                </Space>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />
        <p>Đăng xuất</p>
        <Divider />
      </Drawer>
    </div>
  );
};

export default Header;
