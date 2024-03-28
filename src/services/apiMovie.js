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
