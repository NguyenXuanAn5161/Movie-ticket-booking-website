import { Card } from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  doSetSelectedFoods,
  doSetSelectedPromotionBill,
  doSetSelectedPromotionFood,
  doSetSelectedPromotionSeat,
  doSetSelectedSeats,
  doSetSelectedShowTime,
} from "../../redux/booking/bookingSlice";
import { callFetchListShowtime } from "../../services/apiShowTime";
import { FORMAT_DATE_DD_MM } from "../../utils/constant";
import {
  convertWeekday,
  filterAndSortShowTimes,
  formatTime,
} from "../../utils/formatData";
import "./styles.scss";

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

  // fetch showtime by date
  useEffect(() => {
    if (showDateByMovieId.length > 0) {
      fetchShowTimeByDate(selectedDate);
    } else {
      setShowTime(null);
    }
  }, [selectedDate]);

  const fetchShowTimeByDate = async (date) => {
    let query = `size=100&cinemaId=${selectedCinema?.value}&movieId=${selectedMovie?.value}&date=${date}`;
    try {
      const resShowTime = await callFetchListShowtime(query);
      if (resShowTime?.content) {
        const dataFormat = filterAndSortShowTimes(resShowTime.content);
        setShowTime(dataFormat);
      }
    } catch (error) {
      console.error("Error fetching showtime list:", error);
    }
  };

  const getDayOfWeek = (dateString) => {
    const weekday = new Date(dateString).toLocaleDateString("en", {
      weekday: "long",
    });
    const date = convertWeekday(weekday, dateString);
    return date;
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
    dispatch(doSetSelectedSeats([]));
    dispatch(doSetSelectedFoods([]));
    dispatch(doSetSelectedPromotionBill({}));
    dispatch(doSetSelectedPromotionSeat({}));
    dispatch(doSetSelectedPromotionFood({}));
  };

  return (
    <>
      <Card className={`calendar_booking`}>
        <h6 style={{ textAlign: "left" }}>Lịch chiếu</h6>
        <div style={{ width: "100%", overflowX: "auto" }}>
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
                  <span>{moment(dateString).format(FORMAT_DATE_DD_MM)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card className={`calendar_booking`}>
        <h6 style={{ textAlign: "left" }}>Suất chiếu</h6>
        {Object.keys(groupedShowTimes)
          .sort((a, b) => a.localeCompare(b))
          .map((roomName) => (
            <>
              <div key={roomName} className={`row_showTime`}>
                <h7 style={{ textAlign: "left", minWidth: 200, maxWidth: 200 }}>
                  {roomName}
                </h7>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 5,
                  }}
                >
                  {groupedShowTimes[roomName].map((item, index) => (
                    <span
                      key={index}
                      className={`item_showTime ${
                        selectedShowTime?.id === item.id ? "selectedTime" : ""
                      }`}
                      onClick={() => handleSelectedShowTime(item)}
                    >
                      {formatTime(item.showTime)}
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
