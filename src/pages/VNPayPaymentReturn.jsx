import { Button, Spin, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { callVerifyPayment } from "../services/apiOder";

const VNPayPaymentReturn = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchApiVerifyPayment();
  }, []);

  const fetchApiVerifyPayment = async () => {
    const resVerifyPayment = await callVerifyPayment(location.search);
    console.log("resVerifyPayment:", resVerifyPayment);
    if (resVerifyPayment?.status === 200) {
      setPaymentStatus("success");
      message.success(resVerifyPayment.message);
    } else {
      setPaymentStatus("error");
      setReason(resVerifyPayment.response.data.message);
      notification.error({
        message: "Thanh toán thất bại!",
        description: resVerifyPayment.response.data.message,
      });
    }
  };

  let content;
  if (paymentStatus === "success") {
    content = <div>{navigate("/order")}</div>;
  } else if (paymentStatus === "error") {
    content = (
      <div>
        <h2>Thanh toán thất bại!</h2>
        <p>Rất tiếc, thanh toán của bạn không thành công.</p>
        <p>
          Lý do: <strong>{reason}</strong>
        </p>
        <Button type="primary" onClick={() => navigate("/booking")}>
          Trở về trang đặt vé
        </Button>
      </div>
    );
  } else {
    content = (
      <div>
        <h2>Đang xử lý...</h2>
        <p>Vui lòng đợi trong khi chúng tôi xác nhận thanh toán của bạn.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginTop: "20px" }}>
        <Spin spinning={paymentStatus === null}>{content}</Spin>
      </div>
    </div>
  );
};

export default VNPayPaymentReturn;
