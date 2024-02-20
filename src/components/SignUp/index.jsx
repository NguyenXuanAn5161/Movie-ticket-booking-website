import { Button, Divider, Form, Input, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaFacebook, FaRegUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";

const SignUpForm = (props) => {
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
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callRegister(fullName, email, password, phone);
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success("Đăng ký tài khoản thành công!");
      props.setType("signIn");
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
    <>
      <div
        className={`form-container ${width > 768 ? "sign-up-container" : null}`}
        style={width > 768 ? null : { width: "100%" }}
      >
        <Form
          name="signUpForm"
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
          <h2>Đăng ký tài khoản</h2>
          <div className="social-container">
            <a href="#" className="social">
              <FaFacebook className="social-icon" />
            </a>
            <a href="#" className="social">
              <FcGoogle className="social-icon" />
            </a>
          </div>
          <span>hoặc sử dụng email của bạn để đăng ký</span>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Họ và tên"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<FaRegUser />}
              placeholder="Họ và tên"
            />
          </Form.Item>
          <Row>
            <Col>
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
            </Col>
            <Col>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MdOutlinePhone />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
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
            </Col>
            <Col>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Nhập lại mật khẩu"
                name="confirmpassword"
                rules={[
                  {
                    required: true,
                    message: "không được để trống!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<RiLockPasswordLine />}
                  placeholder="Nhập lại mật khẩu"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
          // wrapperCol={{ offset: 8, span: 16 }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="custom-button"
              loading={isSubmit}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        {width > 768 ? null : (
          <div className="footer">
            <Divider orientation="left">
              Nếu chưa có tài khoản{" "}
              <span
                style={{ color: "#3498db", cursor: "pointer" }}
                onClick={() => props.setType("signIn")}
              >
                Đăng nhập
              </span>
            </Divider>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUpForm;
