import { Card, Col, Image, Row, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callGetMovieById } from "../../services/apiMovie";
import { imageError } from "../../utils/imageError";
import "./styles.scss";

const OrderCard = (props) => {
  const { cinema, price, totalPrice, setTotalPrice } = props;

  const dispatch = useDispatch();
  const selectedMovie = useSelector((state) => state.booking.selectedMovie);
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const selectedFoodItems = useSelector(
    (state) => state.booking.selectedFoodItems
  );

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (selectedMovie) {
      fetchMovie(selectedMovie.value);
    }
  }, [selectedMovie]);

  const fetchMovie = async (id) => {
    try {
      const res = await callGetMovieById(id);
      console.log("res", res);
      if (res) {
        setMovie(res);
      }
    } catch (error) {
      console.log("Error fetching movie:", error);
    }
  };

  useEffect(() => {
    if (selectedSeats || selectedFoodItems) {
      calculateTotalPrice();
    }
  }, [selectedSeats, selectedFoodItems]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    // Tính tổng tiền cho các ghế ngồi
    selectedSeats.forEach((seat) => {
      const seatPrice = price.find((p) => p.id === seat.seatTypeId)?.price || 0;
      totalPrice += seatPrice;
    });

    // Tính tổng tiền cho các món đồ ăn
    selectedFoodItems.forEach((food) => {
      totalPrice += food.price * food.quantity;
    });

    setTotalPrice(totalPrice);
  };

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
            <Typography.Title level={5}>{cinema?.label}</Typography.Title>
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
                }).format(price.find((p) => p.id === 1)?.price || 0)}
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
                }).format(price.find((p) => p.id === 3)?.price || 0)}
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
                }).format(price.find((p) => p.id === 2)?.price || 0)}
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
