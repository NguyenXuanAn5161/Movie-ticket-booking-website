import api from "../utils/axios-custom";

// promotion header
export const callGetPromotionHeaderById = async (id) => {
  try {
    const response = await api.get(`/api/promotion/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callFetchListPromotionHeader = async (query) => {
  try {
    const response = await api.get(`/api/promotion?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreatePromotionHeader = async (data) => {
  const { name, timeValue, description } = data;
  const startDate = timeValue[0].format("YYYY-MM-DDTHH:mm:ss");
  const endDate = timeValue[1].format("YYYY-MM-DDTHH:mm:ss");

  const bodyFormData = new FormData();
  bodyFormData.append("name", name);
  bodyFormData.append("startDate", startDate);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("description", description);
  bodyFormData.append("status", false);

  try {
    const response = await api({
      method: "post",
      url: "/api/promotion",
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

// get promtion line by promotionId
export const callGetPromotionLineByPromotionId = async (query) => {
  try {
    const response = await api.get(`/api/promotion/line?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
// // create promotion line
// export const callCreatePromotionLine = async (data, promotionId) => {
//   const {
//     code,
//     name,
//     description,
//     typePromotion,
//     timeValue,
//     applicableObject,
//     usePerUser,
//     usePerPromotion,
//     PromotionDetailDto,
//   } = data;

//   const startDate = timeValue[0].format("YYYY-MM-DDTHH:mm:ss");
//   const endDate = timeValue[1].format("YYYY-MM-DDTHH:mm:ss");

//   const bodyFormData = new FormData();
//   bodyFormData.append("promotionId", promotionId);
//   bodyFormData.append("code", code);
//   bodyFormData.append("name", name);
//   bodyFormData.append("description", description);
//   bodyFormData.append("typePromotion", typePromotion);
//   bodyFormData.append("startDate", startDate);
//   bodyFormData.append("endDate", endDate);
//   bodyFormData.append("status", true);
//   bodyFormData.append("applicableObject", applicableObject);
//   bodyFormData.append("usePerUser", usePerUser);
//   bodyFormData.append("usePerPromotion", usePerPromotion);
//   bodyFormData.append("PromotionDetailDto", JSON.stringify(PromotionDetailDto));

//   try {
//     const response = await api({
//       method: "post",
//       url: `/api/promotion/line`,
//       data: bodyFormData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

export const callCreatePromotionLine = async (data, promotionId) => {
  const {
    code,
    name,
    description,
    typePromotion,
    timeValue,

    usePerUser,
    usePerPromotion,
    PromotionDetailDto,
  } = data;

  const startDate = timeValue[0].format("YYYY-MM-DDTHH:mm:ss");
  const endDate = timeValue[1].format("YYYY-MM-DDTHH:mm:ss");
  const applicableObject = data.applicableObject[0];
  const requestData = {
    promotionId,
    code,
    name,
    description,
    typePromotion,
    startDate,
    endDate,
    status: true,
    applicableObject,
    usePerUser,
    usePerPromotion,
    PromotionDetailDto,
  };

  try {
    const response = await api.post(`/api/promotion/line`, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

// tìm theo mã khuyến mãi
// api/promotion/fit-bill-code
export const callGetPromotionByCode = async (
  promotionLineCode,
  totalValueBill,
  dateTime,
  applicableObject
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("promotionLineCode", "A222");
  bodyFormData.append("totalValueBill", "500");
  bodyFormData.append("dateTime", "2024-04-06T11:59:11.332");
  bodyFormData.append("applicableObject", "ALL");

  try {
    const response = await api.get(
      `/api/promotion/fit-bill-code`,
      bodyFormData
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// // create promotion line
// export const callCreatePromotionLine = async (data, promotionId) => {
//   const bodyFormData = new FormData();
//   console.log("dâta trong api: ", data);
//   bodyFormData.append("promotionId", promotionId);
//   bodyFormData.append("code", data.code);
//   bodyFormData.append("name", data.name);
//   bodyFormData.append("description", data.description);
//   bodyFormData.append("typePromotion", data.typePromotion);
//   bodyFormData.append(
//     "startDate",
//     data.timeValue[0].format("YYYY-MM-DDTHH:mm:ss")
//   );
//   bodyFormData.append(
//     "endDate",
//     data.timeValue[1].format("YYYY-MM-DDTHH:mm:ss")
//   );
//   bodyFormData.append("status", true);
//   bodyFormData.append("applicableObject", data.applicableObject);
//   bodyFormData.append("usePerUser", data.usePerUser);
//   bodyFormData.append("usePerPromotion", data.usePerPromotion);
//   bodyFormData.append(
//     "PromotionDetailDto",
//     JSON.stringify(data.PromotionDetailDto)
//   );

//   try {
//     const response = await api({
//       method: "post",
//       url: `/api/promotion/line`,
//       data: bodyFormData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };
