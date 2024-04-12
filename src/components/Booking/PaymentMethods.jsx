import { Image, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const PaymentMethod = ({ payment, onClick, isChecked }) => (
  <div
    onClick={onClick}
    className="payment-method"
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      gap: 10,
      padding: 10,
      cursor: "pointer",
    }}
  >
    <input type="radio" checked={isChecked} onChange={onClick} />
    <Image src={payment.image} alt={payment.name} width={50} />
    <Title level={5}>{payment.name}</Title>
  </div>
);

const PaymentMethods = ({ methods, onSelect, selectedMethod }) => (
  <div className="payment-methods">
    {methods.map((method) => (
      <PaymentMethod
        key={method.name}
        payment={method}
        onClick={() => onSelect(method)}
        isChecked={method?.id === selectedMethod?.id}
      />
    ))}
  </div>
);

export default PaymentMethods;
