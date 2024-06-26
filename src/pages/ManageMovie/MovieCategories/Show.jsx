import { Card, Col, Descriptions, Divider, Row, notification } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetMovieGenre } from "../../../redux/movie/movieGenreSlice";
import { callGetGenreMovieById } from "../../../services/apiMovie";
import { FORMAT_DATE_HH_MM_SS } from "../../../utils/constant";

const MovieGenreShow = () => {
  const { categoryMovieId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;
  const checked = userRoles?.some((role) => role === "ROLE_ADMIN");

  // thay đổi #1
  const movieGenre = useSelector((state) => state.movieGenre.movieGenre);

  // f5 fetch data
  useEffect(() => {
    if (!movieGenre) {
      getMovieGenreById();
    }
  }, [movieGenre]);

  const getMovieGenreById = async () => {
    const res = await callGetGenreMovieById(categoryMovieId);
    if (res) {
      dispatch(doSetMovieGenre(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  const item = [
    { label: "Mã loại phim", children: movieGenre?.code },
    {
      label: "Tên loại phim",
      children: movieGenre?.name,
    },
    {
      label: "Ngày cập nhật",
      children: moment(movieGenre?.createdDate).format(FORMAT_DATE_HH_MM_SS),
    },
  ];

  return (
    <>
      <PageHeader
        title="Xem chi tiết loại phim"
        numberBack={-1}
        type="show"
        hiddenEdit={!checked}
      />
      <Divider />
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
    </>
  );
};

export default MovieGenreShow;
