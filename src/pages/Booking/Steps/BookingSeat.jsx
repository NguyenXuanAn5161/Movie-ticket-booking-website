import SeatGrid from "../../../components/Seat/SeatGrid";

const BookingSeat = (props) => {
  const seatData = [
    { seatRow: 1, seatColumn: 1 },
    { seatRow: 1, seatColumn: 2 },
    { seatRow: 1, seatColumn: 5 },
    { seatRow: 4, seatColumn: 1 },
    { seatRow: 4, seatColumn: 5 },
  ];

  return (
    <>
      <h2>Chọn ghế</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SeatGrid seatData={seatData} />
      </div>
    </>
  );
};

export default BookingSeat;
