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

export const callCreatePromotionLine = async (data, imageUrl) => {
  const {
    name,
    description,
    timeValue,
    typePromotion,
    promotionId,
    maxValue,
    typeDiscount,
    minBillValue,
    discountValue,
    quantityRequired,
    quantityPromotion,
    typeSeatRequired,
    typeSeatPromotion,
  } = data;

  const startDate = timeValue[0].format("YYYY-MM-DDTHH:mm:ss");
  const endDate = timeValue[1].format("YYYY-MM-DDTHH:mm:ss");
  const image = imageUrl;
  let foodPromotion;
  let foodRequired;
  if (typePromotion === "FOOD") {
    foodPromotion = data?.foodPromotion.value;
    foodRequired = data?.foodRequired.value;
  }

  const promotionDiscountDetailDto = {
    maxValue,
    typeDiscount,
    minBillValue,
    discountValue,
  };
  const promotionFoodDetailDto = {
    foodRequired,
    quantityRequired,
    foodPromotion,
    quantityPromotion,
    price: 0,
  };
  const promotionTicketDetailDto = {
    typeSeatRequired,
    quantityRequired,
    typeSeatPromotion,
    quantityPromotion,
    price: 0,
  };

  let requestData = {};
  typePromotion === "DISCOUNT"
    ? (requestData = {
        name,
        image,
        description,
        startDate,
        endDate,
        typePromotion,
        promotionId,
        promotionDiscountDetailDto,
      })
    : typePromotion === "FOOD"
    ? (requestData = {
        name,
        image,
        description,
        startDate,
        endDate,
        typePromotion,
        promotionId,
        promotionFoodDetailDto,
      })
    : (requestData = {
        name,
        image,
        description,
        startDate,
        endDate,
        typePromotion,
        promotionId,
        promotionTicketDetailDto,
      });

  console.log("requestData", requestData);

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

// --------------------------------------------
// áp khuyến mãi phù hợp
export const callFitPromotion = async (totalPrice) => {
  try {
    const response = await api.get(
      `/api/promotion/line_discount/active?totalPrice=${totalPrice}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
