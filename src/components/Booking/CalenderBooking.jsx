import { Card } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doSetSelectedShowTime } from "../../redux/booking/bookingSlice";
import { callFetchListShowtime } from "../../services/apiShowTime";
import { FORMAT_DATE } from "../../utils/constant";
import "./styles.scss";

const days = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

const CalendarBooking = () => {
  const dispatch = useDispatch();
  const showDateByMovieId = useSelector(
    (state) => state.booking.showDateByMovieId
  );
  const selectedCinema = useSelector((state) => state.booking.selectedCinema);
  const selectedMovie = useSelector((state) => state.booking.selectedMovie);
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );

  const [selectedDate, setSelectedDate] = useState(null);
  const [showTime, setShowTime] = useState(null);

  useEffect(() => {
    if (showDateByMovieId) {
      setSelectedDate(showDateByMovieId[0]);
    }
  }, [showDateByMovieId]);

  useEffect(() => {
    if (showDateByMovieId.length > 0) {
      fetchShowTimeByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchShowTimeByDate = async (date) => {
    let query = `size=100&cinemaId=${selectedCinema[0]?.value}&movieId=${selectedMovie[0]?.value}&date=${date}`;
    try {
      const resShowTime = await callFetchListShowtime(query);
      if (resShowTime?.content) {
        setShowTime(resShowTime.content);
      }
    } catch (error) {
      console.log("Error fetching showtime list:", error);
    }
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return days[dayOfWeek];
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const groupedShowTimes = useMemo(() => {
    const grouped = {};
    showTime &&
      showTime.forEach((showTime) => {
        if (!grouped[showTime.roomName]) {
          grouped[showTime.roomName] = [];
        }
        grouped[showTime.roomName].push(showTime);
      });
    return grouped;
  }, [showTime]);

  const handleSelectedShowTime = (showTime) => {
    dispatch(doSetSelectedShowTime(showTime));
  };

  return (
    <>
      <Card className={`calendar_booking`}>
        <h6 style={{ textAlign: "left" }}>Lịch chiếu</h6>
        <div className={`show_date`}>
          {showDateByMovieId.map((dateString, index) => (
            <div
              key={index}
              className={`row_date`}
              onClick={() => handleDateSelect(dateString)}
            >
              <div
                className={`item ${
                  dateString === selectedDate ? "selected" : ""
                }`}
              >
                <span>{getDayOfWeek(dateString)}</span>
                <span>{moment(dateString).format(FORMAT_DATE)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className={`calendar_booking`}>
        <h6 style={{ textAlign: "left" }}>Suất chiếu</h6>
        {Object.keys(groupedShowTimes).map((roomName) => (
          <>
            <div key={roomName} className={`row_showTime`}>
              <h5 style={{ textAlign: "left", maxWidth: 200 }}>{roomName}</h5>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {groupedShowTimes[roomName].map((item, index) => (
                  <span
                    key={index}
                    className={`item_showTime ${
                      selectedShowTime?.id === item.id ? "selectedTime" : ""
                    }`}
                    onClick={() => handleSelectedShowTime(item)}
                  >
                    {item.showTime}
                  </span>
                ))}
              </div>
            </div>
            <div className={`line`}></div>
          </>
        ))}
      </Card>
    </>
  );
};

export default CalendarBooking;
