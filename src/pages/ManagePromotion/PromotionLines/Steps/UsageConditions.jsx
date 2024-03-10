import { Col, Form, Input, InputNumber, Row, TreeSelect } from "antd";
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

const PromotionUsageConditions = ({ form }) => {
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
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ngày bắt đầu"
            name="startDate"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày kết thúc"
            name="endDate"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <Input type="date" />
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
              placeholder="Vui lòng chọn ít nhất 1 đối tượng sử dụng"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lần khách hàng có thể dùng"
            name="usesPerCustomer"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tổng số lượng khuyến mãi có thể dùng"
            name="usesPerPromotion"
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
