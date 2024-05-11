import { Button, Divider, Form, Input, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLoginAction } from "../../redux/account/accountSlice";
import { callLogin } from "../../services/apiAuthor";

const SignInForm = (props) => {
  const dispatch = useDispatch();
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

  const onFinish = async (values) => {
    const { email, password } = values;
    setIsSubmit(true);
    const res = await callLogin(email, password);
    setIsSubmit(false);
    if (res?.data) {
      console.log(res.data);
      if (res?.data?.roles?.some((role) => role === "ROLE_ADMIN")) {
        // lưu access token
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(doLoginAction(res.data));
        message.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        message.error("Tài khoản của bạn không đủ quyền để vào trang này!");
      }
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: "Vui lòng kiểm tra lại thông tin đăng nhập!",
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
          name="email"
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
