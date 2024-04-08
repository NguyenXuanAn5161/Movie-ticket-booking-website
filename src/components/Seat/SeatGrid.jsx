import React from "react";
import SeatLegend from "./SeatLegend";

const SeatGrid = ({ seatData, selectedSeats, setSelectedSeats }) => {
  // Hàm để lấy màu tùy theo loại ghế
  const getTypeSeatColor = (seatTypeId) => {
    switch (seatTypeId) {
      case 2:
        return "#FF8247"; // Màu cam cho ghế vip
      case 1:
        return "#FF1493"; // Màu hồng cho ghế đôi
      default:
        return "#6959CD"; // Màu tím cho ghế thường (mặc định)
    }
  };

  // Tạo một mảng chứa thông tin về tất cả các ghế trong lưới
  const allSeats = Array.from({ length: 400 }, (_, index) => ({
    seatRow: Math.floor(index / 20) + 1,
    seatColumn: (index % 20) + 1,
  }));

  // Hàm để kiểm tra xem một ghế có tồn tại trong seatData hay không
  const isSeatExist = (seat) => {
    return seatData.find(
      (data) =>
        data.seat.seatRow === seat.seatRow &&
        data.seat.seatColumn === seat.seatColumn
    );
  };

  // Hàm xử lý sự kiện khi người dùng chọn một ghế
  const handleSeatClick = (seat) => {
    const seatInfo = isSeatExist(seat);
    // Kiểm tra xem ghế đã được chọn trước đó chưa
    const seatIndex = selectedSeats.findIndex(
      (selectedSeat) =>
        selectedSeat.seatRow === seat.seatRow &&
        selectedSeat.seatColumn === seat.seatColumn
    );

    // Nếu ghế đã được chọn trước đó, loại bỏ nó khỏi danh sách các ghế đã chọn
    if (seatIndex !== -1) {
      setSelectedSeats((prevSeats) =>
        prevSeats.filter(
          (selectedSeat) =>
            selectedSeat.seatRow !== seat.seatRow ||
            selectedSeat.seatColumn !== seat.seatColumn
        )
      );
    } else {
      // Nếu ghế chưa được chọn trước đó, thêm nó vào danh sách các ghế đã chọn
      setSelectedSeats((prevSeats) => [
        ...prevSeats,
        {
          id: seatInfo.seat.id,
          name: seatInfo.seat.name,
          code: seatInfo.seat.code,
          status: seatInfo.seat.status,
          seatTypeId: seatInfo.seat.seatTypeId,
          seatRow: seat.seatRow,
          seatColumn: seat.seatColumn,
        },
      ]);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <SeatLegend color="#ccc" text="Ghế đã bán" />
        <SeatLegend color="green" text="Ghế đang chọn" />
        <SeatLegend color="#6959CD" text="Ghế thường" />
        <SeatLegend color="#FF8247" text="Ghế vip" />
        <SeatLegend color="#FF1493" text="Ghế đôi" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(20, 1fr)",
          gap: 5,
        }}
      >
        {allSeats.map((seat, index) => {
          const seatInfo = isSeatExist(seat);
          // Kiểm tra xem ghế có trong danh sách các ghế đã chọn không
          const isSelected = selectedSeats.some(
            (selectedSeat) =>
              selectedSeat.seatRow === seat.seatRow &&
              selectedSeat.seatColumn === seat.seatColumn
          );
          return (
            <div
              key={index}
              style={{
                backgroundColor: seatInfo
                  ? getTypeSeatColor(seatInfo.seat.seatTypeId)
                  : "transparent",
                cursor: seatInfo ? "pointer" : null,
                borderRadius: 3,
                width: 30,
                height: 30,
                border: seatInfo ? `1px solid black` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Thêm sự kiện onClick để xử lý việc chọn ghế
                // và thay đổi màu nền của ghế khi được chọn
                backgroundColor: isSelected
                  ? "green"
                  : seatInfo
                  ? getTypeSeatColor(seatInfo.seat.seatTypeId)
                  : "transparent",
              }}
              onClick={() => handleSeatClick(seat)}
            >
              {seatInfo ? seatInfo.seat.name : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SeatGrid;
