import { Card, Col, Descriptions, Divider, Row } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader/PageHeader";

const MovieGenreShow = () => {
  // thay đổi #1
  const movieGenre = useSelector((state) => state.movieGenre.movieGenre);

  const item = [
    { label: "Mã loại phim", children: movieGenre?.code },
    {
      label: "Tên loại phim",
      children: movieGenre?.nameGenre,
    },
    {
      label: "Ngày cập nhật",
      children: moment(movieGenre?.updated_At).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết loại phim" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin loại phim" bordered={false}>
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

export default MovieGenreShow;
