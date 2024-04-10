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

export const callCreateFood = async (formData) => {
  try {
    const response = await api({
      method: "post",
      url: "/api/food",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callUpdateFood = async (
  id,
  name,
  price,
  quantity,
  categoryId,
  status,
  size,
  image
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  bodyFormData.append("quantity", quantity);
  bodyFormData.append("image", image);
  bodyFormData.append("price", price);
  bodyFormData.append("categoryId", categoryId);
  bodyFormData.append("sizeFood", size);
  bodyFormData.append("status", status);

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
