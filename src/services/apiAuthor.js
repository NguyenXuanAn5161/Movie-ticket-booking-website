import api from "../utils/axios-custom";

// signin /api/auth/signin
export const callLogin = (email, password) => {
  const bodyFormData = new FormData();
  bodyFormData.append("email", email);
  bodyFormData.append("password", password);

  try {
    const response = api({
      method: "post",
      url: "/api/auth/signin",
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

// /api/auth/signout
export const callLogout = () => {
  try {
    const response = api({
      method: "post",
      url: "/api/auth/signout",
    });
    return response;
  } catch (error) {
    return error;
  }
};
