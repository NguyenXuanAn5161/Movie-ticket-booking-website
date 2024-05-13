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
  const convertedData = data.dateTime.flatMap(({ date, time }) => {
    return time.map((showTime) => {
      return {
        showDate: date.format("YYYY-MM-DD"),
        showTime: showTime.format("HH:mm"),
        movieId: data.movieId.value,
        roomId: data.roomId,
        status: data.status,
      };
    });
  });

  console.log(convertedData);
  try {
    const response = await api.post(`/api/showtime`, convertedData);
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
