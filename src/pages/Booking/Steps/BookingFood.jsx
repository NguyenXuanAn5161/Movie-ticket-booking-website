import { Card, Image, List, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuantityCounter from "../../../components/QuantityCounter/QuantityCounter";
import { doSetSelectedFoodItems } from "../../../redux/booking/bookingSlice";
import { callFetchListFood } from "../../../services/apiFood";
import { imageError } from "../../../utils/imageError";

const { Meta } = Card;
const { Text } = Typography;

const BookingFood = () => {
  const dispatch = useDispatch();
  const selectedCinema = useSelector((state) => state.booking.selectedCinema);

  useEffect(() => {
    console.log("selectedCinema: ", selectedCinema);
  }, []);
  const selectedFoodItems = useSelector(
    (state) => state.booking.selectedFoodItems
  );

  const [listFood, setListFood] = useState([]);

  useEffect(() => {
    if (selectedCinema?.value) {
      fetchListFood(selectedCinema.value);
    }
  }, []);

  const fetchListFood = async (cinemaId) => {
    try {
      const query = `size=100&cinemaId=${cinemaId}`;
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
    const newSelectedFoodItems = [...selectedFoodItems];

    const index = newSelectedFoodItems.findIndex((item) => item.id === foodId);

    if (quantity === 0) {
      if (index !== -1) {
        newSelectedFoodItems.splice(index, 1);
        dispatch(doSetSelectedFoodItems(newSelectedFoodItems));
      }
    } else {
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
    }
    dispatch(doSetSelectedFoodItems(newSelectedFoodItems));
  };

  return (
    <List
      grid={{ gutter: 32, column: 1 }}
      dataSource={listFood}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card style={{ width: "100%" }}>
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
                  {item?.price && (
                    <Text>
                      Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item?.price ?? "NaN")}
                    </Text>
                  )}
                </div>
              </div>
              {item.active_price === true ? (
                <QuantityCounter
                  selectedFoodId={item.id}
                  handleSelectFood={handleSelectFood}
                  price={item.price}
                  name={item.name}
                />
              ) : (
                <Text disabled style={{ fontWeight: 700, color: "#FFC107" }}>
                  Không có sẵn
                </Text>
              )}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default BookingFood;
