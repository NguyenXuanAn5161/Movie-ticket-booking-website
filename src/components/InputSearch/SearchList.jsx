import { Button, Card, Col, Form, Row, theme } from "antd";
import React, { useEffect } from "react";
import { FORMAT_DATE_TIME_SEND_SERVER } from "../../utils/constant";
import TypeInput from "../TypeInput/TypeInput";

const SearchList = (props) => {
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

  const calculateSpan = () => {
    const itemSearchCount = props.itemSearch.length;
    return itemSearchCount > 0 && Math.floor(24 / itemSearchCount);
  };

  const onFinish = (values) => {
    // Loại bỏ các cặp khóa/giá trị có giá trị là undefined
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== undefined)
    );

    // nếu value là dateRange thì gán giá trị từ khóa là startDate và endDate
    if (filteredValues.dateRange) {
      const [startDate, endDate] = filteredValues.dateRange;
      props.handleSearch({
        startDate: startDate.format(FORMAT_DATE_TIME_SEND_SERVER),
        endDate: endDate.format(FORMAT_DATE_TIME_SEND_SERVER),
      });
    }

    if (Object.keys(filteredValues).length !== 0) {
      props.handleSearch(filteredValues);
    }
  };

  return (
    <Card>
      <Form
        form={form}
        name="advanced_search"
        style={formStyle}
        onFinish={onFinish}
      >
        <Row gutter={[0, 10]}>
          <Row style={{ width: "100%" }} gutter={[10]}>
            {props.itemSearch.map((item) => (
              <Col span={calculateSpan()} key={item.field}>
                <TypeInput item={item} />
              </Col>
            ))}
          </Row>
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
    </Card>
  );
};

export default SearchList;