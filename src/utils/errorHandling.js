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
    case `name: ${name ? name : ""} already exists`:
      return "Tên phòng đã tồn tại!";
    default:
      return error;
  }
};

const getErrorMessageCategoryFood = (error, { name, id }) => {
  switch (error) {
    case `name: ${name ? name : ""} already exists`:
      return `Tên loại đồ ăn đã tồn tại!`;
    case `Category not found with id: ${id ? id : ""}`:
      return `Loại đồ ăn không tồn tại`;
    default:
      return error;
  }
};

const getErrorMessageFood = (error, { name, foodId, categoryId }) => {
  switch (error) {
    case `name: ${name ? name : ""} already exists`:
      return `Tên loại đồ ăn đã tồn tại!`;
    case `Category not found with id: ${categoryId ? categoryId : ""}`:
      return `Loại đồ ăn không tồn tại`;
    case `Food not found with id: ${foodId ? foodId : ""}`:
      return "Đồ ăn này không tồn tại!";
    default:
      return error;
  }
};

const getErrorMessageSalePriceHeader = (error, { name, id }) => {
  switch (error) {
    case `A sale price already exists within the specified time period`:
      return `Giá đã tồn tại trong khoảng thời gian đã chọn!`;
    case `name: ${name ? name : ""} already exists`:
      return `Tên giá đã tồn tại!`;
    case `Food not found with id: ${id ? id : ""}`:
      return "Đồ ăn này không tồn tại!";
    default:
      return error;
  }
};

export {
  getErrorMessageCategoryFood,
  getErrorMessageCinema,
  getErrorMessageFood,
  getErrorMessageRoom,
  getErrorMessageSalePriceHeader,
  getErrorMessageUser,
};
