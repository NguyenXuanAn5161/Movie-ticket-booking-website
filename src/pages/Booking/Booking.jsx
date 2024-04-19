import { Button, Col, Form, Row, Steps, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/OrderCard/OrderCard";
import {
  doResetBooking,
  doSetSelectedPromotion,
} from "../../redux/booking/bookingSlice";
import { callFetchListTypeSeat } from "../../services/apiMovie";
import { callCreateInvoice } from "../../services/apiOder";
import { callFitPromotion } from "../../services/apiPromotion";
import BookingFood from "./Steps/BookingFood";
import BookingPayment from "./Steps/BookingPayment";
import BookingSchedule from "./Steps/BookingSchedule";
import BookingSeat from "./Steps/BookingSeat";

const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );
  const selectedSeat = useSelector((state) => state.booking.selectedSeats);
  const selectedFoodItems = useSelector(
    (state) => state.booking.selectedFoodItems
  );
  const user = useSelector((state) => state.booking.user);
  const selectedPromotion = useSelector(
    (state) => state.booking.selectedPromotion
  );

  const [isSubmit, setIsSubmit] = useState(false);
  const [current, setCurrent] = useState(0);
  const [price, setPrice] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    console.log("promotion: ", selectedPromotion);
  }, [selectedPromotion]);

  // call lấy khuyến mãi khi có giá thay đổi
  useEffect(() => {
    if (totalPrice > 0) {
      fetchFitPromotion(totalPrice);
    } else {
      dispatch(doSetSelectedPromotion({}));
    }
  }, [totalPrice]);

  const fetchFitPromotion = async (totalPrice) => {
    const res = await callFitPromotion(totalPrice);
    if (res) {
      if (res.id !== selectedPromotion?.id) {
        console.log("res khuyen mai: ", res);
        message.success("Chúc mừng bạn nhận được khuyến mãi " + res.name);
        dispatch(doSetSelectedPromotion(res));
      }
    }
  };

  // useEffect(() => {
  //   // Tính lại giá khi có khuyến mãi
  //   if (selectedPromotion) {
  //     if (
  //       selectedPromotion.typePromotion === "DISCOUNT" &&
  //       selectedPromotion.promotionDiscountDetailDto.typeDiscount === "PERCENT"
  //     ) {
  //       const discountValue =
  //         selectedPromotion.promotionDiscountDetailDto.discountValue;
  //       const maxValue = selectedPromotion.promotionDiscountDetailDto.maxValue;
  //       const discountedPrice = totalPrice * (1 - discountValue / 100);

  //       // Kiểm tra nếu giá giảm đã bằng hoặc vượt quá maxValue thì giữ nguyên giá trị tổng giá
  //       const finalPrice =
  //         discountedPrice <= maxValue ? discountedPrice : totalPrice - maxValue;

  //       setTotalPrice(finalPrice);
  //     }
  //   }
  // }, []);

  // fetch giá
  useEffect(() => {
    fetchPriceTypeSeat();
  }, []);

  const fetchPriceTypeSeat = async () => {
    const res = await callFetchListTypeSeat();
    if (res) {
      setPrice(res);
    }
  };

  const steps = [
    {
      title: "Chọn rạp / Phim / Suất",
      formComponent: <BookingSchedule form={form} />,
    },
    {
      title: "Chọn ghế",
      formComponent: <BookingSeat form={form} />,
    },
    {
      title: "Chọn thức ăn",
      formComponent: <BookingFood form={form} />,
    },
    {
      title: "Thanh toán",
      formComponent: <BookingPayment form={form} />,
    },
  ];

  const onFinish = async (values) => {
    setIsSubmit(true);
    const res = await callCreateInvoice(
      selectedShowTime,
      selectedSeat,
      selectedFoodItems,
      user,
      "1",
      selectedPromotion.id
    );
    // console.log("res dat ve: ", res);
    if (res?.status === 200) {
      message.success("Đặt vé thành công!");
      dispatch(doResetBooking());
      navigate("/admin/order");
      setIsSubmit(false);
    } else {
      console.log("res dat ve: ", res.response.data.message);
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
      setIsSubmit(false);
    }
  };

  const next = () => setCurrent(current + 1);

  const prev = () => setCurrent(current - 1);

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Row gutter={16}>
        <Col span={15}>
          <Steps current={current} items={items} />
          <div style={{ marginTop: 24, textAlign: "center" }}>
            {steps[current].formComponent}
          </div>
        </Col>
        <Col span={9}>
          <OrderCard
            price={price}
            totalPrice={totalPrice}
            setTotalPrice={setTotalPrice}
          />
          <div style={{ marginTop: 24, textAlign: "right" }}>
            {current > 0 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={prev}>
                Quay lại
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Tiếp tục
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={onFinish}>
                Hoàn thành
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BookingPage;
