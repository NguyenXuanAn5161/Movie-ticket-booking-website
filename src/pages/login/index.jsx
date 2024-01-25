import { Button, Divider, Form, Input, message, notification } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { doLoginAction } from "../../redux/account/accountSlice";
import { callLogin } from "../../services/api";
import "./login.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { username, password } = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    if (res?.data) {
      // lưu access token
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLoginAction(res.data.user));
      message.success("Đăng nhập thành công!");
      navigate("/");
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
    <div className="login-container">
      <div
        className="login-form"
        style={{
          margin: "auto",
          maxWidth: 500,
        }}
      >
        <div className="register-header">
          <h1 style={{ textAlign: "center" }}>Đăng nhập tài khoản</h1>
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
            label="Email"
            name="username"
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
          // wrapperCol={{ offset: 8, span: 16 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmit}
              style={{ width: "100%" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <Divider>Hoặc</Divider>
        <p>
          Chưa có tài khoản?
          <span className="text-normal">
            <Link
              style={{ textDecoration: "none", color: "#1677ff" }}
              to="/register"
            >
              {" "}
              Đăng ký
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
