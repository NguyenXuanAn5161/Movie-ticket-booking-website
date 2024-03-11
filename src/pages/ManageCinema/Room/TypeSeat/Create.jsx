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
import PageHeader from "../../../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../../../services/api";

// thay đổi #1
const SeatTypeCreate = () => {
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
    // if (res && res.data) {
    if (true) {
      // thay đổi #1 message
      message.success("Tạo mới rạp loại ghế thành công!");
      form.resetFields();
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/admin/cinema/room/seatType");
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
      <PageHeader title="Tạo mới loại ghế" numberBack={-1} type="create" />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới loại ghế" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên loại ghế"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại ghế!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên loại ghế" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá!",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  min={1000}
                  style={{ width: "100%" }}
                  addonAfter={"VND"}
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

export default SeatTypeCreate;
