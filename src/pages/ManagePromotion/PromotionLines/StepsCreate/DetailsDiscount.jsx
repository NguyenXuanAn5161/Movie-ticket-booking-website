import { Col, Form, InputNumber, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";

const PromotionDetailsDiscount = ({ form, promotionDetails, formType }) => {
  const isDisabled = formType ? true : false;
  const radioStyle = {
    pointerEvents: isDisabled ? "none" : "auto", // Tắt hoặc bật sự kiện click
    opacity: isDisabled ? 0.5 : 1, // Làm mờ hoặc không làm mờ nút radio
  };

  const [typePromotion, setTypePromotion] = useState("percent");

  useEffect(() => {
    // Kiểm tra xem promotionDetails có dữ liệu không
    if (promotionDetails && Object.keys(promotionDetails).length > 0) {
      // Set các giá trị vào các trường của form
      form.setFieldsValue({
        // typePromotion: promotionDetails.typePromotion || "percent",
        discount_value: promotionDetails.discount_value || 0,
        min_spend: promotionDetails.min_spend || 0,
        max_spend: promotionDetails.max_spend || 0,
      });
      // setTypePromotion(promotionDetails.typePromotion || "percent");
    }
  }, [promotionDetails, form]);

  const handleTypeChange = (e) => {
    setTypePromotion(e.target.value);
  };

  return (
    <Form form={form} layout="vertical" disabled={isDisabled}>
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
            name="type_promotion"
            rules={[{ required: true, message: "Không được để trống!" }]}
            initialValue={"percent"}
          >
            <Radio.Group disabled={false} onChange={handleTypeChange}>
              <Radio.Button style={radioStyle} value="percent">
                % Chiết khấu
              </Radio.Button>
              <Radio.Button style={radioStyle} value="amount">
                Giảm trực tiếp
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col style={{ display: "flex", flexDirection: "flex-start" }} span={12}>
          <Form.Item
            label="Giá trị giảm"
            name="discount_value"
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
            name="min_spend"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} addonAfter={"VND"} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chi tiêu tối đa"
            name="max_spend"
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
