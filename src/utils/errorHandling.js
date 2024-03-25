// errorHandling.js

const getErrorMessageUser = (error) => {
  switch (error) {
    case "Email is already taken!":
      return "Email đã tồn tại!";
    case "Phone is already taken!":
      return "Số điện thoại đã tồn tại!";
    default:
      return error;
  }
};

export { getErrorMessageUser };
