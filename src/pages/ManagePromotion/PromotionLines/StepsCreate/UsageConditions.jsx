import { Col, DatePicker, Form, InputNumber, Row, TreeSelect } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    title: "Toàn bộ",
    value: "ALL",
    key: "ALL",
    children: [
      {
        title: "Thành viên",
        value: "MEMBERSHIP",
        key: "MEMBERSHIP",
        children: [
          {
            title: "Cấp bậc bạc",
            value: "LEVEL_SILVER",
            key: "LEVEL_SILVER",
          },
          {
            title: "Cấp bậc vàng",
            value: "LEVEL_GOLD",
            key: "LEVEL_GOLD",
          },
          {
            title: "Cấp bậc bạch kim",
            value: "LEVEL_PLATINUM",
            key: "LEVEL_PLATINUM",
          },
        ],
      },
    ],
  },
];

const dateFormat = "DD-MM-YYYY HH:mm:ss";
const defaultStartDate = dayjs().startOf("day").add(1, "day");
const defaultEndDate = dayjs().endOf("day").add(1, "day");

const PromotionUsageConditions = ({ form, formType }) => {
  const isDisabled = formType ? true : false;
  const radioStyle = {
    pointerEvents: isDisabled ? "none" : "auto", // Tắt hoặc bật sự kiện click
    opacity: isDisabled ? 0.5 : 1, // Làm mờ hoặc không làm mờ nút radio
  };
  const [data, setData] = useState(treeData);
  const [value, setValue] = useState(["ALL"]); // Set default value to "Toàn bộ"

  useEffect(() => {
    setData(treeData);
  }, []);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    form.setFieldsValue({
      applicableObject: value,
    });
  }, [value]);

  return (
    <Form form={form} layout="vertical" disabled={isDisabled}>
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
        <Col span={24}>
          <Form.Item
            label="Đối tượng sử dụng"
            name="applicableObject"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <TreeSelect
              treeData={data}
              value={value}
              onChange={onChange}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              placeholder="Vui lòng chọn ít nhất 1 đối tượng áp dụng"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lần khách hàng có thể dùng"
            name="usePerUser"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tổng số lượng khuyến mãi có thể dùng"
            name="usePerPromotion"
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
