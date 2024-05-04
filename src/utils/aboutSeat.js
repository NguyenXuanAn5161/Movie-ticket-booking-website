export const compareTypeSeat = (seatId, typeSeats) => {
  let result = null;
  typeSeats.forEach((typeSeat) => {
    if (seatId === typeSeat.id) {
      result = typeSeat.name;
    }
  });

  return result === "VIP"
    ? "Ghế vip"
    : result === "STANDARD"
    ? "Ghế thường"
    : "Ghế đôi";
};

export const checkTicketPromotion = (promotionSeat, seats) => {
  const { typeSeatRequired, quantityRequired, typeSeatPromotion } =
    promotionSeat?.promotionTicketDetailDto;

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

      if (promotionSeats.length >= 0) {
        // nếu cùng loại ghế yêu cầu và ghế khuyến mãi
        if (typeSeatRequired === typeSeatPromotion) {
          // ghế khuyến mãi đã chọn - số ghế yêu cầu
          const promotionSeatQuantity =
            promotionSeats.length - quantityRequired;
          return promotionSeatQuantity > 0 ? true : false;
        } else {
          return true;
        }
      }
    }
  }
  return false;
};

export const checkFoodPromotion = (promotionFood, foods) => {
  const { foodRequired, quantityRequired, foodPromotion, quantityPromotion } =
    promotionFood?.promotionFoodDetailDto;

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
        // nếu cùng loại món yêu cầu và món khuyến mãi
        if (foodRequired === foodPromotion) {
          // món khuyến mãi đã chọn - số món yêu cầu
          const promotionFoodQuantity =
            promotionFoods[0].quantity - quantityRequired;
          return promotionFoodQuantity > 0 ? true : false;
        } else {
          return true;
        }
      }
    }
  }
  return false;
};
