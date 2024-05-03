import { Button, Col, Row, Steps, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/OrderCard/OrderCard";
import { doResetBooking } from "../../redux/booking/bookingSlice";
import {
  callCreateInvoice,
  callCreateInvoiceByVnPay,
} from "../../services/apiOder";
import BookingFood from "./Steps/BookingFood";
import BookingPayment from "./Steps/BookingPayment";
import BookingSchedule from "./Steps/BookingSchedule";
import BookingSeat from "./Steps/BookingSeat";

const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );
  const selectedSeat = useSelector((state) => state.booking.selectedSeats);
  const selectedFoods = useSelector((state) => state.booking.selectedFoods);
  const user = useSelector((state) => state.booking.user);
  const selectedPromotionBill = useSelector(
    (state) => state.booking.selectedPromotionBill
  );
  const selectedPaymentMethod = useSelector(
    (state) => state.booking.selectedPaymentMethod
  );
  const totalPrice = useSelector((state) => state.booking.totalPrice);

  useEffect(() => {
    dispatch(doResetBooking());
  }, []);

  const [isSubmit, setIsSubmit] = useState(false);
  const [current, setCurrent] = useState(0);

  const onFinish = async (values) => {
    setIsSubmit(true);
    if (selectedPaymentMethod.id === "CASH") {
      const res = await callCreateInvoice(
        selectedShowTime,
        selectedSeat,
        selectedFoods,
        user,
        "1",
        selectedPaymentMethod.id
      );
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
    } else {
      const resVnPay = await callCreateInvoiceByVnPay(
        "45000",
        selectedShowTime,
        selectedSeat,
        selectedFoods,
        user,
        "1"
      );
      console.log("resVnPay: ", resVnPay);
      if (resVnPay?.status === 200) {
        window.location.href = resVnPay.message;
      }

      // check url
      const url = window.location.href;
      console.log("url: ", url);
    }
  };

  const steps = [
    {
      title: "Chọn rạp / Phim / Suất",
      formComponent: <BookingSchedule />,
    },
    {
      title: "Chọn ghế",
      formComponent: <BookingSeat />,
    },
    {
      title: "Chọn thức ăn",
      formComponent: <BookingFood />,
    },
    {
      title: "Thanh toán",
      formComponent: <BookingPayment />,
    },
  ];

  const next = () => {
    if (current === 1 && selectedSeat.length === 0) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: "Vui lòng chọn ghế!",
      });
      return;
    }
    setCurrent(current + 1);
  };

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
          <OrderCard />
          <div style={{ marginTop: 24, textAlign: "right" }}>
            {current > 0 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={prev}>
                Quay lại
              </Button>
            )}
            {current < steps.length - 1 &&
              Object.keys(selectedShowTime).length > 0 && (
                <Button type="primary" onClick={next}>
                  Tiếp tục
                </Button>
              )}
            {current === steps.length - 1 && (
              <Button type="primary" loading={isSubmit} onClick={onFinish}>
                Thanh toán
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BookingPage;
