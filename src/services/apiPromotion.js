import api from "../utils/axios-custom";
import { FORMAT_DATE_TIME_Y_M_DT_H_M_S } from "../utils/constant";

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

export const callUpdatePromotionHeader = async (
  id,
  name,
  startDate,
  endDate,
  description,
  status
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  if (startDate) {
    bodyFormData.append("startDate", startDate);
  }
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("description", description);
  bodyFormData.append("status", status);

  try {
    const response = await api({
      method: "put",
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

// line
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
    quantity,
  } = data;

  const startDate = timeValue[0].format(FORMAT_DATE_TIME_Y_M_DT_H_M_S);
  const endDate = timeValue[1].format(FORMAT_DATE_TIME_Y_M_DT_H_M_S);
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
        quantity,
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
        quantity,
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
        quantity,
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

export const callUpdatePromotionLine = async (data, imageUrl) => {
  const { quantity, id, name, description, timeValue, status } = data;
  const startDate = timeValue[0].format(FORMAT_DATE_TIME_Y_M_DT_H_M_S);
  const endDate = timeValue[1].format(FORMAT_DATE_TIME_Y_M_DT_H_M_S);
  // const startDate = timeValue[0].format(FORMAT_DATE_TIME_HHmm);
  // const endDate = timeValue[1].format(FORMAT_DATE_TIME_HHmm);

  const bodyFormData = new FormData();
  if (imageUrl) {
    bodyFormData.append("image", imageUrl);
  } else {
    bodyFormData.append("image", data.image);
  }
  bodyFormData.append("id", id);
  bodyFormData.append("name", name);
  bodyFormData.append("description", description);
  bodyFormData.append("startDate", startDate);
  bodyFormData.append("endDate", endDate);
  bodyFormData.append("status", status);
  bodyFormData.append("quantity", quantity);

  try {
    const response = await api({
      method: "put",
      url: "/api/promotion/line",
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

export const callDeletePromotionLine = async (id) => {
  try {
    const response = await api.delete(`/api/promotion/line/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// --------------------------------------------
// bill
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

// seats
export const fetchPromotionByTicket = async (seats, showTimeId) => {
  const seatIds = seats.map((seat) => seat.id).join(",");

  try {
    const response = await api.get(
      `/api/promotion/line_ticket/active?seatId=${seatIds}&showTimeId=${showTimeId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching promotion by ticket:", error);
    return error;
  }
};

// foods
export const fetchPromotionByFood = async (foods, cinemaId) => {
  const foodIds = [];
  foods.forEach((food) => {
    for (let i = 0; i < food.quantity; i++) {
      foodIds.push(food.id);
    }
  });

  const foodIdsString = foodIds.join(",");

  try {
    const response = await api.get(
      `/api/promotion/line_food/active?foodId=${foodIdsString}&cinemaId=${cinemaId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching promotion by food:", error);
    return error;
  }
};
