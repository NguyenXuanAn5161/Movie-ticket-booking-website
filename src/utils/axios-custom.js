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

export default api;
