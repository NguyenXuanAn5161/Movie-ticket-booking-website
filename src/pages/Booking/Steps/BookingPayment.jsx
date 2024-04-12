import { Card, Divider } from "antd";
import React, { useEffect, useState } from "react";
import MoMoLogo from "../../../assets/imagePayment/MoMo_Logo.png";
import Thanhtoantructiep from "../../../assets/imagePayment/ThanhToanTrucTiep.png";
import ZaloPayLogo from "../../../assets/imagePayment/ZaloPay_Logo.png";
import InforUser from "../../../components/Booking/InforUser";
import PaymentMethods from "../../../components/Booking/PaymentMethods";

const methods = [
  { id: 1, name: "Thanh toán trực tiếp", image: Thanhtoantructiep },
  { id: 2, name: "Ví Điện Tử MoMo", image: MoMoLogo },
  { id: 3, name: "ZaloPay", image: ZaloPayLogo },
];

const BookingPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    // Chọn phương thức thanh toán mặc định (ở đây là MoMo)
    const defaultMethod = methods.find(
      (method) => method.name === "Thanh toán trực tiếp"
    );
    setSelectedMethod(defaultMethod);
  }, []);

  const handleSelect = (method) => {
    setSelectedMethod(method);
    console.log("Phương thức thanh toán đã chọn:", method);
  };

  return (
    <div style={{ justifyContent: "start" }}>
      <Card style={{ marginBottom: 10 }}>
        <h5 style={{ textAlign: "left" }}>Khuyến mãi</h5>
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
