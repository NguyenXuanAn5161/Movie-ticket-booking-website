import { DatePicker, Form, Input, Select } from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;

const TypeInput = ({ item }) => {
  const renderInput = () => {
    switch (item.type) {
      case "select":
        return (
          <Select placeholder={item.label}>
            {item.options &&
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
            placeholder={[item.label, item.label]}
          />
        );
      default:
        return <Input type="text" placeholder={item.label} />;
    }
  };

  return <Form.Item name={item.field}>{renderInput()}</Form.Item>;
};

export default TypeInput;
