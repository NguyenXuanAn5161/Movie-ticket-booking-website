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

export const callFetchListUser = async (
  page,
  size,
  code,
  username,
  phone,
  email
) => {
  try {
    const response = await api.get("/api/users", {
      params: {
        page: page,
        size: size,
        code: code,
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

export const callCreateUser = (data) => {
  return api.post("/api/users", data);
};

export const callDeleteUser = (id) => {
  return api.delete(`/api/users?${id}`);
};
