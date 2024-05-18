import {
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  Row,
  Table,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  renderCurrency,
  renderCurrencyOrderShow,
  renderSeatType,
} from "../../components/FunctionRender/FunctionRender";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callGetDetailOrder } from "../../services/apiOder";
import { FORMAT_DATE } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";
import { imageError } from "../../utils/imageError";

const filterSeatType = [
  {
    text: "Ghế vip",
    value: "VIP",
  },
  {
    text: "Ghế đôi",
    value: "SWEETBOX",
  },
  {
    text: "Ghế thường",
    value: "STANDARD",
  },
];

const OrderShow = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState({});

  useEffect(() => {
    getOderDetailById(orderId);
  }, [orderId]);

  const getOderDetailById = async (id) => {
    const res = await callGetDetailOrder(id);
    console.log("res data order detail: ", res);
    if (res) {
      setOrder(res);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  const columnsFood = [
    createColumn("Tên đồ ăn", "foodName", 100, false, undefined, "left"),
    createColumn("Giá", "price", 150, false, renderCurrencyOrderShow),
    createColumn("Số lượng", "quantity", 100),
  ];
  const columnsTicket = [
    createColumn("Mã vé", "ticketCode", 100),
    createColumn(
      "Loại ghế",
      "seatType",
      100,
      false,
      renderSeatType,
      "left",
      filterSeatType,
      (value, record) => record.seatType.indexOf(value) === 0
    ),
    createColumn("Ghế", "seatName", 100, false, undefined, "left"),
    createColumn("Giá", "price", 150, false, renderCurrency),
    createColumn("Số lượng", "quantity", 100),
  ];

  const itemCinema = [
    { label: "Tên rạp", children: order?.cinemaDto?.name },
    { label: "Tên phòng", children: order?.roomDto?.name },
    { label: "Loại phòng", children: order?.roomDto?.type },
    {
      label: "Địa chỉ",
      children: `${order?.cinemaDto?.address?.street}, ${order?.cinemaDto?.address?.ward}, ${order?.cinemaDto?.address?.district}, ${order?.cinemaDto?.address?.city}.`,
    },
  ];

  const itemMovie = [
    {
      label: "Tên phim",
      children: order?.movieDto?.name,
    },
    {
      label: "Lịch chiếu",
      children: `${moment(order?.showTimeDto?.showTime, "HH:mm:ss").format(
        "HH:mm"
      )} ${moment(order?.showTimeDto?.showDate).format(FORMAT_DATE)}`,
    },
  ];

  const itemUser = [
    { label: "Họ tên", children: order?.userDto?.username },
    { label: "Email", children: order?.userDto?.email },
    {
      label: "Số điện thoại",
      children: order?.userDto?.phone || "Chưa có thông tin",
    },
  ];

  return (
    <>
      <PageHeader
        title="Xem chi tiết hóa đơn"
        numberBack={-1}
        type="show"
        hiddenEdit={true}
      />
      <Divider />
      <Card title="Thông tin chi tiết hóa đơn" bordered={false}>
        <Row gutter={[16]}>
          <Col span={5}>
            <Image
              width={"100%"}
              height={"auto"}
              src={order?.movieDto?.imageLink}
              fallback={imageError}
              alt="Lỗi tải hình ảnh"
            />
          </Col>
          <Col span={19}>
            <Row gutter={[15, 15]}>
              <Descriptions
                labelStyle={{ color: "#333", fontWeight: "700" }}
                layout="vertical"
                bordered
                size="small"
                column={{
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                items={itemUser}
                style={{ width: "100%" }}
              />
              <Descriptions
                labelStyle={{ color: "#333", fontWeight: "700" }}
                layout="vertical"
                bordered
                size="small"
                column={{
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                items={itemCinema}
                style={{ width: "100%" }}
              />
              <Descriptions
                labelStyle={{ color: "#333", fontWeight: "700" }}
                layout="vertical"
                bordered
                size="small"
                column={{
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                items={itemMovie}
                style={{ width: "100%" }}
              />
            </Row>
          </Col>
        </Row>
      </Card>
      <Row
        gutter={[16]}
        style={{
          marginTop: 16,
        }}
      >
        <Col span={12}>
          <Table
            bordered
            title={() => (
              <span style={{ fontWeight: 700 }}>Danh sách đồ ăn</span>
            )}
            columns={columnsFood}
            dataSource={order?.invoiceFoodDetailDtos}
            rowKey="id"
            pagination={false}
          />
        </Col>
        <Col span={12}>
          <Table
            bordered
            title={() => <span style={{ fontWeight: 700 }}>Danh sách vé</span>}
            columns={columnsTicket}
            dataSource={order?.invoiceTicketDetailDtos}
            rowKey="id"
            pagination={false}
          />
        </Col>
      </Row>
    </>
  );
};

export default OrderShow;
