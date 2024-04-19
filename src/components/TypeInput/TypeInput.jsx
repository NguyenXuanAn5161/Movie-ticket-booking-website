import { DatePicker, Form, Input, Select } from "antd";
import { FORMAT_DATE } from "../../utils/constant";

const { Option } = Select;
const { RangePicker } = DatePicker;

const TypeInput = ({ item }) => {
  const renderInput = () => {
    switch (item.type) {
      case "select":
        return (
          <Select placeholder={item.label} showSearch allowClear>
            {Array.isArray(item.options) &&
              item.options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
          </Select>
        );
      case "datePicker":
        return (
          <DatePicker style={{ width: "100%" }} placeholder={item.label} />
        );
      case "rangePicker":
        return (
          <RangePicker
            style={{ width: "100%" }}
            placeholder={["Từ ngày", "Đến ngày"]}
            format={FORMAT_DATE}
          />
        );
      default:
        return <Input type="text" placeholder={item.label} />;
    }
  };

  return (
    <Form.Item name={item.field} style={{ height: "auto", marginBottom: 0 }}>
      {renderInput()}
    </Form.Item>
  );
};

export default TypeInput;
