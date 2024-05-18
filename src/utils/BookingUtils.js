import { useDispatch } from "react-redux";
import { doSetSelectedPromotionBill } from "../redux/booking/bookingSlice";

const BookingUtils = () => {
  const dispatch = useDispatch();

  const CalculateTotalPrice = (
    seats,
    foods,
    roomPrice,
    promotionBill,
    promotionSeat,
    promotionFood
  ) => {
    let newTotalPrice = 0;
    // Tính tổng tiền cho các ghế ngồi
    seats.forEach((seat) => {
      const seatPrice = seat.price;
      newTotalPrice += seatPrice + roomPrice;
    });

    console.log("newTotalPrice sau khi tinh ghe: ", newTotalPrice);

    // Tính tổng tiền cho các món đồ ăn
    foods.forEach((food) => {
      newTotalPrice += food.price * food?.quantity;
    });

    // Áp dụng khuyến mãi nếu có
    const finallyPrice = ApplyPromotion(
      newTotalPrice,
      promotionBill,
      seats,
      promotionSeat,
      foods,
      promotionFood,
      roomPrice
    );

    return finallyPrice;
  };

  const ApplyPromotion = (
    totalPrice,
    promotionBill,
    seats,
    promotionSeat,
    foods,
    promotionFood,
    roomPrice
  ) => {
    let newTotalPrice = totalPrice;

    if (promotionSeat?.promotionTicketDetailDto) {
      newTotalPrice = ApplyTicket(
        seats,
        newTotalPrice,
        promotionSeat,
        roomPrice
      );
    }

    if (promotionFood?.promotionFoodDetailDto) {
      newTotalPrice = ApplyFood(foods, newTotalPrice, promotionFood);
    }

    if (promotionBill?.promotionDiscountDetailDto) {
      newTotalPrice = ApplyDiscount(newTotalPrice, promotionBill);
    }

    console.log("newTotalPrice sau khi áp dụng khuyến mãi: ", newTotalPrice);
    return newTotalPrice;
  };

  const ApplyDiscount = (totalPrice, promotionBill) => {
    console.log("totalPrice trong discount: ", promotionBill);
    if (promotionBill?.promotionDiscountDetailDto?.typeDiscount === "PERCENT") {
      const minBillValue =
        promotionBill.promotionDiscountDetailDto.minBillValue;
      if (totalPrice >= minBillValue) {
        const discountValue =
          promotionBill.promotionDiscountDetailDto.discountValue;
        const maxValue = promotionBill.promotionDiscountDetailDto.maxValue;

        const discountedPrice = totalPrice * (discountValue / 100);
        console.log("discountedPrice: ", discountedPrice);
        console.log("maxValue: ", maxValue);
        // Kiểm tra nếu giá giảm đã bằng hoặc vượt quá maxValue thì giữ nguyên giá trị tổng giá
        const finalPrice =
          discountedPrice <= maxValue
            ? totalPrice - discountedPrice
            : totalPrice - maxValue;
        console.log("totalPrice va promotion bill ko bị reset: ", finalPrice);
        return finalPrice;
      } else {
        dispatch(doSetSelectedPromotionBill({}));
        return totalPrice;
      }
    }
    // if (
    //   promotionBill.promotionDiscountDetailDto.typeDiscount === "AMOUNT"
    // )
    else {
      const discountValue =
        promotionBill?.promotionDiscountDetailDto?.discountValue;
      const finalPrice = totalPrice - discountValue;
      console.log("nó có vào không? finalPrice: ", finalPrice);
      return finalPrice;
    }
  };

  const ApplyTicket = (seats, totalPrice, promotionSeat, roomPrice) => {
    // Kiểm tra nếu có thông tin về chi tiết khuyến mãi vé
    console.log("promotionSeat: ", promotionSeat);
    if (promotionSeat?.promotionTicketDetailDto) {
      const {
        typeSeatRequired,
        quantityRequired,
        typeSeatPromotion,
        quantityPromotion,
      } = promotionSeat?.promotionTicketDetailDto;

      // Kiểm tra các điều kiện của khuyến mãi vé
      if (typeSeatRequired && quantityRequired && typeSeatPromotion) {
        // Đếm số lượng ghế phù hợp với loại ghế yêu cầu
        const selectedRequired = seats.filter(
          (seat) => seat.seatTypeId === typeSeatRequired
        ).length;

        // Nếu số lượng ghế đạt yêu cầu
        if (selectedRequired >= quantityRequired) {
          // Kiểm tra xem có ghế phù hợp với loại ghế khuyến mãi không
          const promotionSeats = seats.filter(
            (seat) => seat.seatTypeId === typeSeatPromotion
          );

          // Kiểm tra nếu có đủ ghế khuyến mãi, cùng loại với ghế yêu cầu
          // nếu ghế khuyến mãi cùng với loại ghế yêu cầu, thì cần trừ số ghế yêu cầu ra khỏi số ghế khuyến mãi đã chọn
          // nếu ghế khuyến mãi khác loại ghế yêu cầu, thì kiểm tra ghế số lượng ghế khuyến mãi đã chọn >= số lượng ghế khuyến mãi
          if (promotionSeats?.length >= 0) {
            const promotionSeatPrice =
              promotionSeat.promotionTicketDetailDto.price > 0
                ? promotionSeat.promotionTicketDetailDto.price
                : promotionSeats[0].price;

            let discountAmount = 0;
            // nếu cùng loại ghế yêu cầu và ghế khuyến mãi
            if (typeSeatRequired === typeSeatPromotion) {
              // ghế khuyến mãi đã chọn - số ghế yêu cầu
              const promotionSeatQuantity =
                promotionSeats.length - quantityRequired;
              discountAmount =
                Math.min(quantityPromotion, promotionSeatQuantity) *
                (promotionSeatPrice + roomPrice);
            } else {
              discountAmount =
                Math.min(quantityPromotion, promotionSeats.length) *
                (promotionSeatPrice + roomPrice);
            }

            // Trừ giảm giá từ tổng giá
            totalPrice -= discountAmount;
          }
        }
      }
    }

    console.log(
      "totalPrice trong ApplyTicket nó đã trừ tiền của khuyến mãi ghế: ",
      totalPrice
    );
    return totalPrice;
  };

  const ApplyFood = (foods, totalPrice, promotionFood) => {
    // Kiểm tra nếu có thông tin về chi tiết khuyến mãi đồ ăn
    if (promotionFood?.promotionFoodDetailDto) {
      const {
        foodRequired,
        quantityRequired,
        foodPromotion,
        quantityPromotion,
      } = promotionFood?.promotionFoodDetailDto;

      // kiểm tra các điều kiện của khuyến mãi đồ ăn
      if (foodRequired && quantityRequired && foodPromotion) {
        // Đếm số lượng món ăn phù hợp với loại món yêu cầu
        const selectedFoodRequired = foods.filter((food) => {
          if (food.id === foodRequired) {
            return food;
          }
        });

        // Nếu số lượng món ăn đạt yêu cầu
        if (selectedFoodRequired[0]?.quantity >= quantityRequired) {
          // Kiểm tra xem có món ăn phù hợp với loại món khuyến mãi không
          const promotionFoods = foods.filter((food) => {
            if (food.id === foodPromotion) {
              return food;
            }
          });
          // Kiểm tra nếu có đủ món ăn khuyến mãi, sản phẩm tặng khác loại sản phẩm yêu cầu
          if (promotionFoods[0]?.quantity >= 0) {
            const promotionFoodPrice =
              promotionFood.promotionFoodDetailDto.price > 0
                ? promotionFood.promotionFoodDetailDto.price
                : promotionFoods[0].price;

            var discountAmount = 0;

            // nếu cùng loại món yêu cầu và món khuyến mãi
            if (foodRequired === foodPromotion) {
              // món khuyến mãi đã chọn - số món yêu cầu
              const promotionFoodQuantity =
                promotionFoods[0].quantity - quantityRequired;
              discountAmount =
                Math.min(quantityPromotion, promotionFoodQuantity) *
                promotionFoodPrice;
            } else {
              discountAmount =
                Math.min(quantityPromotion, promotionFoods[0].quantity) *
                promotionFoodPrice;
            }

            // Trừ giảm giá từ tổng giá
            totalPrice -= discountAmount;
          }
        }
      }
    }

    return totalPrice;
  };

  return { CalculateTotalPrice };
};

export default BookingUtils;

// tính tiền ghế không áp khuyến mãi
export const PriceSeats = (seats, roomPrice) => {
  let newTotalPrice = 0;
  // Tính tổng tiền cho các ghế ngồi
  seats.forEach((seat) => {
    const seatPrice = seat.price;
    newTotalPrice += seatPrice + roomPrice;
  });

  return newTotalPrice;
};

// tính tiền đồ ăn không áp khuyến mãi
export const PriceFood = (food) => {
  let newTotalPrice = 0;
  newTotalPrice += food.price * food?.quantity;

  return newTotalPrice;
};
