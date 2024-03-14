import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Seat from "../../../components/Seat/Seat";
import SeatLegend from "../../../components/Seat/SeatLegend";
import { callCreateUser } from "../../../services/api";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const RoomCreate = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [totalSeats, setTotalSeats] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      message.success("Tạo mới phòng chiếu thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/admin/cinema/room");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };

  const handleTotalSeatChange = (value) => {
    setTotalSeats(value);
    setSelectedSeats(Array.from({ length: value }, () => false));
  };

  const handleSeatClick = (index) => {
    const newSelectedSeats = [...selectedSeats];
    newSelectedSeats[index] = !newSelectedSeats[index];
    setSelectedSeats(newSelectedSeats);

    // Tính toán seatRow và seatColumn từ index
    const seatRow = Math.floor(index / 15) + 1;
    const seatColumn = (index % 15) + 1;

    console.log("seatRow:", seatRow);
    console.log("seatColumn:", seatColumn);
  };

  return (
    <>
      <PageHeader title="Tạo mới phòng chiếu" numberBack={-1} type="create" />
      <Divider />
      <Card title="Tạo mới phòng chiếu" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[20]}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên phòng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên phòng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên phòng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Loại phòng"
                name="typeRoom"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại phòng!",
                  },
                ]}
              >
                <Select style={{ width: "100%" }} defaultValue={"2D"}>
                  <Select.Option value="2D">2D</Select.Option>
                  <Select.Option value="3D">3D</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tổng số ghế"
                name="totalSeat"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tổng số ghế!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng số ghế"
                  min={120}
                  max={390}
                  addonAfter={"Ghế"}
                  onChange={handleTotalSeatChange}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <SeatLegend color="#818181" text="Ghế chưa được chọn" />
                  <SeatLegend color="#FF0066" text="Ghế được chọn" />
                  <SeatLegend color="#6959CD" text="Ghế thường" />
                  <SeatLegend color="#FF8247" text="Ghế vip" />
                  <SeatLegend color="#FF1493" text="Ghế đôi" />
                </div>
                <h4
                  style={{
                    textAlign: "center",
                    margin: "30px 0",
                  }}
                >
                  Danh sách ghế trong phòng chiếu
                </h4>
                <div
                  style={{
                    backgroundColor: "#000000",
                    width: "70%",
                    margin: "0 auto",
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 30,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  Màn hình
                </div>
              </div>
              {Array(Math.ceil(390 / 15))
                .fill(null)
                .map((_, seatRow) => (
                  <Row
                    key={seatRow}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      userSelect: "none",
                    }}
                  >
                    {Array(15)
                      .fill(null)
                      .map((_, seatColumn) => {
                        const seatNumber = seatRow * 15 + seatColumn + 1;
                        return (
                          <Seat
                            key={`${seatRow}-${seatColumn}`}
                            seatRow={alphabet[seatRow]}
                            seatColumn={seatColumn + 1}
                            selected={selectedSeats[seatRow * 15 + seatColumn]}
                            onClick={() =>
                              handleSeatClick(seatRow * 15 + seatColumn)
                            }
                          />
                        );
                      })}
                  </Row>
                ))}
            </Col>
          </Row>
          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default RoomCreate;
