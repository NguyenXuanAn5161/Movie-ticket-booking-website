import api from "../utils/axios-custom";
import {
  calculateGrowthRate,
  calculateTicketGrowthRate,
} from "../utils/calculator";
import {
  getFirstAndLastDayOfLastMonth,
  getFirstAndLastDayOfMonth,
  getFirstAndLastDayOfYear,
} from "../utils/date";

export const callGetRevenueByPromotion = async (query) => {
  try {
    const response = await api.get(
      `/api/statistical/revenue-by-promotion-line?${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callGetRevenueByCinema = async (query) => {
  try {
    const response = await api.get(
      `/api/statistical/revenue-by-cinema?${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callGetRevenueByMovie = async (query) => {
  try {
    const response = await api.get(
      `/api/statistical/revenue-by-movie?${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callGetRevenueByUser = async (query) => {
  try {
    const response = await api.get(`/api/statistical/revenue-by-user?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callGetRevenueByStaff = async (query) => {
  try {
    const response = await api.get(
      `/api/statistical/revenue-by-staff?${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callGetRevenueByInvoiceCancel = async (query) => {
  try {
    const response = await api.get(`/api/statistical/return-invoice?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// thống kê doanh thu của hệ thống theo năm
export const callGetRevenueByYear = async () => {
  const [startDate, endDate] = getFirstAndLastDayOfYear();
  try {
    const response = await api.get(
      `/api/statistical/revenue-by-cinema?cinemaCode=&size=1000&startDate=${startDate}&endDate=${endDate}&sortDirection=DESC&sortType=name`
    );
    const totalPrice = response.data.content.reduce(
      (total, item) => total + item.totalRevenue,
      0
    );
    console.log("totalPrice api: ", totalPrice);
    return totalPrice;
  } catch (error) {
    return error;
  }
};

// thống kê doanh thu của hệ thống theo tháng
export const callGetRevenueByMonth = async (query) => {
  try {
    const response = await api.get(
      `/api/statistical/revenue-by-month?${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// thống kê doanh thu của hệ thống theo ngày
export const callGetRevenueByDay = async (query) => {
  try {
    const response = await api.get(`/api/statistical/revenue-by-day?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// thống kê top 5 rạp có doanh thu cao nhất theo tháng
export const callGetTopRevenueCinema = async (query) => {
  try {
    const response = await api.get(
      `/api/statistical/top-revenue-cinema?${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// thống kê top 5 phim có doanh thu cao nhất theo tháng
export const callGetTopRevenueMovie = async (query) => {
  try {
    const response = await api.get(
      `/api/statistical/top-revenue-movie?${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// thống kê tăng trưởng doanh thu theo tháng
export const callGetRevenueGrowthByMonth = async () => {
  const [startDateLastMonth, endDateLastMonth] =
    getFirstAndLastDayOfLastMonth();

  const [startDate, endDate] = getFirstAndLastDayOfMonth();

  try {
    const responseLastMonth = await api.get(
      `/api/statistical/revenue-by-cinema?cinemaCode=&size=1000&startDate=${startDateLastMonth}&endDate=${endDateLastMonth}&sortDirection=DESC&sortType=name`
    );

    const responseCurrentMonth = await api.get(
      `/api/statistical/revenue-by-cinema?cinemaCode=&size=1000&startDate=${startDate}&endDate=${endDate}&sortDirection=DESC&sortType=name`
    );

    const growth = calculateGrowthRate(
      responseCurrentMonth.data.content,
      responseLastMonth.data.content
    );

    return growth;
  } catch (error) {
    return error;
  }
};

// thống kê sự tăng trưởng lượng vé đặt theo tháng
export const callGetTicketGrowthByMonth = async () => {
  const [startDateLastMonth, endDateLastMonth] =
    getFirstAndLastDayOfLastMonth();

  const [startDate, endDate] = getFirstAndLastDayOfMonth();

  try {
    const responseLastMonth = await api.get(
      `/api/statistical/revenue-by-cinema?cinemaCode=&size=1000&startDate=${startDateLastMonth}&endDate=${endDateLastMonth}&sortDirection=DESC&sortType=name`
    );

    const responseCurrentMonth = await api.get(
      `/api/statistical/revenue-by-cinema?cinemaCode=&size=1000&startDate=${startDate}&endDate=${endDate}&sortDirection=DESC&sortType=name`
    );

    const growth = calculateTicketGrowthRate(
      responseCurrentMonth.data.content,
      responseLastMonth.data.content
    );

    console.log("growth: ", growth);

    return growth;
  } catch (error) {
    return error;
  }
};

// Top 5 rạp có doanh thu cao nhất theo tháng
export const callGetTopRevenueCinemaByMonth = async () => {
  const [startDate, endDate] = getFirstAndLastDayOfMonth();

  try {
    const response = await api.get(
      `/api/statistical/revenue-by-cinema?cinemaCode=&size=5&startDate=${startDate}&endDate=${endDate}&sortDirection=DESC&sortType=total`
    );

    return response.data.content;
  } catch (error) {
    return error;
  }
};

// Top 5 phim có doanh thu cao nhất theo tháng
export const callGetTopRevenueMovieByMonth = async () => {
  const [startDate, endDate] = getFirstAndLastDayOfMonth();

  try {
    const response = await api.get(
      `/api/statistical/revenue-by-movie?movieCode=&size=5&startDate=${startDate}&endDate=${endDate}&sortDirection=DESC&sortType=total`
    );

    return response.data.content;
  } catch (error) {
    return error;
  }
};

// Top 5 khách hàng có mức chi tiêu cao nhất theo tháng
export const callGetTopRevenueUserByMonth = async () => {
  const [startDate, endDate] = getFirstAndLastDayOfMonth();

  const queryParams = {
    startDate,
    endDate,
    sortDirection: "DESC",
    sortType: "total",
    size: 5,
    userCode: "",
    email: "",
    phone: "",
  };

  try {
    const response = await api.get(`/api/statistical/revenue-by-user`, {
      params: queryParams,
    });

    return response.data.content;
  } catch (error) {
    return error;
  }
};

// Top 5 nhân viên có doanh thu cao nhất theo tháng
export const callGetTopRevenueStaffByMonth = async () => {
  try {
    const [startDate, endDate] = getFirstAndLastDayOfMonth();

    const queryParams = {
      startDate,
      endDate,
      sortDirection: "DESC",
      sortType: "total",
      size: 5,
      userCode: "",
      email: "",
      phone: "",
    };

    const response = await api.get(`/api/statistical/revenue-by-staff`, {
      params: queryParams,
    });

    return response.data.content;
  } catch (error) {
    return error;
  }
};
