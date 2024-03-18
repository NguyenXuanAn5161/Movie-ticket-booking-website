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
}) => {
  const [rendered, setRendered] = useState(false);

  // Ánh xạ giữa typeSeat và backgroundColor
  const getTypeSeatColor = (typeSeat) => {
    switch (typeSeat) {
      case "vip":
        return "#FF8247"; // Màu cam cho ghế vip
      case "sweet":
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

  // const isSweetSeat = selectedSeats.find(
  //   (seat) => seat.index === index && seat.typeSeat === "sweet"
  // );

  // Xác định vị trí của ghế so với danh sách ghế đã chọn
  // const selectedIndexes = selectedSeats.map((seat) => seat.index);
  // const prevIndex = selectedIndexes.indexOf(index - 1);
  // const nextIndex = selectedIndexes.indexOf(index + 1);
  // const isLeftSeat = prevIndex === -1 || (prevIndex !== -1 && nextIndex !== -1);

  return (
    <div
      data-testid={`grid-cell-${index}`}
      key={index}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      style={{
        backgroundColor: isSelected
          ? "chocolate"
          : selectedSeats.find((seat) => seat.index === index)
          ? getTypeSeatColor(
              selectedSeats.find((seat) => seat.index === index).typeSeat
            )
          : "#FFFFFF",
        cursor: "pointer",
        borderRadius: 2,
        width: 30,
        // width: isSweetSeat ? 47 : 40,
        height: 30,
        border: "1px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // marginLeft: isSweetSeat && !isLeftSeat ? -7 : 0, // Điều chỉnh marginLeft cho ghế bên trái
        // marginRight: isSweetSeat && !isLeftSeat ? -7 : 0, // Điều chỉnh marginRight cho ghế bên phải
      }}
    >
      {text}
    </div>
  );
};

export default SeatComponent;
