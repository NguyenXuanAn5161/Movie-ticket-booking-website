import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button type="primary" onClick={() => navigate("/admin/dashboard")}>
          Trở về trang tổng quan
        </Button>
      }
    />
  );
};
export default NotFound;
