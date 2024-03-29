import React from "react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div>
      <h1>Trang quản trị viên</h1>
      <p>Chào mừng đến với hệ thống quản trị viên!</p>
      <p>
        Bạn có thể quản lý các bộ phim, lịch chiếu, vé xem phim và người dùng.
      </p>
      <ul>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/order">Quản lý đơn đặt hàng</Link>
        </li>
        <li>
          <Link to="/admin/user">Quản lý người dùng</Link>
        </li>
        <li>
          <Link to="/admin/movie">Quản lý phim</Link>
        </li>
        {/* Thêm các liên kết khác ở đây tương ứng với các trang bạn muốn */}
      </ul>
    </div>
  );
};

export default AdminHome;
