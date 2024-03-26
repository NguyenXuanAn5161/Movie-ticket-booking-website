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
    const response = await api.delete(`/api/users?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};
