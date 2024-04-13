import { useEffect, useState } from "react";

const SeatComponent = ({
  isSelected,
  text,
  index,
  checkSelection,
  selectionOn,
  setSelectedItems,
  setSelectedIndexes,
  handleKeyUp,
  handleKeyDown,
  ctrlPressed,
  selectedSeats,
  seatRow,
  seatColumn,
}) => {
  const [rendered, setRendered] = useState(false);

  // Ánh xạ giữa typeSeat và backgroundColor
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

  useEffect(() => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, index]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== index));
    }
  }, [isSelected]);

  useEffect(() => {
    if (selectionOn && isSelected && !rendered) {
      setRendered(true);
      checkSelection(index, true);
    } else if (!selectionOn) {
      setRendered(false);
    }
  }, [selectionOn, isSelected, checkSelection, index, rendered]);

  const handleClick = () => {
    if (ctrlPressed) {
      setSelectedIndexes((prev) =>
        isSelected ? prev.filter((item) => item !== index) : [...prev, index]
      );
    }
  };

  // Tìm kiếm thông tin ghế dựa trên seatRow và seatColumn
  const seatData =
    selectedSeats &&
    selectedSeats.find(
      (seat) => seat.seatRow === seatRow && seat.seatColumn === seatColumn
    );

  // Xác định màu cho ghế dựa trên seatData
  const selectedSeatColor = seatData
    ? getTypeSeatColor(seatData.seatTypeId)
    : "#FFFFFF";

  return (
    <div
      data-testid={`grid-cell-${index}`}
      key={index}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      style={{
        backgroundColor: isSelected ? "chocolate" : selectedSeatColor,
        cursor: "pointer",
        borderRadius: 3,
        width: 30,
        height: 30,
        border: "1px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {text}
    </div>
  );
};

export default SeatComponent;
