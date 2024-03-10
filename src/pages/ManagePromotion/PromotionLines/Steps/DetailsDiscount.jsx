import { Col, Form, InputNumber, Radio, Row } from "antd";
import React, { useState } from "react";

const PromotionDetailsDiscount = ({ form }) => {
  const [typePromotion, setTypePromotion] = useState("percent");

  const handleTypeChange = (e) => {
    setTypePromotion(e.target.value);
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Form.Item
            label="Loại giảm giá"
            name="typePromotion"
            rules={[{ required: true, message: "Không được để trống!" }]}
            initialValue={"percent"}
          >
            <Radio.Group onChange={handleTypeChange}>
              <Radio.Button value="percent">% Chiết khấu</Radio.Button>
              <Radio.Button value="amount">Giảm trực tiếp</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col style={{ display: "flex", flexDirection: "flex-start" }} span={12}>
          <Form.Item
            label="Giá trị giảm"
            name="discountValue"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber
              min={0}
              addonAfter={typePromotion === "percent" ? "%" : "VND"}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chi tiêu tối thiếu"
            name="minSpend"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} addonAfter={"VND"} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chi tiêu tối đa"
            name="maxSpend"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} addonAfter={"VND"} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionDetailsDiscount;
