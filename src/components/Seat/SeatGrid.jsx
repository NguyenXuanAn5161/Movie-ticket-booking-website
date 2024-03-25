import React from "react";

const SeatGrid = ({ seatData }) => {
  // Tạo một mảng chứa thông tin về tất cả các ghế trong lưới
  const allSeats = Array.from({ length: 20 }, (_, index) => ({
    seatRow: Math.floor(index / 5) + 1,
    seatColumn: (index % 5) + 1,
  }));

  // Hàm để kiểm tra xem một ghế có tồn tại trong seatData hay không
  const isSeatExist = (seat) => {
    return seatData.some(
      (data) =>
        data.seatRow === seat.seatRow && data.seatColumn === seat.seatColumn
    );
  };

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}
    >
      {allSeats.map((seat, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#FFFFFF",
            cursor: isSeatExist(seat) ? "pointer" : null,
            borderRadius: 3,
            width: 30,
            height: 30,
            border: isSeatExist(seat) ? `1px solid black` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isSeatExist(seat) ? `${seat.seatRow}-${seat.seatColumn}` : null}
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
