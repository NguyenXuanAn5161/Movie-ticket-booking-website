import { useEffect, useState } from "react";
import SeatGrid from "../../../components/Seat/SeatGrid";
import { callGetSeatForUserByShowtimeId } from "../../../services/apiShowTime";

const BookingSeat = (props) => {
  const { selectedSeats, setSelectedSeats } = props;

  const [seatData, setSeatData] = useState([]);

  useEffect(() => {
    console.log("seatData", seatData);
  }, [seatData]);

  useEffect(() => {
    // Call API to get seat data
    fetchSeatForUser();
  }, []);

  const fetchSeatForUser = async () => {
    const res = await callGetSeatForUserByShowtimeId(props.oneShowTime.id);
    if (res) {
      setSeatData(res);
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
        <SeatGrid
          seatData={seatData}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
        />
      </div>
    </>
  );
};

export default BookingSeat;
