import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../services/api";

// thay đổi #1
const SeatCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // thay đổi #1
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Tạo mới rạp phim thành công!");
      form.resetFields();
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/admin/cinema");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };

  return (
    <>
      {/* // thay đổi #1 title */}
      <PageHeader title="Tạo mới rạp phim" numberBack={-1} type="create" />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới rạp phim" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="code"
                label="Mã rạp"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã rạp!",
                  },
                ]}
              >
                <Input placeholder="Nhập mã rạp" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên rạp"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên rạp!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên rạp" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tổng số phòng"
                name="totalRoom"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tổng số phòng!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng số phòng"
                  min={5}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Địa chỉ"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ của rạp!",
                  },
                ]}
              >
                <Input.TextArea
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng số phòng"
                  min={5}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default SeatCreate;
