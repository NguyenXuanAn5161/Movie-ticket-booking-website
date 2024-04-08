import { Button } from "antd";
import React, { useState } from "react";

const QuantityCounter = () => {
  const [quantity, setQuantity] = useState(1); // Số lượng mặc định là 1

  // Hàm tăng số lượng
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <div>
      <Button onClick={decreaseQuantity}>-</Button>
      <span style={{ margin: "0 10px" }}>{quantity}</span>
      <Button onClick={increaseQuantity}>+</Button>
    </div>
  );
};

export default QuantityCounter;
