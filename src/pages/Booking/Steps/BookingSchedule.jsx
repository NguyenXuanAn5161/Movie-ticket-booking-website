import { Card, Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import MovieShowTimes from "../../../components/MovieShowTimeComponent/MovieShowTimeComponent";
import { callFetchListCinema } from "../../../services/apiCinema";
import { callFetchListMovie } from "../../../services/apiMovie";
import { callFetchListShowtime } from "../../../services/apiShowTime";

const BookingSchedule = (props) => {
  const {
    form,
    data,
    movies,
    setMovies,
    cinema,
    setCinema,
    setSchedules,
    showTime,
    setShowTime,
    current,
    setCurrent,
    setOneShowTime,
  } = props;

  const dispatch = useDispatch();
  const selectedMovie = useSelector((state) => state.booking.selectedMovie);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cinema) {
      fetchMovieList();
    }
  }, [cinema]);

  // tìm phim theo rạp
  const fetchMovieList = async (movieName) => {
    let query = `size=5&cinemaId=${cinema.value}`;
    // let query = `size=5&`;

    if (movieName) {
      query += `&name=${movieName}`;
    }

    try {
      const res = await callFetchListMovie(query);
      const movie = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      // dispatch(doSetSelectedMovie(movie));

      return movie;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching movies:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  useEffect(() => {
    console.log("showTime", showTime);
  }, [showTime]);
  useEffect(() => {
    console.log("cinema", cinema);
  }, [cinema]);
  useEffect(() => {
    console.log("movies", movies);
  }, [movies]);

  useEffect(() => {
    if (cinema && movies) {
      fetchShowTime();
    }
  }, [cinema, movies]);

  // khi thay doi current va pageSize thi search died!
  // mặc định #2
  const fetchShowTime = async () => {
    setIsLoading(true);
    let query = `size=100`;

    query += `&cinemaId=${cinema.value}&movieId=${movies.value}`;

    // thay đổi #1 api call
    const res = await callFetchListShowtime(query);
    if (res?.content) {
      setShowTime(res.content);
    }

    setIsLoading(false);
  };

  const handleShowTimeSelection = (selectedShowTime) => {
    // Cập nhật showTime
    setOneShowTime(selectedShowTime);
    // Chuyển đến bước tiếp theo
    setCurrent(current + 1);
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Card>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn rạp"
                name="cinemaId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn rạp!",
                  },
                ]}
              >
                <DebounceSelect
                  style={{ textAlign: "start" }}
                  value={cinema}
                  onChange={(newValue) => {
                    setCinema(newValue);
                  }}
                  placeholder="Chọn rạp"
                  fetchOptions={fetchCinemaList}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Chọn phim"
                name="movieName"
                rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
              >
                <DebounceSelect
                  style={{ textAlign: "start" }}
                  value={movies}
                  onChange={(newValue) => {
                    setMovies(newValue);
                  }}
                  placeholder="Chọn phim"
                  fetchOptions={fetchMovieList}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Row>
          <MovieShowTimes
            showTime={showTime}
            cinemaName={cinema?.label}
            handleShowTimeSelection={handleShowTimeSelection}
          />
        </Row>
      </Form>
    </>
  );
};

export default BookingSchedule;

// Hàm fetch danh sách cinema
async function fetchCinemaList(cinemaName) {
  try {
    let query = `size=5&name=${cinemaName}`;
    const res = await callFetchListCinema(query);
    const food = res.content.map((data) => ({
      label: data.name,
      value: data.id,
    }));

    return food;
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
    console.error("Error fetching movies:", error);
    // Trả về một mảng trống nếu xảy ra lỗi
    return [];
  }
}
