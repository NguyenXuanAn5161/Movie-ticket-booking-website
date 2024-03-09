import { Col, Form, Input, Row, Select } from "antd";
import React from "react";

const { Option } = Select;

const PromotionBasicInfo = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Mã chương trình khuyến mãi"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã CTKM!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tên Chương trình khuyến mãi"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên CTKM!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Item
            label="Loại khuyến mãi"
            name="type"
            rules={[
              { required: true, message: "Vui lòng chọn loại khuyến mãi!" },
            ]}
          >
            <Select style={{ width: "100%" }}>
              <Option value="PERCENT">Phần trăm</Option>
              <Option value="AMOUNT">Số tiền</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionBasicInfo;
