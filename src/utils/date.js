import dayjs from "dayjs";
import moment from "moment";
import { FORMAT_DATE_TIME_Y_M_DT_H_M_S } from "./constant";

// get ngày đầu và ngày cuối của tháng hiện tại
export const getFirstAndLastDayOfMonth = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDate = moment(firstDay).format("YYYY-MM-DD");
  const endDate = moment(lastDay).format("YYYY-MM-DD");
  return [startDate, endDate];
};

export const formatDateYYYY_MM_DDT_HH_MM_SS = (date) => {
  return dayjs(date).format(FORMAT_DATE_TIME_Y_M_DT_H_M_S);
};

export const defaultStartDate = dayjs().startOf("day").add(1, "day"); // từ ngày hiện tại
export const defaultEndDate = dayjs().endOf("day").add(1, "day"); // sau ngày hiện tại
