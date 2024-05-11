import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { getErrorMessageUser } from "../../utils/errorHandling";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUsername,
} from "../../utils/validData";

const UserCreate = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsSubmit(true);
    const res = await callCreateMor(values);
    if (res?.status === 200) {
      message.success("Tạo mới nhân viên thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/user");
    } else {
      const errorDescription = getErrorMessageUser(res.response.data.message);
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: errorDescription,
      });
      setIsSubmit(false);
    }
  };

  return (
    <div>
      <PageHeader title="Tạo mới nhân viên" numberBack={-1} type="create" />
      <Divider />
      <Card title="Tạo mới nhân viên" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
        >
          <Row gutter={16}>
            {/* <Col
              span={8}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                src={logo}
                preview={false}
                style={{
                  width: "90%",
                  height: "auto",
                  resizeMode: "contain",
                }}
              />
            </Col> */}
            <Col span={24}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Họ và tên"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống!",
                      },
                      {
                        validator: validateUsername,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Giới tính"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Giới tính không được để trống!",
                      },
                    ]}
                    initialValue={"true"}
                  >
                    <Radio.Group>
                      <Radio value="true">Nam</Radio>
                      <Radio value="false">Nữ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Email không được để trống!",
                      },
                      { validator: validateEmail },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại không được để trống!",
                      },
                      {
                        validator: validatePhoneNumber,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Mật khẩu không được để trống!",
                      },
                      {
                        validator: validatePassword,
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Col
            span={24}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Tạo mới
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </Card>
    </div>
  );
};

export default UserCreate;
