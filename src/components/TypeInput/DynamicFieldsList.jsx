// DynamicFieldsList.js
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Row, Space, TimePicker } from "antd";
import dayjs from "dayjs";
import React from "react";

const defaultStartDate = dayjs().startOf("day").add(1, "day");

const DynamicFieldsList = ({ name, add, remove, rules }) => (
  <Form.List name={name}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <Space
            key={key}
            style={{
              marginBottom: 8,
            }}
            align="baseline"
          >
            <Row
              style={{ display: "flex", alignItems: "center", gap: "0 10px" }}
            >
              <Form.Item
                {...restField}
                name={[name, "date"]}
                rules={[
                  {
                    required: true,
                    message: "không được để trống",
                    ...rules,
                  },
                ]}
                style={{ minWidth: 380, marginRight: 10 }}
              >
                <DatePicker
                  style={{ minWidth: "100%" }}
                  minDate={defaultStartDate}
                  format="DD-MM-YYYY"
                  placeholder="Chọn ngày chiếu"
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "time"]}
                rules={[
                  {
                    required: true,
                    message: "không được để trống",
                    ...rules,
                  },
                ]}
                style={{ minWidth: 320 }}
              >
                <TimePicker
                  multiple={true}
                  format="HH:mm"
                  placeholder="Chọn giờ chiếu"
                  defaultOpenValue={dayjs("00:00", "HH:mm")}
                />
              </Form.Item>
              <MinusCircleOutlined
                style={{
                  marginLeft: 10,
                  width: 20,
                  fontSize: 20,
                  color: "red",
                }}
                onClick={() => remove(name)}
              />
            </Row>
          </Space>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            Thêm ngày chiếu
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

export default DynamicFieldsList;
