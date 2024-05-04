import { Button } from "antd";
import React, { useState } from "react";

const QuantityCounter = ({
  selectedFoodId,
  handleSelectFood,
  price,
  name,
  selectedQuantity,
}) => {
  const [quantity, setQuantity] = useState(selectedQuantity); // Default quantity is 0

  // Function to increase the quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    handleSelectFood(selectedFoodId, quantity + 1, price, name);
  };

  // Function to decrease the quantity
  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      handleSelectFood(selectedFoodId, quantity - 1, price, name);
    }
  };

  return (
    <div>
      <Button
        style={{ cursor: "pointer" }}
        type="primary"
        onClick={decreaseQuantity}
      >
        -
      </Button>
      <span style={{ margin: "0 10px" }}>{quantity}</span>
      <Button
        style={{ cursor: "pointer" }}
        type="primary"
        onClick={increaseQuantity}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityCounter;
