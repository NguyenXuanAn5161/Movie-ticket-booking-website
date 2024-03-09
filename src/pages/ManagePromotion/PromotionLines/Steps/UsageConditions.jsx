import { Col, Form, Input, InputNumber, Row } from "antd";
import React from "react";

const PromotionUsageConditions = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ngày bắt đầu"
            name="startDate"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày kết thúc"
            name="endDate"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Đối tượng sử dụng"
            name="applicableObject"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lần khách hàng có thể dùng"
            name="usesPerCustomer"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tổng số lượng khuyến mãi có thể dùng"
            name="usesPerPromotion"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionUsageConditions;
