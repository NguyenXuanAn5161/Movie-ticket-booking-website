import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "../../core/useTheme";
import { doSetSelectedSeats } from "../../redux/booking/bookingSlice";
import { callFetchListTypeSeat } from "../../services/apiMovie";
import SeatLegend from "./SeatLegend";

const SeatGrid = ({ seatData }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [typeSeat, setTypeSeat] = useState(null);

  // fetch type seat để so sánh loại ghế
  useEffect(() => {
    getTypeSeat();
  }, []);

  const getTypeSeat = async () => {
    const resTypeSeat = await callFetchListTypeSeat();
    setTypeSeat(resTypeSeat);
  };

  const selectedSeats = useSelector((state) => state.booking.selectedSeats);

  // Hàm để lấy màu tùy theo loại ghế
  const getTypeSeatColor = (seatTypeId, defaultColor) => {
    var seat = null;
    typeSeat?.forEach((type) => {
      if (type.id === seatTypeId) {
        seat = type;
      }
    });

    return seat?.name === "STANDARD"
      ? defaultColor
      : seat?.name === "VIP"
      ? theme.colors.vip
      : theme.colors.sweetBox;
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
      // Kiểm tra xem số lượng ghế đã chọn có đạt tối đa (8 ghế) hay chưa
      if (selectedSeats.length >= 8) {
        // Nếu đã đạt tối đa, không thực hiện thêm ghế mới
        notification.warning({
          message: "Thông báo",
          description: "Bạn chỉ được chọn tối đa 8 ghế!",
        });
        return;
      }
      // Nếu ghế chưa được chọn trước đó, thêm nó vào danh sách các ghế đã chọn
      dispatch(doSetSelectedSeats([...selectedSeats, seatInfo.seat]));
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
        <SeatLegend color={theme.colors.darkGrey} text="Ghế đã bán" />
        <SeatLegend color={theme.colors.selectedSeat} text="Ghế đang chọn" />
        <SeatLegend color={theme.colors.standard} text="Ghế thường" />
        <SeatLegend color={theme.colors.vip} text="Ghế vip" />
        <SeatLegend color={theme.colors.sweetBox} text="Ghế đôi" />
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
          // kiểm tra ghế đã được bán hay chưa
          const isBooked = seatInfo && !seatInfo.status;
          if (isBooked) console.log("ghế đã bán", isBooked);
          return (
            <div
              key={index}
              style={{
                cursor: seatInfo ? "pointer" : null,
                pointerEvents: isBooked ? "none" : "auto",
                borderRadius: 3,
                width: 30,
                height: 30,
                border: seatInfo ? `1px solid black` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Thêm sự kiện onClick để xử lý việc chọn ghế
                // và thay đổi màu nền của ghế khi được chọn
                backgroundColor: isBooked
                  ? theme.colors.darkGrey
                  : isSelected
                  ? theme.colors.selectedSeat
                  : seatInfo
                  ? getTypeSeatColor(
                      seatInfo.seat.seatTypeId,
                      theme.colors.standard
                    )
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
