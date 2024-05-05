// tính tổng tiền
export const calculateTotalMoney = (data) => {
  return data.reduce((total, item) => total + item.totalRevenue, 0);
};

// tính tổng số vé
export const calculateTotalTicket = (data) => {
  return data.reduce((total, item) => total + item.totalTicket, 0);
};

// tính % vé tăng trưởng
export const calculateTicketGrowthRate = (current, previous) => {
  const totalTicketCurrent = calculateTotalTicket(current);
  const totalTicketPrevious = calculateTotalTicket(previous);
  console.log("totalTicketCurrent: ", totalTicketCurrent);
  console.log("totalTicketPrevious: ", totalTicketPrevious);
  return (totalTicketCurrent - totalTicketPrevious) / totalTicketPrevious;
};

// tính % doanh thu tăng trưởng
export const calculateGrowthRate = (current, previous) => {
  const totalPriceCurrent = calculateTotalMoney(current);
  const totalPricePrevious = calculateTotalMoney(previous);
  return (totalPriceCurrent - totalPricePrevious) / totalPricePrevious;
};
