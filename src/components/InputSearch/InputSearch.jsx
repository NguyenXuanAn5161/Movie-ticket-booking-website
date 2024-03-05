import { Button, Col, Form, Input, Row, theme } from "antd";
import React from "react";

const InputSearch = (props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    let query = "";
    Object.keys(values).forEach((field) => {
      if (values[field]) {
        query += `&${field}=/${values[field]}/i`;
      }
    });
    if (query) {
      props.handleSearch(query);
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        {props.itemSearch.map((item, index) => (
          <Col span={8} key={index}>
            <Form.Item
              labelCol={{ span: 24 }}
              name={item.field}
              label={item.label} // Sử dụng nhãn từ đối tượng trong mảng
            >
              <Input
                type="text"
                placeholder={item.label} // Sử dụng nhãn từ đối tượng trong mảng
              />
            </Form.Item>
          </Col>
        ))}
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Tìm
          </Button>
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              props.resetFields();
            }}
          >
            Xóa trắng
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default InputSearch;
