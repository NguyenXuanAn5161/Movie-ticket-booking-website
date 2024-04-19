import { Col, Form, Input, Radio, Row } from "antd";
import React, { useEffect } from "react";

const PromotionBasicInfo = ({ form, dataUpdate, promotionId, type }) => {
  useEffect(() => {
    if (promotionId) {
      form.setFieldsValue({ promotionId });
    }
  }, [promotionId]);

  useEffect(() => {
    form.setFieldsValue(dataUpdate);
  }, [dataUpdate]);

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        {type === "create" ? (
          <Form.Item
            hidden
            label="Id"
            name="promotionId"
            rules={[{ required: true, message: "Vui lòng nhập id!" }]}
          >
            <Input />
          </Form.Item>
        ) : (
          <Form.Item
            hidden
            label="Id"
            name="id"
            rules={[{ required: true, message: "Vui lòng nhập id!" }]}
          >
            <Input />
          </Form.Item>
        )}
        <Col span={12}>
          <Form.Item
            label="Tên Chương trình khuyến mãi"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên CTKM!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Loại khuyến mãi"
            name="typePromotion"
            rules={[
              { required: true, message: "Vui lòng chọn loại khuyến mãi!" },
            ]}
            style={{ width: "100%", textAlign: "left" }}
            initialValue={"DISCOUNT"}
          >
            <Radio.Group disabled={type === "update" ? true : false}>
              <Radio value="DISCOUNT">Giảm giá</Radio>
              <Radio value="FOOD">Tặng đồ ăn</Radio>
              <Radio value="TICKET">Tặng vé</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
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
    </Form>
  );
};

export default PromotionBasicInfo;
