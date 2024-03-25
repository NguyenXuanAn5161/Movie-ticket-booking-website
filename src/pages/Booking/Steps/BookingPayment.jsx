import { Form, Select } from "antd";
import React from "react";

const BookingPayment = ({ form }) => {
  const { Option } = Select;

  return (
    <Form.Item
      label="Hình thức thanh toán"
      name="paymentMethod"
      rules={[
        { required: true, message: "Vui lòng chọn hình thức thanh toán!" },
      ]}
    >
      <Select
        style={{ textAlign: "start" }}
        placeholder="Chọn hình thức thanh toán"
      >
        <Option value="cash">Thanh toán bằng tiền mặt</Option>
        <Option value="creditCard">Thanh toán bằng thẻ tín dụng</Option>
        <Option value="bankTransfer">Chuyển khoản ngân hàng</Option>
      </Select>
    </Form.Item>
  );
};

export default BookingPayment;
