import {
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  Row,
  Tag,
  Typography,
  notification,
} from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetMovie } from "../../../redux/movie/movieSlice";
import { callGetMovieById } from "../../../services/apiMovie";
import { imageError } from "../../../utils/imageError";

const { Text } = Typography;

const MovieShow = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.movie.movie);

  // f5 fetch data
  useEffect(() => {
    if (!movie) {
      getMovieById();
    }
  }, [movie]);

  const getMovieById = async () => {
    const res = await callGetMovieById(movieId);
    if (res) {
      dispatch(doSetMovie(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  const item = [
    { label: "Mã phim", children: movie?.code },
    {
      label: "Tên phim",
      children: movie?.name,
    },
    {
      label: "Ngày sản xuất",
      children: moment(movie?.releaseDate).format("DD-MM-YYYY"),
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={movie?.status ? "success" : "error"}>
          {movie?.status ? "Được chiếu" : "Ngưng chiếu"}
        </Tag>
      ),
    },
    {
      label: "Thể loại",
      children: movie?.genres.map((genre) => (
        <Tag key={genre.id} color="blue">
          {genre.name}
        </Tag>
      )),
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Thời lượng (Phút)",
      children: movie?.durationMinutes,
      span: {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
      },
    },
    {
      label: "Quốc gia sản xuất phim",
      children: movie?.country,
      span: {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
      },
    },
    {
      label: "Đạo diễn",
      children: movie?.director,
    },
    {
      label: "Diễn viên",
      children: movie?.cast,
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
      children: (
        <Image
          width={200}
          height={"auto"}
          src={movie?.imageLink}
          fallback={imageError}
          alt="Lỗi tải hình ảnh"
        />
      ),
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Trailer",
      children: (
        // target = "_blank" to open a new tab
        <Link to={movie?.trailerLink} target="_blank">
          {movie?.name}
        </Link>
      ),
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
