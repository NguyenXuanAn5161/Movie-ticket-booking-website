import { Card, Col, Descriptions, Divider, Row, Tag } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader/PageHeader";

const ScheduleShow = () => {
  // thay đổi #1
  const schedule = useSelector((state) => state.schedule.schedule);

  useEffect(() => {
    console.log("schedule", schedule);
  }, [schedule]);

  const item = [
    {
      label: "Tên phim",
      children: schedule?.movieName,
    },
    {
      label: "Rạp chiếu",
      children: schedule?.cinemaName,
    },
    {
      label: "Phòng chiếu",
      children: schedule?.roomName,
    },
    {
      label: "Ngày chiếu",
      children: schedule?.showDate
        ? moment(schedule.showDate).format("DD-MM-YYYY")
        : null,
    },
    {
      label: "Giờ chiếu",
      children: schedule?.showTime,
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
      <PageHeader
        title="Xem chi tiết lịch chiếu phim"
        numberBack={-1}
        type="show"
      />
      <Divider />
      <Card title="Thông tin lịch chiếu phim" bordered={false}>
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
