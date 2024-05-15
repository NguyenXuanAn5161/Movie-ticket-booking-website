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
    return {
      showDate: date.format("YYYY-MM-DD"),
      showTime: time.format("HH:mm"),
      movieId: data.movieId.value,
      roomId: data.roomId,
      status: data.status,
    };
  });

  console.log(convertedData);
  try {
    const response = await api.post(`/api/showtime`, convertedData);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callUpdateShowtime = async (data) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", data.id);
  bodyFormData.append("showDate", data.showDate.format("YYYY-MM-DD"));
  bodyFormData.append("showTime", data.showTime.format("HH:mm"));
  if (data?.movieName?.value) {
    bodyFormData.append("movieId", data.movieName.value);
  }

  if (data?.roomName?.value) {
    bodyFormData.append("roomId", data.roomName.value);
  }

  bodyFormData.append("status", data.status);

  try {
    const response = await api({
      method: "put",
      url: "/api/showtime",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callDeleteShowtime = async (id) => {
  try {
    const response = await api.delete(`/api/showtime/${id}`);
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
