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

export { getErrorMessageUser };
