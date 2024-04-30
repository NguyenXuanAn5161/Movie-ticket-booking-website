import { Card, Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarBooking from "../../../components/Booking/CalenderBooking";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import {
  doSetSelectedCinema,
  doSetSelectedMovie,
  doSetShowDateByMovieId,
} from "../../../redux/booking/bookingSlice";
import { callFetchListCinema } from "../../../services/apiCinema";
import {
  callFetchListMovie,
  callGetShowDateByMovieId,
} from "../../../services/apiMovie";

const BookingSchedule = (props) => {
  const { form } = props;

  const dispatch = useDispatch();
  const selectedMovie = useSelector((state) => state.booking.selectedMovie);

  const [isLoading, setIsLoading] = useState(false);
  const [cinema, setCinema] = useState(null);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    console.log("cinema: ", cinema);
  }, [cinema]);

  const fetchCinemaList = async (cinemaName) => {
    try {
      let query = `size=5&name=${cinemaName}`;
      const res = await callFetchListCinema(query);
      const cinema = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      dispatch(doSetSelectedCinema(cinema));

      return cinema;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching cinema list:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

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

      return movie;
    } catch (error) {
      console.error("Error fetching movie list:", error);
      return [];
    }
  };

  // sau khi có id phim thì tìm ngày chiếu
  useEffect(() => {
    if (cinema && movie) {
      fetchShowDateByMovieId(movie.value, cinema.value);
    }
  }, [movie]);

  const fetchShowDateByMovieId = async (movieId, cinemaId) => {
    try {
      const resShowDate = await callGetShowDateByMovieId(movieId, cinemaId);
      if (resShowDate && resShowDate.length > 0) {
        const sortedDates = resShowDate
          .slice()
          .sort((a, b) => new Date(a) - new Date(b));
        dispatch(doSetShowDateByMovieId(sortedDates));
      }
    } catch (error) {
      console.error("error fetch show date by movieId: ", error);
    }
  };

  useEffect(() => {
    if (cinema && movie) {
      dispatch(doSetSelectedMovie(movie));
    }
  }, [movie]);

  return (
    <>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 10]} style={{ width: "100%", marginLeft: 1 }}>
          <Card style={{ width: "100%" }}>
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
                    value={movie}
                    onChange={(newValue) => {
                      setMovie(newValue);
                    }}
                    placeholder="Chọn phim"
                    fetchOptions={fetchMovieList}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <CalendarBooking />
        </Row>
      </Form>
    </>
  );
};

export default BookingSchedule;
