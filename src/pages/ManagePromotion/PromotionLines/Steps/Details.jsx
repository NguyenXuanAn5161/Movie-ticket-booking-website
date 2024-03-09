import { Col, Form, Input, InputNumber, Row } from "antd";
import React from "react";

const PromotionDetails = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Giá trị giảm"
            name="discountValue"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Chi tiêu tối thiếu"
            name="minSpend"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Chi tiêu tối đa"
            name="maxSpend"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionDetails;
