import dayjs from "dayjs";
import moment from "moment";
import { FORMAT_DATE_TIME_Y_M_DT_H_M_S } from "./constant";

// năm hiện tại
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// tháng hiện tại
export const getCurrentMonth = () => {
  return new Date().getMonth() + 1;
};

// get ngày đầu và ngày cuối của năm hiện tại
export const getFirstAndLastDayOfYear = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const lastDay = new Date(date.getFullYear(), 11, 31);
  const startDate = moment(firstDay).format("YYYY-MM-DD");
  const endDate = moment(lastDay).format("YYYY-MM-DD");
  return [startDate, endDate];
};

// get ngày đầu và ngày cuối của tháng trước
export const getFirstAndLastDayOfLastMonth = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
  const startDateLastMonth = moment(firstDay).format("YYYY-MM-DD");
  const endDateLastMonth = moment(lastDay).format("YYYY-MM-DD");
  return [startDateLastMonth, endDateLastMonth];
};

// get ngày đầu và ngày cuối của tháng hiện tại
export const getFirstAndLastDayOfMonth = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDate = moment(firstDay).format("YYYY-MM-DD");
  const endDate = moment(lastDay).format("YYYY-MM-DD");
  return [startDate, endDate];
};

// get ngày đầu và ngày cuối của tuần hiện tại
export const getFirstAndLastDayOfWeek = () => {
  const date = new Date();
  const firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
  const lastDay = new Date(date.setDate(date.getDate() - date.getDay() + 6));
  const startDate = moment(firstDay).format("YYYY-MM-DD");
  const endDate = moment(lastDay).format("YYYY-MM-DD");
  return [startDate, endDate];
};

export const formatDateYYYY_MM_DDT_HH_MM_SS = (date) => {
  return dayjs(date).format(FORMAT_DATE_TIME_Y_M_DT_H_M_S);
};

export const defaultStartDate = dayjs().startOf("day").add(1, "day"); // từ ngày hiện tại
export const defaultEndDate = dayjs().endOf("day").add(1, "day"); // sau ngày hiện tại
