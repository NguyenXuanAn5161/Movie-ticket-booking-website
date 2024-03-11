import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Tag,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader/PageHeader";
import { callUpdateUser } from "../../../../services/api";

const SeatEdit = () => {
  // thay đổi #1
  const seat = useSelector((state) => state.seat.seat);
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(seat); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [seat, form]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

  const onFinish = async (values) => {
    console.log("value check: ", values);
    // thay đổi #1
    const { _id, fullName, phone } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callUpdateUser(_id, fullName, phone);
    // if (res && res.data) {
    if (true) {
      // thay đổi #1 message và url
      message.success("Cập nhật ghế thành công!");
      navigate("/admin/cinema/room/seat");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <PageHeader title="Cập nhật thông tin ghế" numberBack={-1} type="edit" />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col span={8}>
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
            <Col span={8}>
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
                <Input style={{ width: "100%" }} placeholder="Nhập cột ghế" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Trạng thái"
                name="isBooked"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
              >
                <Tag color={seat?.isBooked ? "success" : "error"}>
                  {seat?.isBooked ? "Đã đặt" : "Chưa đặt"}
                </Tag>
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
              <Button loading={isSubmit} type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default SeatEdit;
