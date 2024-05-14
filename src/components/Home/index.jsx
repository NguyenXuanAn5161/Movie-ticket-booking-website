import { Card } from "antd";
import React from "react";
import "./AdminHome.css";

const AdminHome = () => {
  return (
    <Card className="admin-home" style={{ height: "100vh" }}>
      <h1>Trang quản trị viên</h1>
      <p>Chào mừng đến với hệ thống quản trị viên!</p>
      <p>
        Bạn có thể quản lý các bộ phim, lịch chiếu, vé xem phim và người dùng.
      </p>
      {/* <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/order">Quản lý đơn đặt hàng</Link>
        </li>
        <li>
          <Link to="/user">Quản lý người dùng</Link>
        </li>
        <li>
          <Link to="/movie">Quản lý phim</Link>
        </li>
      </ul> */}
    </Card>
  );
};

export default AdminHome;
