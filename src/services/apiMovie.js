import api from "../utils/axios-custom";

// ghế
export const callFetchListTypeSeat = async () => {
  try {
    const response = await api.get("/api/typeSeat");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
// moive
export const callGetMovieById = async (id) => {
  try {
    const response = await api.get(`/api/movie/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callFetchListMovie = async (query) => {
  try {
    const response = await api.get(`/api/movie?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateMovie = async (values, releaseDate, image) => {
  const {
    name,
    description,
    trailer,
    durationInMins,
    genreId,
    country,
    director,
    cast,
    producer,
    status,
    cinemaId,
  } = values;
  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("image", image);
  bodyFormData.append("trailer", trailer);
  bodyFormData.append("description", description);
  bodyFormData.append("duration", durationInMins);
  bodyFormData.append("genreId", genreId);
  bodyFormData.append("releaseDate", releaseDate);
  bodyFormData.append("country", country);
  bodyFormData.append("director", director);
  bodyFormData.append("cast", cast);
  bodyFormData.append("producer", producer);
  // cinemaId là 1 mảng
  cinemaId.forEach((item) => {
    bodyFormData.append("cinemaId", item.value);
  });
  // bodyFormData.append("cinemaId", cinemaId.value);
  bodyFormData.append("status", status);
  try {
    const response = await api({
      method: "post",
      url: "/api/movie",
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

export const callUpdateMovie = async (values, image) => {
  const {
    id,
    name,
    description,
    trailerLink,
    durationMinutes,
    genreId,
    releaseDate,
    country,
    director,
    cast,
    producer,
    status,
    cinemaId,
  } = values;
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  bodyFormData.append("description", description);
  bodyFormData.append("image", image);
  bodyFormData.append("trailer", trailerLink);
  bodyFormData.append("duration", durationMinutes);
  bodyFormData.append("genreId", genreId);
  bodyFormData.append("releaseDate", releaseDate);
  bodyFormData.append("country", country);
  bodyFormData.append("director", director);
  bodyFormData.append("cast", cast);
  bodyFormData.append("producer", producer);
  bodyFormData.append("status", status);
  cinemaId.forEach((item) => {
    bodyFormData.append("cinemaId", item.value);
  });
  // bodyFormData.append("cinemaId", cinemaId.value);

  try {
    const response = await api({
      method: "put",
      url: "/api/movie",
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

export const callDeleteMovie = async (id) => {
  try {
    const response = await api.delete(`/api/movie/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// genre movie
export const callGetGenreMovieById = async (id) => {
  try {
    const response = await api.get(`/api/genre/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callFetchListGenreMovie = async (query) => {
  try {
    const response = await api.get(`/api/genre?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateGenreMovie = async (name) => {
  try {
    const response = await api.post(`/api/genre?name=${name}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callUpdateGenreMovie = async (id, name) => {
  try {
    const response = await api.put(`/api/genre?id=${id}&name=${name}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callDeleteGenreMovie = async (id) => {
  try {
    const response = await api.delete(`/api/genre/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// --------------------------------------------------------
// api upload image
export const callUploadImage = (file) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  return api({
    method: "post",
    url: "/api/aws",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "image",
    },
  });
};
// --------------------------------------------------------

// --------------------------------------------------------

// api lấy ngày chiếu của phim
export const callGetShowDateByMovieId = async (id) => {
  try {
    const response = await api.get(`/api/showtime/dates/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// --------------------------------------------------------
