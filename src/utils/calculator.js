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
  // nếu số vé trước đó = 0 thì sao
  const totalTicketCurrent = calculateTotalTicket(current);
  const totalTicketPrevious = calculateTotalTicket(previous);
  console.log("totalTicketCurrent: ", totalTicketCurrent);
  console.log("totalTicketPrevious: ", totalTicketPrevious);
  if (totalTicketPrevious === 0) {
    // If the previous total is zero, growth rate is undefined or can be considered as 100% if current tickets are > 0
    return totalTicketCurrent > 0 ? 100 : 0;
  }
  return (totalTicketCurrent - totalTicketPrevious) / totalTicketPrevious;
};

// tính % doanh thu tăng trưởng
export const calculateGrowthRate = (current, previous) => {
  const totalPriceCurrent = calculateTotalMoney(current);
  const totalPricePrevious = calculateTotalMoney(previous);
  if (totalPricePrevious === 0) {
    return totalPriceCurrent > 0 ? 100 : 0;
  }

  return (totalPriceCurrent - totalPricePrevious) / totalPricePrevious;
};
