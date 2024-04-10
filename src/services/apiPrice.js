import api from "../utils/axios-custom";

// module giá
export const callGetPriceHeaderById = async (id) => {
  try {
    const response = await api.get(`/api/salePrice/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callFetchListSalePrice = async (query) => {
  try {
    const response = await api.get(`/api/salePrice?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const callCreateSalePrice = async (
  name,
  startDate,
  endDate,
  description
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("startDate", startDate);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("description", description);
  bodyFormData.append("status", false);
  try {
    const response = await api({
      method: "post",
      url: "/api/salePrice",
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

export const callUpdateSalePrice = async (
  id,
  name,
  endDate,
  description,
  status
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("description", description);
  bodyFormData.append("status", status);

  try {
    const response = await api({
      method: "put",
      url: "/api/salePrice",
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

export const callDeleteSalePrice = async (id) => {
  try {
    const response = await api.delete(`/api/salePrice/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

// sale price detail
export const callGetAllPriceDetail = async (id) => {
  try {
    const response = await api.get(`api/salePrice/${id}/detail`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callCreateSalePriceDetail = async (
  type_sale,
  priceHeaderId,
  price,
  status,
  itemId
) => {
  const data = [
    {
      price: price,
      [type_sale === "seat" ? "typeSeatId" : "foodId"]: itemId,
      priceHeaderId: priceHeaderId,
      status: status,
    },
  ];

  try {
    const response = await api.post("/api/salePrice/detail", data);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callUpdateSalePriceDetail = async (
  priceDetailId,
  price,
  status,
  itemId,
  type_sale
) => {
  const data = [
    {
      price: price,
      [type_sale === "seat" ? "typeSeatId" : "foodId"]: itemId,
      status: status,
    },
  ];
  try {
    const response = await api.put(
      `/api/salePrice/detail/${priceDetailId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};

export const callDeleteSalePriceDetail = async (id) => {
  try {
    const response = await api.delete(`/api/salePrice/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
};
