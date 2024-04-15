import api from "../utils/axios-custom";

export const callGetAllOrder = async (query) => {
  try {
    const response = await api.get(`/api/invoice?${query}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const callCreateInvoice = async (
  showTime,
  selectedSeats,
  foods,
  emailUser,
  staffId,
  promotionIds
) => {
  const bodyFormData = new FormData();
  // Trích xuất mã ghế từ mỗi đối tượng ghế và tạo mảng mã ghế
  const seatIds = selectedSeats.map((seat) => seat.id);
  seatIds.forEach((seatId) => {
    bodyFormData.append("seatIds", seatId);
  });

  bodyFormData.append("showTimeId", showTime.id);
  // Lặp qua danh sách sản phẩm
  foods.forEach((food) => {
    // Thêm id của sản phẩm vào FormData theo số lượng của sản phẩm
    for (let i = 0; i < food.quantity; i++) {
      bodyFormData.append("foodIds", food.id);
    }
  });
  bodyFormData.append("emailUser", emailUser.email);
  bodyFormData.append("staffId", staffId);
  bodyFormData.append("promotionIds", promotionIds);

  try {
    const response = await api({
      method: "post",
      url: "/api/invoice",
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
