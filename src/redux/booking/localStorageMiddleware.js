// Tạo một middleware Redux để tự động lưu trạng thái vào local storage sau mỗi lần thay đổi

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  localStorage.setItem("bookingState", JSON.stringify(store.getState()));
  return result;
};

export default localStorageMiddleware;
