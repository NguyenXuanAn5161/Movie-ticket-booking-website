import { Card, Divider } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Thanhtoantructiep from "../../../assets/imagePayment/ThanhToanTrucTiep.png";
import vnPayLogo from "../../../assets/imagePayment/logo-VNPAY.png";
import InforUser from "../../../components/Booking/InforUser";
import PaymentMethods from "../../../components/Booking/PaymentMethods";
import { doSetSelectedPaymentMethod } from "../../../redux/booking/bookingSlice";

const methods = [
  { id: "CASH", name: "Thanh toán trực tiếp", image: Thanhtoantructiep },
  { id: "VNPAY", name: "VnPay", image: vnPayLogo },
];

const BookingPayment = () => {
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    dispatch(doSetSelectedPaymentMethod(selectedMethod));
  }, [selectedMethod]);

  useEffect(() => {
    const defaultMethod = methods.find((method) => method.id === "CASH");
    setSelectedMethod(defaultMethod);
  }, []);

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div style={{ justifyContent: "start" }}>
      <Card style={{ marginBottom: 10 }}>
        <h5 style={{ textAlign: "left" }}>Thông tin khách hàng</h5>
        <Divider />
        <InforUser />
      </Card>
      <Card>
        <h5 style={{ textAlign: "left" }}>Phương thức thanh toán</h5>
        <Divider />
        <PaymentMethods
          methods={methods}
          onSelect={handleSelect}
          selectedMethod={selectedMethod}
        />
      </Card>
    </div>
  );
};

export default BookingPayment;
