import { notification } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { doSetSelectedSeats } from "../../redux/booking/bookingSlice";
import SeatLegend from "./SeatLegend";

const SeatGrid = ({ seatData }) => {
  const dispatch = useDispatch();
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);

  // Hàm để lấy màu tùy theo loại ghế
  // sửa loại ghế đôi
  const getTypeSeatColor = (seatTypeId) => {
    switch (seatTypeId) {
      case 1:
        return "#FF8247"; // Màu cam cho ghế vip
      case 2:
        return "#FF1493"; // Màu hồng cho ghế đôi
      default:
        return "#6959CD"; // Màu tím cho ghế thường (mặc định)
    }
  };

  // Tạo một mảng chứa thông tin về tất cả các ghế trong lưới
  const allSeats = Array.from({ length: 200 }, (_, index) => ({
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
    // Kiểm tra xem số lượng ghế đã chọn có đạt tối đa (8 ghế) hay chưa
    if (selectedSeats.length >= 8) {
      // Nếu đã đạt tối đa, không thực hiện thêm ghế mới
      notification.warning({
        message: "Thông báo",
        description: "Bạn chỉ được chọn tối đa 8 ghế!",
      });
      return;
    }

    // Kiểm tra xem ghế đã được chọn trước đó chưa
    const seatIndex = selectedSeats.findIndex(
      (selectedSeat) =>
        selectedSeat.seatRow === seat.seatRow &&
        selectedSeat.seatColumn === seat.seatColumn
    );

    // Nếu ghế đã được chọn trước đó, loại bỏ nó khỏi danh sách các ghế đã chọn
    if (seatIndex !== -1) {
      const updatedSeats = selectedSeats.filter(
        (selectedSeat) =>
          selectedSeat.seatRow !== seat.seatRow ||
          selectedSeat.seatColumn !== seat.seatColumn
      );
      dispatch(doSetSelectedSeats(updatedSeats));
    } else {
      // Nếu ghế chưa được chọn trước đó, thêm nó vào danh sách các ghế đã chọn
      dispatch(doSetSelectedSeats([...selectedSeats, seatInfo.seat]));
      // setSelectedSeats((prevSeats) => [
      //   ...prevSeats,
      //   {
      //     id: seatInfo.seat.id,
      //     name: seatInfo.seat.name,
      //     code: seatInfo.seat.code,
      //     status: seatInfo.seat.status,
      //     seatTypeId: seatInfo.seat.seatTypeId,
      //     seatRow: seat.seatRow,
      //     seatColumn: seat.seatColumn,
      //   },
      // ]);
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
