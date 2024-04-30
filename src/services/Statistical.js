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
