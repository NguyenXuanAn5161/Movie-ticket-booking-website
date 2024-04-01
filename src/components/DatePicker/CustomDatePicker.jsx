import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React from "react";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const CustomDatePicker = (props) => <RangePicker {...props} />;
export default CustomDatePicker;
