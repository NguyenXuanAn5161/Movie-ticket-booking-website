import { Card, Col, Descriptions, Divider, Row, Tag, Typography } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader/PageHeader";

const { Text } = Typography;

const MovieShow = () => {
  // thay đổi #1
  const movie = useSelector((state) => state.movie.movie);

  const item = [
    { label: "Mã phim", children: movie?.code },
    {
      label: "Tên phim",
      children: movie?.movieName,
    },
    {
      label: "Ngày chiếu",
      children: moment(movie?.releaseDate).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      label: "Trạng thái",
      children: (
        <Tag
          color={
            movie?.status === "Đang chiếu"
              ? "success"
              : movie?.status === "Sắp chiếu"
              ? "default"
              : "error"
          }
        >
          {movie?.status}
        </Tag>
      ),
    },
    { label: "Thể loại", children: movie?.genre?.genreName },
    {
      label: "Thời lượng (Phút)",
      children: movie?.durationInMins,
    },
    {
      label: "Ngôn ngữ của phim",
      children: movie?.language,
    },
    {
      label: "Quốc gia sản xuất phim",
      children: movie?.country,
    },
    {
      label: "Đạo diễn",
      children: movie?.director,
    },
    {
      label: "Diễn viên",
      children: movie?.performer,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Nhà sản xuất",
      children: movie?.producer,
    },
    {
      label: "Mô tả",
      children: movie?.description,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
      },
    },
    {
      label: "Hình ảnh",
      children: movie?.image,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Trailer",
      children: movie?.trailer,
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
      <PageHeader title="Xem chi tiết phim" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
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
      {/* </div> */}
    </>
  );
};

export default MovieShow;
