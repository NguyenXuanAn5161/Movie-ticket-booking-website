import axios from "axios";

// Lấy URL backend từ biến môi trường
const backendURL = import.meta.env.VITE_BACKEND_URL_1;

// Tạo một instance Axios
const api = axios.create({
  baseURL: backendURL, // Sử dụng URL backend lấy từ biến môi trường
  timeout: 10000, // Thời gian chờ tối đa
  //   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// user
export const callFetchUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const callFetchListUser = async (page, size, username, phone, email) => {
  try {
    const response = await api.get("/api/users", {
      params: {
        page: page,
        size: size,
        username: username,
        phone: phone,
        email: email,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const callCreateUser = async (
  username,
  email,
  gender,
  birthday,
  phone,
  password
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("username", username);
  bodyFormData.append("email", email);
  bodyFormData.append("gender", gender);
  bodyFormData.append("birthday", birthday);
  bodyFormData.append("phone", phone);
  bodyFormData.append("password", password);
  try {
    const response = await api({
      method: "post",
      url: "/api/users",
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

export const callUpdateUser = async (
  id,
  username,
  gender,
  birthday,
  email,
  phone,
  enabled
) => {
  try {
    const response = await api.put(`/api/users/${id}`, {
      id,
      username,
      gender,
      birthday,
      email,
      phone,
      enabled,
    });
    return response;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callDeleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

// module cinema
export const callFetchCinemaById = async (id) => {
  try {
    const response = await api.get(`/api/cinema/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const callFetchListCinema = async (query) => {
  try {
    const response = await api.get(`/api/cinema?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const callCreateCinema = async (
  name,
  status,
  city,
  district,
  ward,
  street
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("status", status);
  bodyFormData.append("nation", "Việt Nam");
  bodyFormData.append("city", city);
  bodyFormData.append("district", district);
  bodyFormData.append("ward", ward);
  bodyFormData.append("street", street);
  try {
    const response = await api({
      method: "post",
      url: "/api/cinema",
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

export const callUpdateCinema = async (
  id,
  name,
  status,
  city,
  district,
  ward,
  street,
  totalRoom
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  bodyFormData.append("status", status);
  bodyFormData.append("nation", "Việt Nam");
  bodyFormData.append("city", city);
  bodyFormData.append("district", district);
  bodyFormData.append("ward", ward);
  bodyFormData.append("street", street);
  bodyFormData.append("totalRoom", totalRoom);
  try {
    const response = await api({
      method: "put",
      url: "/api/cinema",
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

export const callDeleteCinema = async (id) => {
  try {
    const response = await api.delete(`/api/cinema/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callGetCinemaById = async (id) => {
  try {
    const response = await api.get(`/api/cinema/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

// room
export const callFetchRoomById = async (id) => {
  try {
    const response = await api.get(`/api/room/${id}`);
    return response;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callFetchListRoom = async (query) => {
  try {
    const response = await api.get(`/api/room?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateRoom = async (data) => {
  try {
    const response = await api.post("/api/room", data);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callUpdateRoom = async (data) => {
  try {
    const response = await api.put(`/api/room/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callDeleteRoom = async (id) => {
  try {
    const response = await api.delete(`/api/room/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

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

// loại đồ ăn
export const callGetCategoryFoodById = async (id) => {
  try {
    const response = await api.get(`/api/categoryFood/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callFetchListCategoryFood = async (query) => {
  try {
    const response = await api.get(`/api/categoryFood?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateCategoryFood = async (name) => {
  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  try {
    const response = await api({
      method: "post",
      url: "/api/categoryFood",
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

export const callUpdateCategoryFood = async (id, name) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  try {
    const response = await api({
      method: "put",
      url: "/api/categoryFood",
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

export const callDeleteCategoryFood = async (id) => {
  try {
    const response = await api.delete(`/api/categoryFood/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

// đồ ăn
export const callGetFoodById = async (id) => {
  try {
    const response = await api.get(`/api/food/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callFetchListFood = async (query) => {
  try {
    const response = await api.get(`/api/food?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateFood = async (formData) => {
  try {
    const response = await api({
      method: "post",
      url: "/api/food",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callUpdateFood = async (
  id,
  name,
  price,
  quantity,
  categoryId,
  status,
  size,
  image
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  bodyFormData.append("quantity", quantity);
  bodyFormData.append("image", image);
  bodyFormData.append("price", price);
  bodyFormData.append("categoryId", categoryId);
  bodyFormData.append("sizeFood", size);
  bodyFormData.append("status", status);

  try {
    const response = await api({
      method: "put",
      url: "/api/food",
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

export const callDeleteFood = async (id) => {
  try {
    const response = await api.delete(`/api/food/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

// module giá
export const callGetPriceHeaderById = async (id) => {
  try {
    const response = await api.get(`/api/salePrice/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callFetchListSalePrice = async (query) => {
  try {
    const response = await api.get(`/api/salePrice?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const callCreateSalePrice = async (
  name,
  startDate,
  endDate,
  description
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("startDate", startDate);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("description", description);
  bodyFormData.append("status", false);
  try {
    const response = await api({
      method: "post",
      url: "/api/salePrice",
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

export const callUpdateSalePrice = async (
  id,
  name,
  endDate,
  description,
  status
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("description", description);
  bodyFormData.append("status", status);

  try {
    const response = await api({
      method: "put",
      url: "/api/salePrice",
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

export const callDeleteSalePrice = async (id) => {
  try {
    const response = await api.delete(`/api/salePrice/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

// sale price detail
export const callGetAllPriceDetail = async (id) => {
  try {
    const response = await api.get(`api/salePrice/${id}/detail`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callCreateSalePriceDetail = async (
  type_sale,
  priceHeaderId,
  price,
  status,
  itemId
) => {
  const data = [
    {
      price: price,
      [type_sale === "seat" ? "typeSeatId" : "foodId"]: itemId,
      priceHeaderId: priceHeaderId,
      status: status,
    },
  ];

  try {
    const response = await api.post("/api/salePrice/detail", data);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callUpdateSalePriceDetail = async (
  priceDetailId,
  price,
  status,
  itemId,
  type_sale
) => {
  const data = [
    {
      price: price,
      [type_sale === "seat" ? "typeSeatId" : "foodId"]: itemId,
      status: status,
    },
  ];
  try {
    const response = await api.put(
      `/api/salePrice/detail/${priceDetailId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callDeleteSalePriceDetail = async (id) => {
  try {
    const response = await api.delete(`/api/salePrice/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
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
  bodyFormData.append("cinemaId", cinemaId);
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
  bodyFormData.append("cinemaId", cinemaId);

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

// promotion header
export const callGetPromotionHeaderById = async (id) => {
  try {
    const response = await api.get(`/api/promotion/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callFetchListPromotionHeader = async (query) => {
  try {
    const response = await api.get(`/api/promotion?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreatePromotionHeader = async (data) => {
  const { name, timeValue, description } = data;
  const startDate = timeValue[0].format("YYYY-MM-DDTHH:mm:ss");
  const endDate = timeValue[1].format("YYYY-MM-DDTHH:mm:ss");

  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("startDate", startDate);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("description", description);
  bodyFormData.append("status", false);

  try {
    const response = await api({
      method: "post",
      url: "/api/promotion",
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

// get promtion line by promotionId
export const callGetPromotionLineByPromotionId = async (query) => {
  try {
    const response = await api.get(`/api/promotion/line?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
// create promotion line
export const callCreatePromotionLine = async (data, promotionId, image) => {
  const {
    code,
    name,
    description,
    typePromotion,
    timeValue,
    applicableObject,
    usePerUser,
    usePerPromotion,
    PromotionDetailDto,
  } = data;

  const startDate = timeValue[0].format("YYYY-MM-DDTHH:mm:ss");
  const endDate = timeValue[1].format("YYYY-MM-DDTHH:mm:ss");

  const bodyFormData = new FormData();
  bodyFormData.append("promotionId", promotionId);
  bodyFormData.append("code", code);
  bodyFormData.append("name", name);
  bodyFormData.append("image", image);
  bodyFormData.append("description", description);
  bodyFormData.append("typePromotion", typePromotion);
  bodyFormData.append("startDate", startDate);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("status", false);
  bodyFormData.append("applicableObject", applicableObject);
  bodyFormData.append("usePerUser", usePerUser);
  bodyFormData.append("usePerPromotion", usePerPromotion);
  // bodyFormData.append("PromotionDetailDto", JSON.stringify(PromotionDetailDto));

  try {
    const response = await api({
      method: "post",
      url: `/api/promotion/line`,
      data: bodyFormData,
      body: JSON.stringify(PromotionDetailDto),
      headers: {
        "Content-Type": "multipart/form-data",
        // Accept: "application/json",
        // type: "formData",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
