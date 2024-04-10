import api from "../utils/axios-custom";

// showtime
export const callGetShowtimeById = async (id) => {
  try {
    const response = await api.get(`/api/showtime/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callFetchListShowtime = async (query) => {
  try {
    const response = await api.get(`/api/showtime?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateShowtime = async (data) => {
  const { showDate, showTime, movieId, roomId, status } = data;
  const showDateStr = showDate.format("YYYY-MM-DD");
  const showTimeStr = showTime.format("HH:mm:ss");
  try {
    const response = await api.post(`/api/showtime`, [
      {
        showDate: showDateStr,
        showTime: showTimeStr,
        movieId: movieId.value,
        roomId,
        status,
      },
    ]);
    return response.data;
  } catch (error) {
    return error;
  }
};

// get seat trong phòng cho user xem
export const callGetSeatForUserByShowtimeId = async (id) => {
  try {
    const response = await api.get(`/api/showtime/seat/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
