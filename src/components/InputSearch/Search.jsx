import { Col, Form, theme } from "antd";
import React, { useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FORMAT_DATE_TIME_SEND_SERVER } from "../../utils/constant";
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
    marginRight: 10,
  };

  const calculateSpan = () => {
    const itemSearchCount = props.itemSearch.length;
    return itemSearchCount > 0 ? Math.floor(22 / itemSearchCount) : 2; // Default span is 2 if no search items
  };

  const onFinish = (values) => {
    // Loại bỏ các cặp khóa/giá trị có giá trị là undefined
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== undefined)
    );

    if (Object.keys(filteredValues).length !== 0) {
      props.handleSearch(filteredValues);
    }

    // nếu value là dateRange thì gán giá trị từ khóa là startDate và endDate
    if (filteredValues.dateRange) {
      const [startDate, endDate] = filteredValues.dateRange;
      props.handleSearch({
        startDate: startDate.format(FORMAT_DATE_TIME_SEND_SERVER),
        endDate: endDate.format(FORMAT_DATE_TIME_SEND_SERVER),
      });
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <div style={{ display: "flex", flexDirection: "row", gap: "0 10px" }}>
        {props.itemSearch.map((item, index) => (
          <Col span={calculateSpan()} key={index}>
            <TypeInput item={item} />
          </Col>
        ))}
        <Col span={2}>
          <TooltipButton
            htmlType="submit"
            icon={<IoSearchOutline />}
            tooltipTitle="Tìm kiếm"
          />
        </Col>
      </div>
    </Form>
  );
};

export default Search;
