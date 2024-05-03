import { Image, Modal } from "antd";
import React, { useEffect, useState } from "react";
import imagePromotionDefault from "../../assets/promotion.png";
import useTheme from "../../core/useTheme";
import { callGetFoodById } from "../../services/apiFood";
import { callFetchListTypeSeat } from "../../services/apiMovie";
import { compareTypeSeat } from "../../utils/aboutSeat";
import { formatCurrency } from "../../utils/formatData";
import "./styles.scss"; // Import CSS file

const NotificationPromotion = ({ promotion, modalVisible, handleClose }) => {
  const { theme } = useTheme();
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

  const message =
    promotion?.typePromotion === "TICKET"
      ? `Bạn sẽ được miễn phí ${promotion?.promotionTicketDetailDto.quantityPromotion} ${seatNamePromotion} khi mua ${promotion?.promotionTicketDetailDto.quantityRequired} ${seatNameRequired}. Vui lòng chọn thêm để được nhận khuyến mãi!`
      : promotion?.typePromotion === "FOOD"
      ? `Bạn sẽ được miễn phí ${promotion?.promotionFoodDetailDto.quantityPromotion} ${foodNamePromotion} khi mua ${promotion?.promotionFoodDetailDto.quantityRequired} ${foodNameRequired}. Vui lòng chọn thêm để được nhận khuyến mãi!`
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

  useEffect(() => {
    console.log("fz_32", theme.fontSize);
    if (modalVisible) {
      Modal.info({
        title: "Thông báo",
        content: (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Image
              width={150}
              height={"auto"}
              src={imagePromotionDefault}
              alt="Promotion Image"
            />
            <p style={{ fontSize: theme.fontSize.fz_18 }}>{message}</p>
          </div>
        ),
        onOk() {
          handleClose();
        },
      });
    }
  }, [modalVisible]);

  return null;
};

export default NotificationPromotion;
