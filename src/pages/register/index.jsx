import { Button, Divider, Form, Input, message, notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";
import "./register.scss";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callRegister(fullName, email, password, phone);
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description:
          res.message && Array.isArray(res.message.length) > 0
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  };

  return (
    <div className="register-container">
      <div
        className="register-form"
        style={{
          margin: "auto",
          maxWidth: 500,
        }}
      >
        <div className="register-header">
          <h1 style={{ textAlign: "center" }}>Đăng ký tài khoản</h1>
        </div>
        <Divider />
        <Form
          name="basic"
          style={{
            maxWidth: 450,
            margin: "0 auto",
          }}
          onFinish={onFinish}
          autoComplete="true"
        >
          <Form.Item
            labelCol={{ span: 24 }}
            label="Họ và tên"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Họ và tên không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Mật khẩu không được để trống!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Số điện thoại không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
          // wrapperCol={{ offset: 8, span: 16 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmit}
              style={{ width: "100%" }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <Divider>Hoặc</Divider>
        <p>
          Đã có tài khoản?
          <span className="text-normal">
            <Link
              style={{ textDecoration: "none", color: "#1677ff" }}
              to="/login"
            >
              {" "}
              Đăng nhập
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
