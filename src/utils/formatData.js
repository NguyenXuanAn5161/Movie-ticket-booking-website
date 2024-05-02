// import moment from "moment";

export const convertWeekday = (weekday, date) => {
  const today = new Date();
  const itemDate = new Date(date);
  if (
    today.getFullYear() === itemDate.getFullYear() &&
    today.getMonth() === itemDate.getMonth() &&
    today.getDate() === itemDate.getDate()
  ) {
    return "Hôm nay";
  }

  switch (weekday) {
    case "Monday":
      return "Thứ 2";
    case "Tuesday":
      return "Thứ 3";
    case "Wednesday":
      return "Thứ 4";
    case "Thursday":
      return "Thứ 5";
    case "Friday":
      return "Thứ 6";
    case "Saturday":
      return "Thứ 7";
    case "Sunday":
      return "Chủ nhật";
    default:
      return "";
  }
};

// format ngày tháng từ nhỏ đến lớn, và loại bỏ các ngày nhỏ hơn ngày hiện tại
export const filterAndSortDates = (dateArray) => {
  // Lấy ngày hiện tại, bỏ qua giờ phút
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Lọc ra các ngày lớn hơn hoặc bằng ngày hiện tại
  const filteredDates = dateArray.filter((date) => {
    const dateObject = new Date(date);
    dateObject.setHours(0, 0, 0, 0); // Bỏ qua giờ phút
    return dateObject >= currentDate;
  });

  // Sắp xếp các ngày từ nhỏ đến lớn
  filteredDates.sort((a, b) => new Date(a) - new Date(b));

  // const formatDate = filteredDates.map((date) => dateFormat(new Date(date)));
  return filteredDates;
};

export const filterAndSortShowTimes = (showTimes) => {
  // Lấy thời gian hiện tại
  const currentTime = new Date();

  // Lọc ra các suất chiếu sau thời gian hiện tại
  const filteredShowTimes = showTimes.filter((showTime) => {
    const showDateTime = new Date(showTime.showDate + "T" + showTime.showTime);
    return showDateTime >= currentTime;
  });

  // Sắp xếp các suất chiếu theo thời gian bắt đầu từ nhỏ đến lớn
  filteredShowTimes.sort((a, b) => {
    const dateTimeA = new Date(a.showDate + "T" + a.showTime);
    const dateTimeB = new Date(b.showDate + "T" + b.showTime);
    return dateTimeA - dateTimeB;
  });

  return filteredShowTimes;
};

// nhóm các suất chiếu cùng phòng chiếu
export const groupShowTimesByRoom = (showTimes) => {
  const groupedShowTimes = showTimes.reduce((result, showTime) => {
    const roomName = showTime.roomName;
    const existingRoomIndex = result.findIndex(
      (item) => item.roomName === roomName
    );
    if (existingRoomIndex === -1) {
      // Nếu phòng chưa tồn tại trong kết quả, thêm mới
      result.push({ roomName: roomName, time: [showTime] });
    } else {
      // Nếu phòng đã tồn tại, thêm vào mảng thời gian của phòng đó
      result[existingRoomIndex].time.push(showTime);
    }
    return result;
  }, []);

  return groupedShowTimes;
};
