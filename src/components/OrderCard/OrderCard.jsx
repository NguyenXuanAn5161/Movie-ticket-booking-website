import { Card, Col, Image, Row, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  doSetSelectedPromotionBill,
  doSetSelectedRoom,
  doSetTotalPrice,
} from "../../redux/booking/bookingSlice";
import {
  callFetchListTypeSeat,
  callGetMovieById,
} from "../../services/apiMovie";
import { callFitPromotion } from "../../services/apiPromotion";
import { callFetchRoomById } from "../../services/apiRoom";
import BookingUtils from "../../utils/BookingUtils";
import { imageError } from "../../utils/imageError";
import TextPromotion from "../Notification/TextPromotion";
import "./styles.scss";

const OrderCard = (props) => {
  const { CalculateTotalPrice } = BookingUtils();

  const dispatch = useDispatch();
  const selectedMovie = useSelector((state) => state.booking.selectedMovie);
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const selectedFoods = useSelector((state) => state.booking.selectedFoods);
  const selectedPromotionBill = useSelector(
    (state) => state.booking.selectedPromotionBill
  );
  const selectedPromotionSeat = useSelector(
    (state) => state.booking.selectedPromotionSeat
  );
  const selectedPromotionFood = useSelector(
    (state) => state.booking.selectedPromotionFood
  );
  const selectedRoom = useSelector((state) => state.booking.selectedRoom);
  const totalPrice = useSelector((state) => state.booking.totalPrice);

  const [movie, setMovie] = useState(null);
  const [typeSeat, setTypeSeat] = useState(null);

  useEffect(() => {
    setMovie(null);
  }, []);

  useEffect(() => {
    console.log("selectedSeats: ", selectedSeats);
  }, [selectedSeats]);

  const findSeatTypeIdByName = (typeName) => {
    const type = typeSeat?.find((type) => type.name === typeName);
    return type ? type.id : null;
  };

  // fetch type seat để so sánh loại ghế
  useEffect(() => {
    getTypeSeat();
  }, []);

  const getTypeSeat = async () => {
    const resTypeSeat = await callFetchListTypeSeat();
    setTypeSeat(resTypeSeat);
  };

  // lấy giá phòng
  useEffect(() => {
    if (selectedShowTime?.roomId) {
      fetchRoomById(selectedShowTime.roomId);
    }
  }, [selectedShowTime]);

  const fetchRoomById = async (id) => {
    try {
      const res = await callFetchRoomById(id);
      if (res?.data) {
        dispatch(doSetSelectedRoom(res.data));
      }
    } catch (error) {
      console.log("Error fetching room:", error);
    }
  };

  // fetch promotion bill
  useEffect(() => {
    if (totalPrice > 0) {
      fetchFitPromotion(totalPrice);
    } else {
      dispatch(doSetSelectedPromotionBill({}));
    }
  }, [totalPrice]);

  const fetchFitPromotion = async (totalPrice) => {
    const res = await callFitPromotion(totalPrice);
    if (res) {
      if (res.id !== selectedPromotionBill?.id) {
        console.log("res khuyen mai: ", res);
        dispatch(doSetSelectedPromotionBill(res));
      }
    }
  };

  // fetch movie để hiện thông tin trong card
  useEffect(() => {
    if (selectedMovie?.value) {
      fetchMovie(selectedMovie.value);
    }
  }, [selectedMovie]);

  const fetchMovie = async (id) => {
    try {
      const res = await callGetMovieById(id);
      if (res) {
        setMovie(res);
      }
    } catch (error) {
      console.log("Error fetching movie:", error);
    }
  };

  // -------------phần tính toán--------------
  useEffect(() => {
    if (selectedSeats.length > 0 || selectedFoods.length > 0) {
      const price = CalculateTotalPrice(
        selectedSeats,
        selectedFoods,
        selectedRoom.price,
        selectedPromotionBill,
        selectedPromotionSeat,
        selectedPromotionFood
      );
      dispatch(doSetTotalPrice(price));
    }

    if (selectedSeats.length === 0 && selectedFoods.length === 0) {
      dispatch(doSetTotalPrice(0));
    }
  }, [
    selectedSeats,
    selectedFoods,
    selectedPromotionBill,
    selectedPromotionSeat,
    selectedPromotionFood,
  ]);

  return (
    <Card bordered={false} className="order-card">
      <Row>
        <Col span={10}>
          <Image
            width={150}
            height={"auto"}
            src={movie?.imageLink}
            fallback={imageError}
            alt="Lỗi tải hình ảnh"
          />
        </Col>
        <Col span={14}>
          <Col span={24}>
            <Typography.Title level={4}>
              {movie?.name === "AxiosError" ? "" : movie?.name}
            </Typography.Title>
          </Col>
          <Col span={24}>
            <Typography.Title level={5}>
              {selectedShowTime?.cinemaName}
            </Typography.Title>
            <Typography.Text>{selectedShowTime?.roomName}</Typography.Text>
          </Col>
          <Col span={24}>
            <Typography.Text>
              {selectedShowTime?.showDate && selectedShowTime?.showTime ? (
                <Row>
                  <p style={{ fontWeight: "700", marginRight: 10 }}>Suất:</p>
                  {selectedShowTime?.showTime}
                  {" - "}
                  {moment(selectedShowTime?.showDate).format("DD-MM-YYYY")}
                </Row>
              ) : (
                ""
              )}
            </Typography.Text>
          </Col>
          <Col span={24}>
            {selectedPromotionSeat && selectedPromotionSeat?.name && (
              <TextPromotion promotion={selectedPromotionSeat} />
            )}
            {selectedPromotionFood && selectedPromotionFood?.name && (
              <TextPromotion promotion={selectedPromotionFood} />
            )}
            {selectedPromotionBill && selectedPromotionBill?.name && (
              <TextPromotion promotion={selectedPromotionBill} />
            )}
          </Col>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 10, marginBottom: 10 }}></Row>
      {selectedSeats && selectedSeats.length > 0 && <div className="line" />}
      <Row>
        {/* // tính tổng tiền cho loại ghế thường nếu có */}
        {selectedSeats?.some(
          (seat) => seat.seatTypeId === findSeatTypeIdByName("STANDARD")
        ) && (
          <Col span={24}>
            <Typography.Title level={5}>
              {
                selectedSeats.filter(
                  (seat) => seat.seatTypeId === findSeatTypeIdByName("STANDARD")
                ).length
              }
              x Ghế thường:{" "}
              <span style={{ color: "#F58020" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  selectedSeats.find(
                    (seat) =>
                      seat.seatTypeId === findSeatTypeIdByName("STANDARD")
                  )?.price + selectedRoom.price || 0
                )}
              </span>
            </Typography.Title>
            {selectedSeats?.map((seat, index) => (
              <Typography.Text key={index}>
                {seat.seatTypeId === findSeatTypeIdByName("STANDARD") &&
                  `${seat.name}, `}
              </Typography.Text>
            ))}
          </Col>
        )}
        {/* // tính tổng tiền cho loại ghế vip nếu có */}
        {selectedSeats?.some(
          (seat) => seat.seatTypeId === findSeatTypeIdByName("VIP")
        ) && (
          <Col span={24}>
            <Typography.Title level={5}>
              {
                selectedSeats.filter(
                  (seat) => seat.seatTypeId === findSeatTypeIdByName("VIP")
                ).length
              }
              x Ghế vip:{" "}
              <span style={{ color: "#F58020" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  selectedSeats?.find(
                    (seat) => seat.seatTypeId === findSeatTypeIdByName("VIP")
                  )?.price + selectedRoom.price || 0
                )}
              </span>
            </Typography.Title>
            {selectedSeats?.map((seat, index) => (
              <Typography.Text key={index}>
                {seat.seatTypeId === findSeatTypeIdByName("VIP") &&
                  `${seat.name}, `}
              </Typography.Text>
            ))}
          </Col>
        )}
        {/* // tính tổng tiền cho loại ghế đôi nếu có */}
        {selectedSeats?.some(
          (seat) => seat.seatTypeId === findSeatTypeIdByName("SWEETBOX")
        ) && (
          <Col span={24}>
            <Typography.Title level={5}>
              {
                selectedSeats.filter(
                  (seat) => seat.seatTypeId === findSeatTypeIdByName("SWEETBOX")
                ).length
              }
              x Ghế đôi:{" "}
              <span style={{ color: "#F58020" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  selectedSeats?.find(
                    (seat) =>
                      seat.seatTypeId === findSeatTypeIdByName("SWEETBOX")
                  )?.price + selectedRoom.price || 0
                )}
              </span>
            </Typography.Title>
            {selectedSeats?.map((seat, index) => (
              <Typography.Text key={index}>
                {seat.seatTypeId === findSeatTypeIdByName("SWEETBOX") &&
                  `${seat.name}, `}
              </Typography.Text>
            ))}
          </Col>
        )}
      </Row>
      {selectedFoods && selectedFoods.length > 0 && <div className="line" />}
      <Row>
        {selectedFoods &&
          selectedFoods.length > 0 &&
          selectedFoods.some((food) => food.quantity > 0) && (
            <Col span={24}>
              <Typography.Title level={5}>Thức ăn: </Typography.Title>
            </Col>
          )}
        {selectedFoods?.map((food, index) => (
          <Col span={24} key={index}>
            <Typography.Text style={{ fontWeight: 400 }}>
              <Row>
                <Col span={12}>
                  {food.name}:{" "}
                  <Typography.Text
                    style={{ color: "#F58020", fontWeight: 700 }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(food.price)}
                  </Typography.Text>
                </Col>
                <Col span={12}>Số lượng: {food.quantity}</Col>
              </Row>
            </Typography.Text>
          </Col>
        ))}
      </Row>
      <div className="line" />
      <Row style={{ justifyContent: "space-between" }}>
        <Typography.Title level={5}>Tổng cộng: </Typography.Title>
        <Typography.Text style={{ color: "#F58020", fontWeight: 700 }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalPrice)}
        </Typography.Text>
      </Row>
    </Card>
  );
};

export default OrderCard;
