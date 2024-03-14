import React from "react";

const Seat = ({ selected, onClick, seatColumn, seatRow, seatType }) => {
  // Xác định chiều rộng dựa trên loại ghế
  const seatWidth = seatType === "doi" ? "85px" : "40px";
  let backgroundColor = "#818181"; // Mặc định màu tím là ghế không được có trong phòng

  // switch (seatType) {
  //   case "thuong":
  //     backgroundColor = selected ? "#FF0066" : "#6959CD"; // Ghế thường, màu hồng đậm khi được chọn, màu tím khi không
  //     break;
  //   case "vip":
  //     backgroundColor = selected ? "#FF0066" : "#FF8247"; // Ghế VIP, màu hồng đầm khi được chọn, màu cam khi không
  //     break;
  //   case "doi":
  //     backgroundColor = selected ? "#FF0066" : "#FF1493"; // Ghế đôi, màu hồng đậm khi được chọn, màu hồng nhạt khi không
  //     break;
  //   default:
  //     break;
  // }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        width: seatType === "doi" ? "42.5px" : "40px", // Nếu là ghế đôi, chiều rộng là 85px
        height: "40px",
        backgroundColor: selected ? "#FF0066" : backgroundColor,
        cursor: "pointer",
        borderRadius: 5,
      }}
      onClick={onClick}
    >
      {seatRow}
      {seatColumn}
    </div>
  );
};

export default Seat;
