import { Card, Col, Descriptions, Divider, Row, Typography } from "antd";
import { useSelector } from "react-redux";
import PageHeader from "../../../../components/PageHeader/PageHeader";

const { Text } = Typography;

const SeatTypeShow = () => {
  // thay đổi #1
  const seatType = useSelector((state) => state.seatType.seatType);

  const item = [
    {
      label: "Tên loại ghế",
      children: seatType?.name,
    },
    {
      label: "Giá",
      children: (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(seatType?.price ?? 0)}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết loại ghế" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin loại ghế" bordered={false}>
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
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 4,
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

export default SeatTypeShow;
