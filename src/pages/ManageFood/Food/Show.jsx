import { Card, Col, Descriptions, Divider, Row, Tag, Typography } from "antd";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader/PageHeader";

const { Text } = Typography;

const FoodShow = () => {
  // thay đổi #1
  const food = useSelector((state) => state.food.food);

  const item = [
    { label: "Mã đồ ăn", children: food?.code },
    {
      label: "Tên đồ ăn",
      children: food?.foodName,
    },
    {
      label: "Giá",
      children: (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(food?.price ?? 0)}
        </span>
      ),
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={food?.status === "available" ? "success" : "error"}>
          {food?.status === "available" ? "Có sẵn" : "Hết hàng"}
        </Tag>
      ),
    },
    {
      label: "Loại đồ ăn",
      children: food?.category,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Size",
      children: food?.size,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Hình ảnh",
      children: food?.image,
      span: {
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
      },
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết đồ ăn" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin đồ ăn" bordered={false}>
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

export default FoodShow;
