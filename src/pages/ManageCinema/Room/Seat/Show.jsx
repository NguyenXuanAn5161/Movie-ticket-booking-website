import { Card, Col, Descriptions, Divider, Row, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import PageHeader from "../../../../components/PageHeader/PageHeader";

const { Text } = Typography;

const SeatShow = () => {
  // thay đổi #1
  const seat = useSelector((state) => state.seat.seat);

  const item = [
    {
      label: "Hàng ghế",
      children: seat?.seatRow,
    },
    {
      label: "Cột ghế",
      children: seat?.seatColumn,
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={seat?.isBooked ? "success" : "error"}>
          {seat?.isBooked ? "Đã đặt" : "Chưa đặt"}
        </Tag>
      ),
    },
    {
      label: "Loại ghế",
      children: seat?.type_seat.name,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Ghế thuộc phòng",
      children: seat?.room_id,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết ghế" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin ghế" bordered={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Descriptions
              labelStyle={{ color: "#333", fontWeight: "700" }}
              layout="vertical"
              bordered
              size="small"
              column={{
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              items={item}
            />
          </Col>
        </Row>
      </Card>
      {/* </div> */}
    </>
  );
};

export default SeatShow;
