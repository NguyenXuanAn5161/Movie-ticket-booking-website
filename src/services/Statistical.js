import api from "../utils/axios-custom";

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
