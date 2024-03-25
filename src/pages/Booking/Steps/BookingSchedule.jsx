import { Col, Form, Row, Select } from "antd";
import { useState } from "react";

const BookingSchedule = (props) => {
  const cinemaData = [
    {
      cinemaId: 1,
      cinemaName: "Rạp 1",
    },
    {
      cinemaId: 2,
      cinemaName: "Rạp 2",
    },
    {
      cinemaId: 3,
      cinemaName: "Rạp 3",
    },
  ];

  const { form, data } = props;

  const [movies, setMovies] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const options = cinemaData.map((cinema) => ({
    value: cinema.cinemaId,
    label: cinema.cinemaName,
  }));

  const handleCinemaChange = (value) => {
    const selectedCinemaMovies = data.filter((item) => item.cinemaId === value);
    const movieOptions = selectedCinemaMovies.map((movie) => ({
      value: movie.movieId,
      label: movie.movieName,
    }));
    setMovies(movieOptions);
  };

  const handleMovieChange = (value) => {
    const selectedMovieSchedules = data.filter(
      (item) => item.movieId === value
    );
    const scheduleOptions = selectedMovieSchedules.map((schedule) => ({
      value: schedule.startTime,
      label: `${schedule.showDate} - ${schedule.startTime}`,
    }));
    setSchedules(scheduleOptions);
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Chọn rạp"
              name="cinema"
              rules={[{ required: true, message: "Vui lòng chọn rạp!" }]}
            >
              <Select
                style={{ textAlign: "start" }}
                showSearch
                allowClear
                options={options}
                onChange={handleCinemaChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Chọn phim"
              name="movieName"
              rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
            >
              <Select
                style={{ textAlign: "start" }}
                showSearch
                allowClear
                options={movies}
                onChange={handleMovieChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Chọn suất chiếu"
              name="schedule"
              rules={[{ required: true, message: "Vui lòng chọn xuất chiếu!" }]}
            >
              <Select
                style={{ textAlign: "start" }}
                showSearch
                allowClear
                options={schedules}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default BookingSchedule;
