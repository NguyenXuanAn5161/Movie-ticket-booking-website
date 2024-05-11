const validateField = (
  fieldName,
  regex,
  invalidMessage,
  fieldUserName = true
) => {
  return (rule, value, callback) => {
    if (!value) {
      callback();
    } else if (fieldUserName && regex && /\s/.test(value)) {
      callback(`${fieldName} không được chứa khoảng trắng!`);
    } else if (regex && !regex.test(value)) {
      callback(invalidMessage || `${fieldName} không hợp lệ!`);
    } else {
      callback();
    }
  };
};

export const validateUsername = validateField(
  "Họ và tên",
  /^[a-zA-Z ]+$/,
  "Họ và tên chỉ chứa bảng chữ cái tiếng anh và dấu cách!",
  false
);

export const validatePhoneNumber = validateField(
  "Số điện thoại",
  /^(03|07|08|09|05)[0-9]{8}$/,
  "Số điện thoại phải đủ 10 số và bắt đầu bằng các đầu số sau: 03x, 07x, 08x, 09x hoặc 05x."
);

export const validateEmail = validateField(
  "Email",
  /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/,
  "Email chỉ chứa các miền @gmail.com/@yahoo.com/outlook.com!"
);

export const validatePassword = validateField(
  "Mật khẩu",
  /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/,
  "Mật khẩu phải chứa ít nhất 1 ký tự hoa, 1 chữ số, và có ít nhất 6 ký tự!"
);
