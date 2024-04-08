import { Col, Form, Row, theme } from "antd";
import React, { useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import TooltipButton from "../Button/TooltipButton";
import TypeInput from "../TypeInput/TypeInput";

const Search = (props) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.filter === "") {
      form.resetFields();
    }
  }, [props.filter]);

  const formStyle = {
    maxWidth: "none",
    borderRadius: token.borderRadiusLG,
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
      <Row gutter={16}>
        {props.itemSearch.map((item, index) => (
          <Col span={7} key={index}>
            <TypeInput item={item} />
          </Col>
        ))}
        <Col span={3}>
          <TooltipButton
            htmlType="submit"
            icon={<IoSearchOutline />}
            tooltipTitle="Tìm kiếm"
          />
        </Col>
      </Row>
    </Form>
  );
};

export default Search;
