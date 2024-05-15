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
  typeSeat,
}) => {
  const [rendered, setRendered] = useState(false);

  // Ánh xạ giữa typeSeat và backgroundColor
  // sửa loại ghế đôi
  const getTypeSeatColor = (seatTypeId) => {
    let seat = null;
    typeSeat?.forEach((type) => {
      if (type.id === seatTypeId) {
        seat = type;
      }
    });

    switch (seat?.name) {
      case "VIP":
        return "#FF8247"; // Màu cam cho ghế vip
      case "STANDARD":
        return "#6959CD"; // Màu tím cho ghế thường (mặc định)
      default:
        return "#FF1493"; // Màu hồng cho ghế đôi
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
  const seatData = selectedSeats?.find(
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
