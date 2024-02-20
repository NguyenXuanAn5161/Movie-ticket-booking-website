import { Button, Divider, Form, Input, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLoginAction } from "../../redux/account/accountSlice";
import { callLogin } from "../../services/api";

const SignInForm = (props) => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      // Lấy chiều rộng
      const windowWidth = window.innerWidth;
      setWidth(windowWidth);
    };

    // Đăng ký event listener để lắng nghe sự kiện resize
    window.addEventListener("resize", handleResize);

    // Cleanup: Loại bỏ event listener khi component bị unmount để tránh rò rỉ bộ nhớ
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <div
      className="form-container sign-in-container"
      style={width > 768 ? null : { width: "100%" }}
    >
      <Form
        name="signInForm"
        style={
          width > 768
            ? {
                marginTop: "1em",
              }
            : { marginTop: "1em", width: "100%" }
        }
        onFinish={onFinish}
        autoComplete="true"
      >
        <h2>Đăng nhập tài khoản</h2>
        <div className="social-container">
          <a href="#" className="social">
            <FaFacebook className="social-icon" />
          </a>
          <a href="#" className="social">
            <FcGoogle className="social-icon" />
          </a>
        </div>
        <span>hoặc sử dụng tài khoản của bạn</span>
        <Form.Item
          labelCol={{ span: 24 }}
          label="Email"
          name="username"
          rules={[
            {
              required: true,
              message: "Không được để trống!",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MdOutlineMailOutline />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Không được để trống!",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<RiLockPasswordLine />}
            placeholder="Mật khẩu"
          />
        </Form.Item>
        <Form.Item style={{ justifyContent: "start", display: "flex" }}>
          <a href="#">Quên mật khẩu?</a>
        </Form.Item>
        <Form.Item>
          <Button
            loading={isSubmit}
            htmlType="submit"
            type="primary"
            className="custom-button"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      {width > 768 ? null : (
        <div className="footer">
          <Divider orientation="left">
            Nếu chưa có tài khoản{" "}
            <span
              style={{ color: "#3498db", cursor: "pointer" }}
              onClick={() => props.setType("signUp")}
            >
              Đăng ký
            </span>
          </Divider>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
