import { Card, Image, List, Typography } from "antd";
import React, { useEffect, useState } from "react";
import QuantityCounter from "../../../components/QuantityCounter/QuantityCounter";
import { callFetchListFood } from "../../../services/apiMovie";
import { imageError } from "../../../utils/imageError";

const { Meta } = Card;
const { Text } = Typography;

const BookingFood = ({ setSelectedFoodItems }) => {
  const [listFood, setListFood] = useState([]);

  useEffect(() => {
    fetchListFood();
  }, []);

  const fetchListFood = async () => {
    try {
      const query = "size=100";
      const res = await callFetchListFood(query);
      if (res?.content) {
        setListFood(res.content);
      }
    } catch (error) {
      console.error("Error fetching list of food:", error);
    }
  };

  // Function to update selected food items with their quantities and prices
  const handleSelectFood = (foodId, quantity, price, name) => {
    setSelectedFoodItems((prev) => {
      const newSelectedFoodItems = [...prev];
      const index = newSelectedFoodItems.findIndex(
        (item) => item.id === foodId
      );
      if (index !== -1) {
        newSelectedFoodItems[index] = {
          ...newSelectedFoodItems[index],
          quantity,
          price,
        };
      } else {
        newSelectedFoodItems.push({
          id: foodId,
          name: name,
          quantity: quantity,
          price: price,
        });
      }
      return newSelectedFoodItems;
    });
  };

  return (
    <List
      grid={{ gutter: 32, column: 1 }}
      dataSource={listFood}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card style={{ width: "100%", cursor: "pointer" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  marginLeft: 16,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  width={100}
                  height={"auto"}
                  src={item?.image}
                  fallback={imageError}
                  alt="Lỗi tải hình ảnh"
                />
                <div
                  style={{
                    marginLeft: 16,
                    flexDirection: "column",
                    textAlign: "start",
                  }}
                >
                  <Meta title={item.name} />
                  <Text>
                    Giá:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item?.price ?? "NaN")}
                  </Text>
                </div>
              </div>
              <QuantityCounter
                selectedFoodId={item.id}
                handleSelectFood={handleSelectFood}
                price={item.price}
                name={item.name}
              />
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default BookingFood;
