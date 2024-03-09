import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../services/api";

const PromotionCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      message.success("Tạo mới người dùng thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/admin/promotion");
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
      <PageHeader title="Tạo mới khuyến mãi" numberBack={-1} type="create" />
      <Divider />
      <Card title="Tạo mới khuyến mãi" bordered={false}>
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
                label="Mã Khuyến Mãi"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã khuyến mãi!",
                  },
                ]}
              >
                <Input placeholder="Nhập mã khuyến mãi" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên khuyến mãi"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khuyến mãi!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên khuyến mãi" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="start_date"
                label="Ngày Bắt Đầu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày bắt đầu!",
                  },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="end_date"
                label="Ngày Kết Thúc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày kết thúc!",
                  },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="description"
                label="Mô Tả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Nhập mô tả" />
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

export default PromotionCreate;
