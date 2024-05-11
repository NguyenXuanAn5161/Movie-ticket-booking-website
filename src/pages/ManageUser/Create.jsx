import {
  Button,
  Card,
  Col,
  DatePicker,
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
import { callCreateUser } from "../../services/apiUser";
import { getErrorMessageUser } from "../../utils/errorHandling";

const UserCreate = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { username, email, gender, birthday, phone, password } = values;
    const bd = birthday.format("YYYY-MM-DD");
    setIsSubmit(true);
    const res = await callCreateUser(
      username,
      email,
      gender,
      bd,
      phone,
      password
    );
    if (res?.status === 200) {
      message.success("Tạo mới người dùng thành công!");
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
      <PageHeader title="Tạo mới người dùng" numberBack={-1} type="create" />
      <Divider />
      <Card title="Tạo mới người dùng" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ maxWidth: "70%", margin: "0 auto" }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Họ và tên"
                name="username"
                rules={[
                  { required: true, message: "Họ và tên không được để trống!" },
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
                  { required: true, message: "Giới tính không được để trống!" },
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
                label="Ngày sinh"
                name="birthday"
                rules={[
                  { required: true, message: "Ngày sinh không được để trống!" },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày sinh" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email không được để trống!" },
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
                  { required: true, message: "Mật khẩu không được để trống!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={24}>
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
