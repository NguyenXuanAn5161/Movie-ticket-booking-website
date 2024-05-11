import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../../../services/api";

// thay đổi #1
const SeatCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("check values: ", values);
    // thay đổi #1
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callCreateUser(fullName, email, password, phone);
    // if (res && res.data) {
    if (true) {
      // thay đổi #1 message
      message.success("Tạo mới ghế thành công!");
      form.resetFields();
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/cinema/room/seat");
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
      <PageHeader title="Tạo mới ghế" numberBack={-1} type="create" />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới ghế" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Hàng ghế"
                name="seatRow"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập hàng ghế!",
                  },
                ]}
              >
                <Input placeholder="Nhập hàng ghế" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Cột ghế"
                name="seatColumn"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập cột ghế!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập cột ghế"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Loại ghế"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại ghế!",
                  },
                ]}
                initialValue={"STD"}
              >
                <Radio.Group>
                  <Radio.Button value="STD">Ghế thường</Radio.Button>
                  <Radio.Button value="VIP">Ghế vip</Radio.Button>
                  <Radio.Button value="SWEET">Ghế đôi</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ghế thuộc phòng"
                name="room_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng!",
                  },
                ]}
              >
                <Select placeholder="Chọn phòng">
                  <Select.Option value="room_1">Phòng 1</Select.Option>
                  <Select.Option value="room_2">Phòng 2</Select.Option>
                </Select>
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
