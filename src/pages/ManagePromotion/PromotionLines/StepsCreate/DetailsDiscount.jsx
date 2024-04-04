import { Col, Form, InputNumber, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";

const PromotionDetailsDiscount = ({ form, promotionDetails, formType }) => {
  const isDisabled = formType ? true : false;
  const radioStyle = {
    pointerEvents: isDisabled ? "none" : "auto", // Tắt hoặc bật sự kiện click
    opacity: isDisabled ? 0.5 : 1, // Làm mờ hoặc không làm mờ nút radio
  };

  const [typePromotion, setTypePromotion] = useState("PERCENT");
  const [discountValue, setDiscountValue] = useState(1000);

  useEffect(() => {
    if (typePromotion === "AMOUNT") {
      form.setFieldsValue({
        maxValue: discountValue,
      });
    }
  }, [discountValue, form]);

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
            name="typeDiscount"
            rules={[{ required: true, message: "Không được để trống!" }]}
            initialValue={"PERCENT"}
          >
            <Radio.Group disabled={false} onChange={handleTypeChange}>
              <Radio style={radioStyle} value="PERCENT">
                % Chiết khấu
              </Radio>
              <Radio style={radioStyle} value="AMOUNT">
                Giảm trực tiếp
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col
          style={{
            display: "flex",
            flexDirection: "flex-start",
          }}
          span={12}
        >
          <Form.Item
            label="Giá trị giảm"
            name="discountValue"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber
              onChange={(value) => setDiscountValue(value)}
              style={{ width: "100%" }}
              min={typePromotion === "PERCENT" ? 1 : 1000}
              formatter={(value) =>
                typePromotion === "AMOUNT"
                  ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : value
              }
              max={typePromotion === "PERCENT" ? 100 : 99900}
              addonAfter={typePromotion === "PERCENT" ? "%" : "VND"}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chi tiêu tối thiếu"
            name="minBillValue"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{ width: "100%" }}
              min={0}
              addonAfter={"VND"}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số tiền giảm tối đa"
            name="maxValue"
            rules={[{ required: true, message: "Không để trống!" }]}
            initialValue={typePromotion === "AMOUNT" ? discountValue : ""}
          >
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              disabled={typePromotion === "AMOUNT" ? true : false}
              style={{ width: "100%" }}
              addonAfter={"VND"}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionDetailsDiscount;
