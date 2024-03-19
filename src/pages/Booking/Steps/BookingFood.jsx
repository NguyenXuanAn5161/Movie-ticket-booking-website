import { Form, Select } from "antd";
import React from "react";

const { Option } = Select;

const BookingFood = (props) => {
  const { form } = props;

  return (
    <Form.Item
      label="Chọn thức ăn"
      name="food"
      rules={[{ required: true, message: "Vui lòng chọn thức ăn!" }]}
    >
      <Select style={{ textAlign: "start" }} placeholder="Chọn thức ăn">
        <Option value="food1">Thức ăn 1</Option>
        <Option value="food2">Thức ăn 2</Option>
        <Option value="food3">Thức ăn 3</Option>
        {/* Thêm các Option khác nếu cần */}
      </Select>
    </Form.Item>
  );
};

export default BookingFood;
