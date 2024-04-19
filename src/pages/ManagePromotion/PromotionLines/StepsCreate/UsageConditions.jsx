import { Col, DatePicker, Form, Radio, Row } from "antd";
import dayjs from "dayjs";
import React from "react";
import { FORMAT_DATE_HH_MM_SS } from "../../../../utils/constant";

const defaultStartDate = dayjs().startOf("day").add(1, "day");
const defaultEndDate = dayjs().endOf("day").add(1, "day");

const PromotionUsageConditions = ({ form, dataUpdate, type }) => {
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
            initialValue={
              dataUpdate
                ? [dayjs(dataUpdate?.startDate), dayjs(dataUpdate?.endDate)]
                : [defaultStartDate, defaultEndDate]
            }
          >
            <DatePicker.RangePicker
              disabled={type === "update" ? true : false}
              style={{ width: "100%" }}
              showTime
              format={FORMAT_DATE_HH_MM_SS}
              minDate={defaultStartDate}
              // defaultValue={[defaultStartDate, defaultEndDate]}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            />
          </Form.Item>
        </Col>
        {type === "update" && (
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái!",
                },
              ]}
              style={{ width: "100%", textAlign: "left" }}
            >
              <Radio.Group
                disabled={dayjs(dataUpdate?.startDate).isAfter(dayjs())}
              >
                <Radio value={true}>Hoạt động</Radio>
                <Radio value={false}>Không hoạt động</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default PromotionUsageConditions;
