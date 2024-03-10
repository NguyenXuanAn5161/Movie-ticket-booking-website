import { Col, Form, Input, Radio, Row } from "antd";
import React from "react";

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
            initialValue={"discount"}
          >
            <Radio.Group>
              <Radio.Button value="discount">Giảm giá</Radio.Button>
              <Radio.Button value="gift">Quà tặng</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionBasicInfo;
