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

export const callFetchListUser = async (query) => {
  try {
    const response = await api.get(`/api/users?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const callCreateMor = async (data) => {
  const bodyFormData = new FormData();
  bodyFormData.append("username", data.username);
  bodyFormData.append("email", data.email);
  bodyFormData.append("gender", data.gender);
  bodyFormData.append("phone", data.phone);
  bodyFormData.append("password", data.password);

  try {
    const response = await api({
      method: "post",
      url: "/api/users/mor",
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

export const callCreateGuest = async () => {
  try {
    const response = await api.post("/api/users/guest");
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callCreateUserInBooking = async (username, email) => {
  const bodyFormData = new FormData();
  bodyFormData.append("username", username);
  bodyFormData.append("email", email);
  try {
    const response = await api({
      method: "post",
      url: "/api/users/userInTicket",
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
