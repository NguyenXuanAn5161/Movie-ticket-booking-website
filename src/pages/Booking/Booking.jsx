import { Button, Col, Form, Row, Steps, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/OrderCard/OrderCard";
import { callFetchListTypeSeat } from "../../services/apiMovie";
import BookingFood from "./Steps/BookingFood";
import BookingPayment from "./Steps/BookingPayment";
import BookingSchedule from "./Steps/BookingSchedule";
import BookingSeat from "./Steps/BookingSeat";

const order = {
  movieName: "Monkey Man Báo Thù",
  time: "10:30 – Thứ Sáu, 05/04/2024",
  seat: "E3",
  total: 75.0,
};

const BookingPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [listData, setListData] = useState([]);
  const [movies, setMovies] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [cinema, setCinema] = useState(null);
  const [showTime, setShowTime] = useState([]);
  const [oneShowTime, setOneShowTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);
  const [price, setPrice] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // fetch giá
  useEffect(() => {
    fetchPriceTypeSeat();
  }, []);

  const fetchPriceTypeSeat = async () => {
    const res = await callFetchListTypeSeat();
    if (res) {
      setPrice(res);
    }
  };

  useEffect(() => {
    console.log("selectedFoodItems", selectedFoodItems);
  }, [selectedFoodItems]);

  const steps = [
    {
      title: "Chọn rạp / Phim / Suất",
      formComponent: (
        <BookingSchedule
          form={form}
          schedules={schedules}
          cinema={cinema}
          movies={movies}
          setMovies={setMovies}
          setCinema={setCinema}
          showTime={showTime}
          setShowTime={setShowTime}
          current={current}
          setCurrent={setCurrent}
          setOneShowTime={setOneShowTime}
        />
      ),
    },
    {
      title: "Chọn ghế",
      formComponent: (
        <BookingSeat
          form={form}
          oneShowTime={oneShowTime}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
        />
      ),
    },
    {
      title: "Chọn thức ăn",
      formComponent: (
        <BookingFood form={form} setSelectedFoodItems={setSelectedFoodItems} />
      ),
    },
    {
      title: "Thanh toán",
      formComponent: <BookingPayment form={form} />,
    },
  ];

  const onFinish = async (values) => {
    message.success("Đặt vé thành công!");
    setCurrent(0);
    form.resetFields();
  };

  const next = () => setCurrent(current + 1);

  const prev = () => setCurrent(current - 1);

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Row gutter={16}>
        <Col span={15}>
          <Steps current={current} items={items} />
          <div style={{ marginTop: 24, textAlign: "center" }}>
            {steps[current].formComponent}
          </div>
        </Col>
        <Col span={9} style={{ marginTop: 57 }}>
          <OrderCard
            order={order}
            movies={movies}
            oneShowTime={oneShowTime}
            cinema={cinema}
            selectedSeats={selectedSeats}
            price={price}
            totalPrice={totalPrice}
            setTotalPrice={setTotalPrice}
            selectedFoodItems={selectedFoodItems}
          />
          <div style={{ marginTop: 24, textAlign: "right" }}>
            {current > 0 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={prev}>
                Quay lại
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Tiếp tục
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={onFinish}>
                Hoàn thành
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default BookingPage;
