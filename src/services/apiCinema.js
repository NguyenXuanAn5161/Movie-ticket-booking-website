import api from "../utils/axios-custom";

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
