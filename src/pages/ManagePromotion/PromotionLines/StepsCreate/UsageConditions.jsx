import { Col, DatePicker, Form, Row } from "antd";
import dayjs from "dayjs";
import React from "react";

const dateFormat = "DD-MM-YYYY HH:mm:ss";
const defaultStartDate = dayjs().startOf("day").add(1, "day");
const defaultEndDate = dayjs().endOf("day").add(1, "day");

const PromotionUsageConditions = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            labelCol={{ span: 24 }}
            name="timeValue"
            label="Thời gian áp dụng"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thời gian áp dụng!",
              },
            ]}
            initialValue={[defaultStartDate, defaultEndDate]}
          >
            <DatePicker.RangePicker
              style={{ width: "100%" }}
              showTime
              format={dateFormat}
              minDate={defaultStartDate}
              // defaultValue={[defaultStartDate, defaultEndDate]}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionUsageConditions;
