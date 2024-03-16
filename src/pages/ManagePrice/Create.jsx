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

const PriceCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      message.success("Tạo mới giá sản phẩm thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/admin/price");
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
      <PageHeader title="Tạo mới giá sản phẩm" numberBack={-1} type="create" />
      <Divider />
      <Card title="Tạo mới giá sản phẩm" bordered={false}>
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
                label="Mã giá sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã giá sản phẩm!",
                  },
                ]}
              >
                <Input placeholder="Nhập mã giá sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên giá sản phẩm"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên giá sản phẩm!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên giá sản phẩm" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="startDate"
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
                name="endDate"
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
          <Row gutter={[20]}>
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

export default PriceCreate;
