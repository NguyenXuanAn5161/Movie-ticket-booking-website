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
import {
  callCreateGuest,
  callCreateUserInBooking,
} from "../../services/apiUser";
import BookingFood from "./Steps/BookingFood";
import BookingPayment from "./Steps/BookingPayment";
import BookingSchedule from "./Steps/BookingSchedule";
import BookingSeat from "./Steps/BookingSeat";

const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedUser = useSelector((state) => state.booking.user);
  const selectedMethodInfoUser = useSelector(
    (state) => state.booking.selectedMethodInfoUser
  );
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );
  const selectedSeat = useSelector((state) => state.booking.selectedSeats);
  const selectedFoods = useSelector((state) => state.booking.selectedFoods);
  const totalPrice = useSelector((state) => state.booking.totalPrice);
  const selectedPaymentMethod = useSelector(
    (state) => state.booking.selectedPaymentMethod
  );

  useEffect(() => {
    dispatch(doResetBooking());
  }, []);

  const [isSubmit, setIsSubmit] = useState(false);
  const [current, setCurrent] = useState(0);

  const checkSelectedUser = async () => {
    if (!selectedUser && selectedMethodInfoUser !== 3) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: "Vui lòng nhập thông tin đầy đủ!",
      });
      return;
    }

    switch (selectedMethodInfoUser) {
      case 1:
        if (!selectedUser.email) {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description: "Vui lòng nhập đầy đủ thông tin!",
          });
          return;
        }
        return selectedUser.email;
      case 2:
        if (!selectedUser.selectedUser || !selectedUser.selectedEmail) {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description: "Vui lòng nhập đầy đủ thông tin!",
          });
          return;
        }
        const resUser = await callCreateUserInBooking(
          selectedUser.selectedUser,
          selectedUser.selectedEmail
        );
        if (resUser?.status === 200) {
          return selectedUser.selectedEmail;
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description:
              resUser?.response?.data?.message || "Không thể tạo tài khoản!",
          });
          return;
        }
      case 3:
        const resGuest = await callCreateGuest();
        if (resGuest?.email) {
          return resGuest.email;
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description:
              resGuest?.response?.data?.message || "Không thể tạo tài khoản!",
          });
          return;
        }
      default:
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: "Vui lòng chọn phương thức tạo tài khoản!",
        });
        return;
    }
  };

  const onFinish = async (values) => {
    setIsSubmit(true);
    const resultEmail = await checkSelectedUser();
    console.log("resultEmail: ", resultEmail);
    if (!resultEmail) {
      setIsSubmit(false);
      return;
    } else {
      if (selectedPaymentMethod.id === "CASH") {
        const res = await callCreateInvoice(
          selectedShowTime,
          selectedSeat,
          selectedFoods,
          resultEmail,
          "2",
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
          totalPrice,
          selectedShowTime,
          selectedSeat,
          selectedFoods,
          resultEmail,
          "1"
        );
        console.log("resVnPay: ", resVnPay);
        if (resVnPay?.status === 200) {
          window.location.href = resVnPay.message;
        }
      }
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
          <div style={{ marginTop: 24 }}>{steps[current].formComponent}</div>
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
