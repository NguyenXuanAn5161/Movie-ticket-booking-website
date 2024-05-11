import api from "../utils/axios-custom";

// signin /api/auth/signin
export const callLogin = async (email, password) => {
  const bodyFormData = new FormData();
  bodyFormData.append("email", email);
  bodyFormData.append("password", password);

  try {
    const response = await api({
      method: "post",
      // url: "/api/users/signin",
      url: "/api/users/signinWeb",
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
export const callLogout = async () => {
  try {
    const response = await api({
      method: "post",
      url: "/api/auth/signout",
    });
    return response;
  } catch (error) {
    return error;
  }
};
