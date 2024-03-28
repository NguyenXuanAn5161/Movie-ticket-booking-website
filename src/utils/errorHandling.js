// errorHandling.js

const getErrorMessageUser = (error, id) => {
  switch (error) {
    case `Not found user with id: ${id ? id : ""}`:
      return `Không tìm thấy người dùng với id: ${id ? id : ""}`;
    case "Email is already taken!":
      return "Email đã tồn tại!";
    case "Phone is already taken!":
      return "Số điện thoại đã tồn tại!";
    default:
      return error;
  }
};

const getErrorMessageCinema = (error, { name, id }) => {
  switch (error) {
    case `name: ${name ? name : ""} already exists`:
      return "Tên rạp phim đã tồn tại!";
    case `Cinema not found with id: ${id ? id : ""}`:
      return `Rạp phim không tồn tại!`;
    case "Cinema is active, can't delete":
      return "Rạp phim đang hoạt động, không thể xoá!";
    default:
      return error;
  }
};

const getErrorMessageRoom = (error, { name, id }) => {
  switch (error) {
    case `Room with name: ${name ? name : ""} already exists`:
      return `Tên phòng đã tồn tại!`;
    case "The given id must not be null":
      return "Không tìm thấy rạp để thêm phòng!";
    case `Cinema not found with id:${id ? id : ""}`:
      return `Rạp phim không tồn tại!`;
    case `Room not found with id:${id ? id : ""}`:
      return `Phòng không tồn tại!`;
    default:
      return error;
  }
};

export { getErrorMessageCinema, getErrorMessageRoom, getErrorMessageUser };
