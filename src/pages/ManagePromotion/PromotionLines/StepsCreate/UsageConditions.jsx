import { Col, Form, Input, InputNumber, Radio, Row, TreeSelect } from "antd";
import React, { useEffect, useState } from "react";

const { SHOW_PARENT } = TreeSelect;

const treeData = [
  {
    title: "Toàn bộ",
    value: "all",
    key: "all",
    children: [
      {
        title: "Thành viên",
        value: "member",
        key: "member",
        children: [
          {
            title: "Cấp bậc bạc",
            value: "level_silver",
            key: "level_silver",
          },
          {
            title: "Cấp bậc vàng",
            value: "level_gold",
            key: "level_gold",
          },
          {
            title: "Cấp bậc bạch kim",
            value: "level_platinum",
            key: "level_platinum",
          },
        ],
      },
      {
        title: "Không phải là thành viên",
        value: "notMember",
        key: "notMember",
      },
    ],
  },
];

const PromotionUsageConditions = ({ form, formType }) => {
  const isDisabled = formType ? true : false;
  const radioStyle = {
    pointerEvents: isDisabled ? "none" : "auto", // Tắt hoặc bật sự kiện click
    opacity: isDisabled ? 0.5 : 1, // Làm mờ hoặc không làm mờ nút radio
  };
  const [data, setData] = useState(treeData);
  const [value, setValue] = useState(["all"]); // Set default value to "Toàn bộ"

  useEffect(() => {
    setData(treeData);
  }, []);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log("applicableObject: ", value);
    form.setFieldsValue({
      applicableObject: value,
    });
  }, [value]);

  return (
    <Form form={form} layout="vertical" disabled={isDisabled}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col style={{ display: "flex", flexDirection: "flex-start" }} span={24}>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            initialValue={"available"}
          >
            <Radio.Group disabled={false}>
              <Radio.Button value="available" style={radioStyle}>
                Hoạt động
              </Radio.Button>
              <Radio.Button value="unavailable" style={radioStyle}>
                Không hoạt động
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Đối tượng sử dụng"
            name="applicable_object"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <TreeSelect
              treeData={data}
              value={value}
              onChange={onChange}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              placeholder="Vui lòng chọn ít nhất 1 đối tượng sử dụng"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lần khách hàng có thể dùng"
            name="uses_per_customer"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tổng số lượng khuyến mãi có thể dùng"
            name="uses_per_promotion"
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
