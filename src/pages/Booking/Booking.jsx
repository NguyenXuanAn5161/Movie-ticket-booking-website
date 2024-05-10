import {
  Button,
  Col,
  Row,
  Statistic,
  Steps,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/OrderCard/OrderCard";
import { doResetBooking } from "../../redux/booking/bookingSlice";
import { doSetIsRunning } from "../../redux/counter/counterSlice";
import {
  callCheckHoldSeat,
  callCreateInvoice,
  callCreateInvoiceByVnPay,
  callHoldSeats,
} from "../../services/apiOder";
import {
  callCreateGuest,
  callCreateUserInBooking,
} from "../../services/apiUser";
import BookingFood from "./Steps/BookingFood";
import BookingPayment from "./Steps/BookingPayment";
import BookingSchedule from "./Steps/BookingSchedule";
import BookingSeat from "./Steps/BookingSeat";

const { Countdown } = Statistic;

const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isRunning = useSelector((state) => state.counter.isRunning);
  const userCurrent = useSelector((state) => state.account.user);
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
    if (!userCurrent) {
      message.success("Vui lòng đăng nhập để tiếp tục!");
    }
  }, [userCurrent]);

  useEffect(() => {
    dispatch(doSetIsRunning(false));
    dispatch(doResetBooking());
  }, []);

  const [deadline, setDeadline] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isRunning) {
      setDeadline(Date.now() + 1000 * 60 * 7);
    }
  }, [isRunning]);

  const checkSelectedUser = async () => {
    if (!selectedUser && selectedMethodInfoUser !== 3) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: "Vui lòng nhập thông tin đầy đủ!",
      });
      return;
    }

    switch (selectedMethodInfoUser) {
      case 1: {
        if (!selectedUser.email) {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description: "Vui lòng nhập đầy đủ thông tin!",
          });
          return;
        }
        return selectedUser.email;
      }
      case 2: {
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
      }
      case 3: {
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
    dispatch(doSetIsRunning(false));
    const resultEmail = await checkSelectedUser();
    console.log("resultEmail: ", resultEmail);
    if (!resultEmail) {
      setIsSubmit(false);
      return;
    }

    if (selectedPaymentMethod.id === "CASH") {
      const res = await callCreateInvoice(
        selectedShowTime,
        selectedSeat,
        selectedFoods,
        resultEmail,
        userCurrent.id,
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
        userCurrent.id
      );
      console.log("resVnPay: ", resVnPay);
      if (resVnPay?.status === 200) {
        window.location.href = resVnPay.message;
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

  const fetchCheckSeat = async (selectedSeat, showTimeId) => {
    const resCheckHoldSeat = await callCheckHoldSeat(selectedSeat, showTimeId);
    if (resCheckHoldSeat?.status === 200) {
      if (resCheckHoldSeat.message === null) {
        return false;
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: resCheckHoldSeat.message || "Ghế đã có người đặt!",
        });
        return true;
      }
    }
  };

  const handleFinish = async () => {
    const resHoldSeats = await callHoldSeats(
      selectedSeat,
      selectedShowTime.id,
      true
    );
    if (resHoldSeats?.status === 200) {
      console.log("resHoldSeats trong: ", resHoldSeats);
      dispatch(doSetIsRunning(false));
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: "Hết thời gian giữ ghế!",
      });
      setCurrent(0);
      dispatch(doResetBooking());
    }
  };

  const fetchHoldSeatTrue = async (status) => {
    const resHoldSeats = await callHoldSeats(
      selectedSeat,
      selectedShowTime.id,
      status
    );
    if (resHoldSeats?.status === 200) {
      return true;
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: resHoldSeats.response.data.message,
      });
      return false;
    }
  };

  const next = async () => {
    if (current === 1 && selectedSeat.length === 0) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: "Vui lòng chọn ghế!",
      });
      return;
    } else if (current === 1 && selectedSeat.length > 0) {
      const checkSeat = await fetchCheckSeat(selectedSeat, selectedShowTime.id);
      if (checkSeat) {
        return;
      } else {
        const checkedHold = await fetchHoldSeatTrue(false);
        if (checkedHold) {
          dispatch(doSetIsRunning(true));
        }
      }
    }
    setCurrent(current + 1);
  };

  const prev = async () => {
    if (current === 2 && selectedSeat.length > 0) {
      const checkedHold = await fetchHoldSeatTrue(true);
      if (checkedHold) {
        dispatch(doSetIsRunning(false));
      }
    }
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Row gutter={16}>
      <Col span={15}>
        <Steps current={current} items={items} />
        <div style={{ marginTop: 24 }}>{steps[current].formComponent}</div>
      </Col>
      <Col span={9}>
        {isRunning ? (
          <Countdown
            title="Thời gian giữ ghế:"
            value={deadline}
            onFinish={handleFinish}
            format={"mm:ss"}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          />
        ) : null}
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
  );
};

export default BookingPage;
