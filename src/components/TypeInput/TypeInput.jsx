import { DatePicker, Form, Input, Select } from "antd";
import { FORMAT_DATE } from "../../utils/constant";
import DebounceSelect from "../DebounceSelect/DebounceSelect";

const { RangePicker } = DatePicker;

const TypeInput = ({ item }) => {
  const renderInput = () => {
    switch (item.type) {
      case "select":
        return (
          <Select
            placeholder={item.label}
            showSearch
            allowClear
            options={item.options}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            optionFilterProp="children"
            filterOption={(input, option) =>
              // Tìm kiếm không phân biệt hoa thường
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
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
      case "debounceSelect": // Xử lý kiểu tìm kiếm mới debounceSelect
        return (
          <DebounceSelect
            style={{ width: "100%" }}
            placeholder={item.label}
            fetchOptions={item.fetchOptions}
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
