import moment from "moment";

// get ngày đầu và ngày cuối của tháng hiện tại
export const getFirstAndLastDayOfMonth = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDate = moment(firstDay).format("YYYY-MM-DD");
  const endDate = moment(lastDay).format("YYYY-MM-DD");
  return [startDate, endDate];
};
