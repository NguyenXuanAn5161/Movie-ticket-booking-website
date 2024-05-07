import { Card, Col, Divider, Row, Table, notification } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  renderCurrency,
  renderSeatType,
} from "../../components/FunctionRender/FunctionRender";
import Content from "../../components/OrderCard/Content";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callGetDetailOrder } from "../../services/apiOder";
import { createColumn } from "../../utils/createColumn";

const gridStyle = {
  width: "33%",
};

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

const ReturnInvoiceShow = () => {
  const { returnInvoiceId } = useParams();

  const [order, setOrder] = useState({});

  useEffect(() => {
    console.log("returnInvoiceId: ", returnInvoiceId);
    getReturnOderDetailById(returnInvoiceId);
  }, [returnInvoiceId]);

  const getReturnOderDetailById = async (id) => {
    const res = await callGetDetailOrder(id);
    console.log("res data returnInvoice order detail: ", res);
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
    createColumn("Giá", "price", 150, false, renderCurrency),
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

  return (
    <>
      <PageHeader
        title="Xem chi tiết hóa đơn trả"
        numberBack={-1}
        type="show"
      />
      <Divider />
      <div style={{ padding: "0 20px" }}>
        <Card title="Thông tin chi tiết hóa đơn trả" bordered={false}>
          <Card.Grid style={gridStyle}>
            <Content item={order} />
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <Content type={"user"} item={order} />
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <Content type={"cinemaRoom"} item={order} />
          </Card.Grid>
        </Card>
      </div>
      <Row
        gutter={[16]}
        style={{
          padding: "0 20px",
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

export default ReturnInvoiceShow;
