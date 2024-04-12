import api from "../utils/axios-custom";

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

export const callCreateFood = async (data, imageUrl) => {
  const bodyFormData = new FormData();
  bodyFormData.append("cinemaIds", data.cinemaId.value);
  bodyFormData.append("name", data.name);
  bodyFormData.append("image", imageUrl);
  bodyFormData.append("categoryId", data.categoryId);
  bodyFormData.append("sizeFood", data.sizeFood);
  bodyFormData.append("status", data.status);
  bodyFormData.append("quantity", data.quantity);

  try {
    const response = await api({
      method: "post",
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

export const callUpdateFood = async (data, imageUrl) => {
  const bodyFormData = new FormData();
  if (imageUrl) {
    bodyFormData.append("image", imageUrl);
  } else {
    bodyFormData.append("image", data.image);
  }
  bodyFormData.append("cinemaId", data.cinemaId);
  bodyFormData.append("id", data.id);
  bodyFormData.append("name", data.name);
  bodyFormData.append("categoryId", data.categoryId);
  bodyFormData.append("quantity", data.quantity);
  bodyFormData.append("sizeFood", data.sizeFood);
  bodyFormData.append("status", data.status);

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
