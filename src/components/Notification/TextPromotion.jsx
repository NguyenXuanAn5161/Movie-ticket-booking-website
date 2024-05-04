import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { callGetFoodById } from "../../services/apiFood";
import { callFetchListTypeSeat } from "../../services/apiMovie";
import {
  checkFoodPromotion,
  checkTicketPromotion,
  compareTypeSeat,
} from "../../utils/aboutSeat";
import { formatCurrency } from "../../utils/formatData";

const TextPromotion = ({ promotion }) => {
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const selectedFoods = useSelector((state) => state.booking.selectedFoods);

  const [seatNamePromotion, setSeatNamePromotion] = useState(null);
  const [seatNameRequired, setSeatNameRequired] = useState(null);
  const [foodNamePromotion, setFoodNamePromotion] = useState(null);
  const [foodNameRequired, setFoodNameRequired] = useState(null);
  const [typeSeat, setTypeSeat] = useState(null);

  // fetch type seat để so sánh loại ghế
  useEffect(() => {
    getTypeSeat();
  }, []);

  const getTypeSeat = async () => {
    const resTypeSeat = await callFetchListTypeSeat();
    setTypeSeat(resTypeSeat);
  };

  useEffect(() => {
    if (promotion?.promotionTicketDetailDto && typeSeat) {
      const seatPromotion = compareTypeSeat(
        promotion.promotionTicketDetailDto.typeSeatPromotion,
        typeSeat
      );
      setSeatNamePromotion(seatPromotion);
      const required = compareTypeSeat(
        promotion.promotionTicketDetailDto.typeSeatRequired,
        typeSeat
      );
      setSeatNameRequired(required);
    }
  }, [promotion, typeSeat]);

  useEffect(() => {
    if (promotion?.promotionFoodDetailDto) {
      getNameFoodRequire(promotion.promotionFoodDetailDto.foodRequired);
      getNameFoodPromotion(promotion.promotionFoodDetailDto.foodPromotion);
    }
  }, [promotion]);

  const getNameFoodRequire = async (foodId) => {
    const res = await callGetFoodById(foodId);
    setFoodNameRequired(res.name);
  };
  const getNameFoodPromotion = async (foodId) => {
    const res = await callGetFoodById(foodId);
    setFoodNamePromotion(res.name);
  };

  const messageText =
    promotion?.typePromotion === "TICKET"
      ? `Bạn sẽ được miễn phí ${promotion?.promotionTicketDetailDto.quantityPromotion} ${seatNamePromotion} khi mua ${promotion?.promotionTicketDetailDto.quantityRequired} ${seatNameRequired}.`
      : promotion?.typePromotion === "FOOD"
      ? `Bạn sẽ được miễn phí ${promotion?.promotionFoodDetailDto.quantityPromotion} ${foodNamePromotion} khi mua ${promotion?.promotionFoodDetailDto.quantityRequired} ${foodNameRequired}.`
      : promotion?.typePromotion === "DISCOUNT"
      ? promotion?.promotionDiscountDetailDto?.typeDiscount === "PERCENT"
        ? `Bạn được ưu đãi giảm ${
            promotion?.promotionDiscountDetailDto.discountValue
          }% khi hóa đơn từ ${formatCurrency(
            promotion?.promotionDiscountDetailDto.minBillValue
          )}. Giảm tối đa ${formatCurrency(
            promotion?.promotionDiscountDetailDto.maxValue
          )}.`
        : `Bạn được ưu đãi giảm trực tiếp ${formatCurrency(
            promotion?.promotionDiscountDetailDto.discountValue
          )} khi hóa đơn từ ${formatCurrency(
            promotion?.promotionDiscountDetailDto.minBillValue
          )}. Giảm tối đa ${formatCurrency(
            promotion?.promotionDiscountDetailDto.maxValue
          )}.`
      : "";

  const renderMessage = () => {
    var isChecked = true;
    if (promotion?.typePromotion === "TICKET") {
      isChecked = checkTicketPromotion(promotion, selectedSeats);
    }
    if (promotion?.typePromotion === "FOOD") {
      isChecked = checkFoodPromotion(promotion, selectedFoods);
    }

    return isChecked ? <Typography.Text>{messageText}</Typography.Text> : null;
  };

  return <div className="text-promotion">{renderMessage()}</div>;
};

export default TextPromotion;
