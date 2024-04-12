import { Button, Table, Typography } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { doSetSelectedShowTime } from "../../redux/booking/bookingSlice";

const { Title } = Typography;

const MovieShowTimes = (props) => {
  const { showTime, cinemaName, handleShowTimeSelection } = props;
  const dispatch = useDispatch();
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );

  // Sort data by showDate
  const sortedData = showTime?.sort((a, b) =>
    a.showDate > b.showDate ? 1 : -1
  );
  // const sortedData =
  //   showTime && Array.isArray(showTime)
  //     ? showTime.sort((a, b) => (a.showDate > b.showDate ? 1 : -1))
  //     : [];

  // Group showtimes by showDate
  const groupedData = sortedData.reduce((acc, curr) => {
    if (!acc[curr.showDate]) {
      acc[curr.showDate] = [];
    }
    acc[curr.showDate].push(curr);
    return acc;
  }, {});

  const columns = [
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Giờ chiếu",
      dataIndex: "showTimes",
      key: "showTimes",
      render: (showTimes) => (
        <div>
          {showTimes.map((showtime, index) => (
            <Button
              type="primary"
              key={index}
              onClick={() => {
                handleShowTimeSelection(showtime);
                dispatch(doSetSelectedShowTime(showtime));
              }}
            >
              {showtime.showTime}
            </Button>
          ))}
        </div>
      ),
    },
  ];

  const transformedData = Object.keys(groupedData).map((date) => ({
    key: date,
    date: date,
    showTimes: groupedData[date],
  }));

  return (
    <div style={{ width: "100%" }}>
      <Title level={3}>{cinemaName}</Title>
      <Table
        bordered
        columns={columns}
        dataSource={transformedData}
        pagination={false}
      />
    </div>
  );
};

export default MovieShowTimes;
