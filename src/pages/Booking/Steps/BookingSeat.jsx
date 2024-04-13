import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SpinLoading from "../../../components/Loading/Spin";
import SeatGrid from "../../../components/Seat/SeatGrid";
import { callGetSeatForUserByShowtimeId } from "../../../services/apiShowTime";

const BookingSeat = () => {
  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );

  const [seatData, setSeatData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedShowTime) {
      fetchSeatForUser();
    }
  }, [selectedShowTime]);

  const fetchSeatForUser = async () => {
    setLoading(true);
    try {
      const res = await callGetSeatForUserByShowtimeId(selectedShowTime.id);
      console.log("res", res);
      if (res) {
        setSeatData(res);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  return (
    <>
      <h2>Chọn ghế</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {loading ? <SpinLoading /> : <SeatGrid seatData={seatData} />}
      </div>
    </>
  );
};

export default BookingSeat;
