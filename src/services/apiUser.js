import api from "../utils/axios-custom";

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
