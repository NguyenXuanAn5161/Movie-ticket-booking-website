import { Button, Col, Form, Input, Row, theme } from "antd";
import React, { useEffect } from "react";

const InputSearch = (props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.filter === "") {
      form.resetFields();
    }
  }, [props.filter]);

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 10,
  };

  const onFinish = (values) => {
    // Loại bỏ các cặp khóa/giá trị có giá trị là undefined
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== undefined)
    );

    if (Object.keys(filteredValues).length !== 0) {
      props.handleSearch(filteredValues);
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
            type="primary"
            style={{ margin: "0 8px" }}
            onClick={() => {
              form.resetFields();
              props.setFilter("");
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
