import { Card, Col, Form, Row, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarBooking from "../../../components/Booking/CalenderBooking";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import {
  doResetBooking,
  doSetSelectedCinema,
  doSetSelectedMovie,
  doSetShowDateByMovieId,
} from "../../../redux/booking/bookingSlice";
import { callFetchListCinema } from "../../../services/apiCinema";
import {
  callFetchListMovie,
  callGetShowDateByMovieId,
} from "../../../services/apiMovie";
import { filterAndSortDates } from "../../../utils/formatData.js";

const BookingSchedule = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const showDateByMovieId = useSelector(
    (state) => state.booking.showDateByMovieId
  );
  const selectedCinema = useSelector((state) => state.booking.selectedCinema);
  const selectedMovie = useSelector((state) => state.booking.selectedMovie);

  useEffect(() => {
    if (selectedCinema?.value && selectedMovie?.value) {
      form.setFieldsValue({
        cinemaId: selectedCinema,
        movieName: selectedMovie,
      });
    }
  }, [selectedCinema]);

  // lần đầu vào trang thì reset form
  useEffect(() => {
    if (!selectedCinema?.value && !selectedMovie?.value) {
      form.resetFields(["cinemaId", "movieName"]);
    }
  }, [selectedCinema, selectedMovie]);

  const [cinema, setCinema] = useState(null);
  const [movie, setMovie] = useState(null);

  // reset movieName khi chọn rạp khác
  useEffect(() => {
    if (cinema?.value) {
      form.resetFields(["movieName"]);
    }
  }, [cinema]);

  useEffect(() => {
    if (cinema && movie) {
      dispatch(doSetSelectedMovie(movie));
    }
  }, [movie]);

  // tìm rạp theo tên
  const fetchCinemaList = async (cinemaName) => {
    try {
      let query = `size=5&name=${cinemaName}`;
      const res = await callFetchListCinema(query);
      const cinema = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return cinema;
    } catch (error) {
      console.error("Error fetching cinema list:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  useEffect(() => {
    if (cinema) {
      fetchMovieList();
      handleReset();
      dispatch(doSetSelectedCinema(cinema));
    }
  }, [cinema]);

  const handleReset = () => {
    setMovie(null);
    dispatch(doResetBooking());
  };

  // tìm phim theo rạp
  const fetchMovieList = async (movieName) => {
    let query = `size=5&cinemaId=${cinema.value}`;

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
      if (resShowDate) {
        const dataFormat = filterAndSortDates(resShowDate);
        console.log("dataFormat: ", dataFormat);
        dispatch(doSetShowDateByMovieId(dataFormat));
      }
    } catch (error) {
      console.error("error fetch show date by movieId: ", error);
    }
  };

  // thông báo nếu lịch chiếu không có
  useEffect(() => {
    if (movie && showDateByMovieId.length === 0) {
      console.log("showDateByMovieId: ", showDateByMovieId);
      notification.error({
        message: "Không có suất chiếu!",
        description: "Vui lòng chọn phim khác hoặc rạp khác",
      });
    }
  }, [showDateByMovieId]);

  return (
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
                    dispatch(doSetSelectedCinema(newValue));
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
  );
};

export default BookingSchedule;
