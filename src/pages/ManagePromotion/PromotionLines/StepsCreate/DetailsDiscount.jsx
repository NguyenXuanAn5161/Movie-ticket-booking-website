import { Col, Form, InputNumber, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";

const PromotionDetailsDiscount = ({ form, promotionDetails }) => {
  const [typePromotion, setTypePromotion] = useState("PERCENT");
  const [discountValue, setDiscountValue] = useState(1000);

  useEffect(() => {
    if (typePromotion === "AMOUNT") {
      form.setFieldsValue({
        maxValue: discountValue,
      });
    }
  }, [discountValue, form]);

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
            name="typeDiscount"
            rules={[{ required: true, message: "Không được để trống!" }]}
            initialValue={"PERCENT"}
          >
            <Radio.Group disabled={false} onChange={handleTypeChange}>
              <Radio value="PERCENT">% Chiết khấu</Radio>
              <Radio value="AMOUNT">Giảm trực tiếp</Radio>
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
              max={typePromotion === "PERCENT" ? 100 : 9999999}
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
