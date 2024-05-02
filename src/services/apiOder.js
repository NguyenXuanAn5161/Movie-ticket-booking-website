import api from "../utils/axios-custom";

// get detail order by id
export const callGetDetailOrder = async (id) => {
  try {
    const response = await api.get(`/api/invoice/detail/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

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
  typePay
) => {
  const bodyFormData = new FormData();
  // Trích xuất mã ghế từ mỗi đối tượng ghế và tạo mảng mã ghế
  const seatIds = selectedSeats.map((seat) => seat.id);
  seatIds.forEach((seatId) => {
    bodyFormData.append("seatIds", seatId);
  });

  bodyFormData.append("showTimeId", showTime.id);
  // Lặp qua danh sách sản phẩm
  foods.length > 0
    ? foods.forEach((food) => {
        // Thêm id của sản phẩm vào FormData theo số lượng của sản phẩm
        for (let i = 0; i < food.quantity; i++) {
          bodyFormData.append("foodIds", food.id);
        }
      })
    : bodyFormData.append("foodIds", "");
  bodyFormData.append("emailUser", emailUser.email);
  bodyFormData.append("staffId", staffId);
  bodyFormData.append("typePay", typePay);

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

export const callCreateInvoiceByVnPay = async (
  amount,
  showTime,
  seats,
  foods,
  emailUser,
  staffId
) => {
  const bodyFormData = new FormData();
  // Trích xuất mã ghế từ mỗi đối tượng ghế và tạo mảng mã ghế
  const seatIds = seats.map((seat) => seat.id);
  seatIds.forEach((seatId) => {
    bodyFormData.append("seatIds", seatId);
  });

  bodyFormData.append("showTimeId", showTime.id);
  // Lặp qua danh sách sản phẩm
  foods.length > 0
    ? foods.forEach((food) => {
        // Thêm id của sản phẩm vào FormData theo số lượng của sản phẩm
        for (let i = 0; i < food.quantity; i++) {
          bodyFormData.append("foodIds", food.id);
        }
      })
    : bodyFormData.append("foodIds", "");
  bodyFormData.append("emailUser", emailUser.email);
  bodyFormData.append("staffId", staffId);
  bodyFormData.append("amount", amount);

  try {
    const response = await api({
      method: "post",
      url: "/api/invoice/vnpay",
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

export const callVerifyPayment = async (queryParams) => {
  try {
    const response = await api.get(
      `/api/invoice/vnpay-payment-return${queryParams}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
