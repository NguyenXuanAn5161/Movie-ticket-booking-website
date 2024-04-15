import { Card, Col, Image, Row, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doSetSelectedRoom } from "../../redux/booking/bookingSlice";
import { callGetMovieById } from "../../services/apiMovie";
import { callFetchRoomById } from "../../services/apiRoom";
import { imageError } from "../../utils/imageError";
import "./styles.scss";

const OrderCard = (props) => {
  const { price, totalPrice, setTotalPrice } = props;
  const [roomPrice, setRoomPrice] = useState(0);
  const [movie, setMovie] = useState(null);

  const dispatch = useDispatch();
  const selectedMovie = useSelector((state) => state.booking.selectedMovie);
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const selectedFoodItems = useSelector(
    (state) => state.booking.selectedFoodItems
  );
  const selectedPromotion = useSelector(
    (state) => state.booking.selectedPromotion
  );

  // lấy giá phòng
  useEffect(() => {
    if (selectedShowTime) {
      fetchRoomById(selectedShowTime.roomId);
    }
  }, [selectedShowTime]);

  const fetchRoomById = async (id) => {
    try {
      const res = await callFetchRoomById(id);
      if (res?.data) {
        setRoomPrice(res.data.price);
        dispatch(doSetSelectedRoom(res.data));
      }
    } catch (error) {
      console.log("Error fetching room:", error);
    }
  };

  useEffect(() => {
    if (selectedMovie) {
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

  useEffect(() => {
    if (selectedSeats || selectedFoodItems || selectedPromotion) {
      calculateTotalPrice();
    }
  }, [selectedSeats, selectedFoodItems, selectedPromotion]);

  const calculateTotalPrice = () => {
    let newTotalPrice = 0;

    // Tính tổng tiền cho các ghế ngồi
    selectedSeats.forEach((seat) => {
      const seatPrice = price.find((p) => p.id === seat.seatTypeId)?.price || 0;
      newTotalPrice += seatPrice + roomPrice;
    });

    // Tính tổng tiền cho các món đồ ăn
    selectedFoodItems.forEach((food) => {
      newTotalPrice += food.price * food.quantity;
    });

    // Áp dụng khuyến mãi nếu có
    if (selectedPromotion !== null) {
      if (
        selectedPromotion.typePromotion === "DISCOUNT" &&
        selectedPromotion.promotionDiscountDetailDto.typeDiscount === "PERCENT"
      ) {
        const discountValue =
          selectedPromotion.promotionDiscountDetailDto.discountValue;
        const maxValue = selectedPromotion.promotionDiscountDetailDto.maxValue;
        const discountedPrice = newTotalPrice * (1 - discountValue / 100);

        // Kiểm tra nếu giá giảm đã bằng hoặc vượt quá maxValue thì giữ nguyên giá trị tổng giá
        const finalPrice =
          discountedPrice <= maxValue
            ? discountedPrice
            : newTotalPrice - maxValue;

        newTotalPrice = finalPrice;
      }
    }

    // Cập nhật tổng giá mới
    setTotalPrice(newTotalPrice);
  };

  // const calculateTotalPrice = () => {
  //   let newTotalPrice = 0;

  //   // Tính tổng giá cho ghế ngồi
  //   selectedSeats.forEach((seat) => {
  //     const seatPrice = price.find((p) => p.id === seat.seatTypeId)?.price || 0;
  //     newTotalPrice += seatPrice + roomPrice;
  //   });

  //   // Tính tổng giá cho thức ăn
  //   selectedFoodItems.forEach((food) => {
  //     newTotalPrice += food.price * food.quantity;
  //   });

  //   // Áp dụng khuyến mãi nếu có
  //   applyPromotion(newTotalPrice);
  // };

  // const applyPromotion = (subtotal) => {
  //   if (selectedPromotion !== null) {
  //     // Xử lý logic áp dụng khuyến mãi tại đây
  //   } else {
  //     // Nếu không có khuyến mãi, chỉ cập nhật tổng giá mới
  //     setTotalPrice(subtotal);
  //   }
  // };

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
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 10, marginBottom: 10 }}></Row>
      {selectedSeats && selectedSeats.length > 0 && <div className="line" />}
      <Row>
        {/* tính tổng tiền cho loại ghế đôi nếu có */}
        {selectedSeats?.some((seat) => seat.seatTypeId === 1) && (
          <Col span={24}>
            <Typography.Title level={5}>
              Ghế đôi:{" "}
              <span style={{ color: "#F58020" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  price.find((p) => p.id === 1)?.price + roomPrice || 0
                )}
              </span>
            </Typography.Title>
            {selectedSeats?.map((seat, index) => (
              <Typography.Text key={index}>
                {seat.seatTypeId === 1 && `${seat.name}, `}
              </Typography.Text>
            ))}
          </Col>
        )}
        {/* tính tổng tiền cho loại ghế thường nếu có */}
        {selectedSeats?.some((seat) => seat.seatTypeId === 3) && (
          <Col span={24}>
            <Typography.Title level={5}>
              Ghế thường:{" "}
              <span style={{ color: "#F58020" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  price.find((p) => p.id === 3)?.price + roomPrice || 0
                )}
              </span>
            </Typography.Title>
            {selectedSeats?.map((seat, index) => (
              <Typography.Text key={index}>
                {seat.seatTypeId === 3 && `${seat.name}, `}
              </Typography.Text>
            ))}
          </Col>
        )}
        {/* tính tổng tiền cho loại ghế đôi nếu có */}
        {selectedSeats?.some((seat) => seat.seatTypeId === 2) && (
          <Col span={24}>
            <Typography.Title level={5}>
              Ghế vip:{" "}
              <span style={{ color: "#F58020" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  price.find((p) => p.id === 2)?.price + roomPrice || 0
                )}
              </span>
            </Typography.Title>
            {selectedSeats?.map((seat, index) => (
              <Typography.Text key={index}>
                {seat.seatTypeId === 2 && `${seat.name}, `}
              </Typography.Text>
            ))}
          </Col>
        )}
      </Row>
      {selectedFoodItems && selectedFoodItems.length > 0 && (
        <div className="line" />
      )}
      <Row>
        {selectedFoodItems &&
          selectedFoodItems.length > 0 &&
          selectedFoodItems.some((food) => food.quantity > 0) && (
            <Col span={24}>
              <Typography.Title level={5}>Thức ăn: </Typography.Title>
            </Col>
          )}
        {selectedFoodItems?.map((food, index) => (
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
