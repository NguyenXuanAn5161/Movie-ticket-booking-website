import { Card, Col, Descriptions, Divider, Row, Tag, Typography } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader/PageHeader";

const { Text } = Typography;

const ScheduleShow = () => {
  // thay đổi #1
  const schedule = useSelector((state) => state.schedule.schedule);

  const item = [
    {
      label: "Tên phim",
      children: schedule?.movieName,
    },
    {
      label: "Rạp chiếu",
      children: schedule?.cinema_id,
    },
    {
      label: "Phòng chiếu",
      children: schedule?.room_id,
    },
    {
      label: "Ngày chiếu",
      children: schedule?.show_date
        ? moment(schedule.show_date).format("DD-MM-YYYY")
        : null,
    },
    {
      label: "Giờ chiếu",
      children: schedule?.startTime,
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={schedule?.status ? "success" : "error"}>
          {schedule?.status ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết phim" numberBack={-1} type="show" />
      <Divider />
      <Card title="Thông tin phim" bordered={false}>
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
    </>
  );
};

export default ScheduleShow;
