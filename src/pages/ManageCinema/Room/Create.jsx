import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../../services/api";

// thay đổi #1
const RoomCreate = () => {
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
      message.success("Tạo mới phòng chiếu thành công!");
      form.resetFields();
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/admin/cinema/room");
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
      <PageHeader title="Tạo mới phòng chiếu" numberBack={-1} type="create" />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới phòng chiếu" bordered={false}>
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
                label="Mã phòng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã phòng!",
                  },
                ]}
              >
                <Input placeholder="Nhập mã phòng" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên phòng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên phòng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên phòng" />
              </Form.Item>
            </Col>
            <Row style={{ width: "100%" }}>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Loại phòng"
                  name="typeRoom"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại phòng!",
                    },
                  ]}
                >
                  <Select style={{ width: "100%" }} defaultValue={"2D"}>
                    <Select.Option value="2D">2D</Select.Option>
                    <Select.Option value="3D">3D</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ width: "100%" }}>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Tổng số ghế"
                  name="totalSeat"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tổng số ghế!",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Nhập tổng số ghế"
                    min={30}
                  />
                </Form.Item>
              </Col>
            </Row>
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

export default RoomCreate;
