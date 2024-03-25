import { Button, Card, Col, Form, Steps, message, notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingFood from "./Steps/BookingFood";
import BookingPayment from "./Steps/BookingPayment";
import BookingSchedule from "./Steps/BookingSchedule";
import BookingSeat from "./Steps/BookingSeat";

const BookingPage = () => {
  const data = [
    {
      cinemaId: 1,
      cinemaName: "Rạp 1",
      roomId: 101,
      roomName: "Phòng chiếu 1",
      movieId: 101,
      movieName: "Phim 1",
      showDate: "2024-03-20",
      startTime: "09:00",
    },
    {
      cinemaId: 2,
      cinemaName: "Rạp 2",
      roomId: 102,
      roomName: "Phòng chiếu 2",
      movieId: 102,
      movieName: "Phim 2",
      showDate: "2024-03-20",
      startTime: "12:00",
    },
    {
      cinemaId: 3,
      cinemaName: "Rạp 3",
      roomId: 103,
      roomName: "Phòng chiếu 3",
      movieId: 103,
      movieName: "Phim 3",
      showDate: "2024-03-21",
      startTime: "15:00",
    },
  ];

  // mặc định #2
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [current, setCurrent] = useState(0);
  const [listData, setListData] = useState(data);

  const steps = [
    {
      title: "Chọn rạp / Phim / Suất",
      formComponent: <BookingSchedule form={form} data={data} />,
    },
    {
      title: "Chọn ghế",
      formComponent: <BookingSeat form={form} />,
    },
    {
      title: "Chọn thức ăn",
      formComponent: <BookingFood form={form} />,
    },
    {
      title: "Thanh toán",
      formComponent: <BookingPayment form={form} />,
    },
  ];

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    // const res = await callCreateUser(fullName, email, password, phone);
    // if (res && res.data) {
    if (true) {
      message.success("Đặt vé thành công!");
      // form.resetFields();
      setIsSubmit(false);
      // navigate("/admin/price");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };

  const next = () => {
    setCurrent(current + 1);

    // form
    //   .validateFields()
    //   .then((values) => {
    //     setCurrent(current + 1);
    //     // Update formData
    //     setFormData({ ...formData, ...values });
    //   })
    //   .catch((error) => {
    //     notification.error({
    //       message: "Có lỗi xảy ra!",
    //       description: "Vui lòng nhập đầy đủ thông tin",
    //     });
    //   });
  };

  const prev = () => setCurrent(current - 1);

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Card title="Đặt vé" bordered={false}>
        <Col span={16}>
          <Steps current={current} items={items} />
          <div style={{ marginTop: 24, textAlign: "center" }}>
            {steps[current].formComponent}
          </div>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {current > 0 && (
              <Button
                type="primary"
                style={{
                  margin: "0 8px",
                }}
                onClick={() => prev()}
              >
                Quay lại
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Tiếp tục
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Hoàn thành
              </Button>
            )}
          </div>
        </Col>
      </Card>
    </>
  );
};

export default BookingPage;
