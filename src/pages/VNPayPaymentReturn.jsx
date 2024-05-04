import { Spin, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { callVerifyPayment } from "../services/apiOder";

const VNPayPaymentReturn = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);

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
      notification.error({
        message: "Thanh toán thất bại!",
        description: resVerifyPayment.response.data.message,
      });
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginTop: "20px" }}>
        <Spin spinning={paymentStatus === null}>
          {paymentStatus === "success" ? (
            <div>{navigate("/admin/order")}</div>
          ) : paymentStatus === "error" ? (
            <div>
              <h2>Thanh toán thất bại!</h2>
              <p>Rất tiếc, thanh toán của bạn không thành công.</p>
              {/* Hiển thị các thông tin khác nếu cần */}
            </div>
          ) : (
            <div>
              <h2>Đang xử lý...</h2>
              <p>
                Vui lòng đợi trong khi chúng tôi xác nhận thanh toán của bạn.
              </p>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default VNPayPaymentReturn;
