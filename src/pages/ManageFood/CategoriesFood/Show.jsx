import { Card, Col, Descriptions, Divider, Row } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader/PageHeader";

const FoodCategoryShow = () => {
  // thay đổi #1
  const foodCategory = useSelector((state) => state.foodCategory.foodCategory);

  const item = [
    { label: "Mã loại đồ ăn", children: foodCategory?.code },
    {
      label: "Tên loại đồ ăn",
      children: foodCategory?.categoryName,
    },
    {
      label: "Ngày cập nhật",
      children: moment(foodCategory?.updated_At).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết loại đồ ăn" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin loại đồ ăn" bordered={false}>
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
                md: 2,
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

export default FoodCategoryShow;
