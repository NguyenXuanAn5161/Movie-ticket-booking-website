import { Card, Image, List, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationPromotion from "../../../components/Notification/NotificationPromotion";
import QuantityCounter from "../../../components/QuantityCounter/QuantityCounter";
import {
  doSetSelectedFoods,
  doSetSelectedPromotionFood,
} from "../../../redux/booking/bookingSlice";
import { callFetchListFood } from "../../../services/apiFood";
import { fetchPromotionByFood } from "../../../services/apiPromotion";
import { imageError } from "../../../utils/imageError";

const { Meta } = Card;
const { Text } = Typography;

const BookingFood = () => {
  const dispatch = useDispatch();
  const selectedCinema = useSelector((state) => state.booking.selectedCinema);
  const selectedFoods = useSelector((state) => state.booking.selectedFoods);
  const selectedPromotionFood = useSelector(
    (state) => state.booking.selectedPromotionFood
  );

  const [listFood, setListFood] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (selectedCinema?.value) {
      fetchListFoodByCinema(selectedCinema.value);
    }
  }, []);

  const fetchListFoodByCinema = async (cinemaId) => {
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
    const newSelectedFoodItems = [...selectedFoods];

    const index = newSelectedFoodItems.findIndex((item) => item.id === foodId);

    if (quantity === 0) {
      if (index !== -1) {
        newSelectedFoodItems.splice(index, 1);
        dispatch(doSetSelectedFoods(newSelectedFoodItems));
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
    dispatch(doSetSelectedFoods(newSelectedFoodItems));
  };

  // fetch promotion by food
  useEffect(() => {
    if (selectedFoods.length > 0 && selectedCinema?.value) {
      getPromotionByFood(selectedFoods, selectedCinema.value);
    } else {
      dispatch(doSetSelectedPromotionFood({}));
    }
  }, [selectedFoods]);

  const getPromotionByFood = async (foods, cinemaId) => {
    const resPromotion = await fetchPromotionByFood(foods, cinemaId);
    console.log("resPromotion: ", resPromotion?.id);
    if (resPromotion) {
      if (resPromotion?.id !== selectedPromotionFood?.id) {
        dispatch(doSetSelectedPromotionFood(resPromotion));
        handleOpenModal();
      }
    }
  };

  return (
    <>
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
                {item.active_price === true && item.quantity > 0 ? (
                  <QuantityCounter
                    selectedFoodId={item.id}
                    handleSelectFood={handleSelectFood}
                    price={item.price}
                    name={item.name}
                    selectedQuantity={
                      selectedFoods.find((food) => food.id === item.id)
                        ?.quantity ?? 0
                    }
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
      <NotificationPromotion
        promotion={selectedPromotionFood}
        modalVisible={modalVisible}
        handleClose={handleCloseModal}
      />
    </>
  );
};

export default BookingFood;
