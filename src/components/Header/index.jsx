import { Avatar, Divider, Drawer, Dropdown, Menu, Space, message } from "antd";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaAlignJustify } from "react-icons/fa6";
import { PiFilmReel } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";
import "./header.scss";

const Header = () => {
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
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  // menu header
  const nav = [
    {
      label: "Phim",
      key: "film",
      children: [
        {
          // type: "group",
          label: "Item 1",
          key: "film1",
        },
        {
          type: "group",
          label: "Item 2",
          key: "film2",
        },
      ],
    },
    {
      label: "Thể loại phim",
      key: "category",
      children: [
        { label: "Item 1", key: "item1" },
        { type: "group", label: "Item 2", key: "item2" },
      ],
    },
    {
      label: "Sự kiện",
      key: "event",
      children: [
        { label: "Khuyến mãi", key: "promotion" },
        { label: "Combo đồ ăn", key: "comboFood" },
      ],
    },
    {
      label: "Rạp",
      key: "cinema",
      children: [
        { label: "Quang Trung", key: "CQT" },
        { label: "Gò Vấp", key: "CGV" },
      ],
    },
  ];

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                // !openDrawer
                setOpenDrawer(true);
              }}
            >
              <FaAlignJustify />
            </div>
            <div className="page-header__logo">
              <span className="logo">
                <PiFilmReel className="rotate icon-react" /> Movie
              </span>
            </div>
            <Menu style={{ width: "100%" }} mode="horizontal" items={nav} />
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <CiSearch />
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space>
                      <Avatar src={urlAvatar} />
                      {user?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
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
    </>
  );
};

export default Header;
