import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Thanhtoantructiep from "../../../assets/imagePayment/ThanhToanTrucTiep.png";
import vnPayLogo from "../../../assets/imagePayment/logo-VNPAY.png";
import InfoUser from "../../../components/Booking/InfoUser";
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
    <>
      <Card style={{ marginBottom: 10 }} title="Thông tin khách hàng">
        <InfoUser />
      </Card>
      <Card title="Phương thức thanh toán">
        <PaymentMethods
          methods={methods}
          onSelect={handleSelect}
          selectedMethod={selectedMethod}
        />
      </Card>
    </>
  );
};

export default BookingPayment;
