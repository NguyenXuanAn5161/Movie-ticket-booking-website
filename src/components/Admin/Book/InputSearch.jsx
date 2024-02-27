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

  // optimize code field to search by use foreach field search

  const onFinish = (values) => {
    let query = "";
    if (values.mainText) {
      query += `&mainText=/${values.mainText}/i`;
    }

    if (values.author) {
      query += `&author=/${values.author}/i`;
    }

    if (values.category) {
      query += `&category=/${values.category}/i`;
    }

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
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`mainText`}
            label={`Tên sách`}
          >
            <Input type="text" placeholder="Tên sách" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`author`}
            label={`Tác giả`}
          >
            <Input type="text" placeholder="Tác giả" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            name={`category`}
            label={`Thể loại`}
          >
            <Input type="text" placeholder="Thể loại" />
          </Form.Item>
        </Col>
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
              props.setFilter("");
            }}
          >
            Xóa trắng
          </Button>
          {/* <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                    </a> */}
        </Col>
      </Row>
    </Form>
  );
};

export default InputSearch;
