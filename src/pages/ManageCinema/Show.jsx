import { Card, Col, Descriptions, Divider, Row, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";

const { Text } = Typography;

const CinemaShow = () => {
  // thay đổi #1
  const cinema = useSelector((state) => state.cinema.cinema);

  const item = [
    { label: "Mã rạp phim", children: cinema?.code },
    {
      label: "Tên rạp phim",
      children: cinema?.name,
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={cinema?.status === "available" ? "success" : "error"}>
          {cinema?.status === "available" ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      label: "Tổng số phòng",
      children: cinema?.totalRoom,
    },
    {
      label: "Địa chỉ",
      children: (
        <span>
          {cinema.address.streetAddress}, {cinema.address.district},{" "}
          {cinema.address.city}, {cinema.address.nation}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết rạp phim" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin rạp phim" bordered={false}>
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

export default CinemaShow;
