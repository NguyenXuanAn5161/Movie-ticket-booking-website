// utils/seatCalculations.js
export const calculateSeatPosition = (index) => {
  const seatRow = Math.floor(index / 20) + 1;
  const seatColumn = (index % 20) + 1;
  return { seatRow, seatColumn };
};

export const calculateIndexFromSeatPosition = (seatRow, seatColumn) => {
  const index = (seatRow - 1) * 20 + seatColumn - 1;
  return index;
};
