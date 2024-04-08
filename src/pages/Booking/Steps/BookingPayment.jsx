import { Button, DatePicker, Form, Input, Select } from "antd";
import React from "react";
import { callGetPromotionByCode } from "../../../services/apiMovie";

const { Option } = Select;

const BookingPayment = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const res = await callGetPromotionByCode(
      values.promotionLineCode,
      values.totalValueBill,
      values.dateTime,
      values.applicableObject
    );

    console.log("res", res);
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Mã khuyến mãi"
        name="promotionLineCode"
        rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
      >
        <Input placeholder="Nhập mã khuyến mãi" />
      </Form.Item>
      <Form.Item
        label="Tổng giá trị hóa đơn"
        name="totalValueBill"
        rules={[
          { required: true, message: "Vui lòng nhập tổng giá trị hóa đơn!" },
        ]}
      >
        <Input placeholder="Nhập tổng giá trị hóa đơn" />
      </Form.Item>
      <Form.Item
        label="Ngày và giờ"
        name="dateTime"
        rules={[{ required: true, message: "Vui lòng chọn ngày và giờ!" }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item
        label="Đối tượng áp dụng"
        name="applicableObject"
        rules={[
          { required: true, message: "Vui lòng chọn đối tượng áp dụng!" },
        ]}
      >
        <Select placeholder="Chọn đối tượng áp dụng">
          <Option value="ALL">Tất cả</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Gửi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingPayment;
