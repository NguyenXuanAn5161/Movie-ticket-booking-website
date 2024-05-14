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

//   /^[^\d]{2,}$/, khong chua so
//   /.{2,}/u, it nhat 2 ky tu
// /^[^\d\W_]{2,}$/i không chứa số, ký tự đặc biệt, ko chứa khoảng trắng
// /^[^\d\W_ ]{2,}$/i không chứa số, ký tự đặc biệt, ko chứa khoảng trắng
// /^(?=[^\d\W_ ]{2,}$).*$/i

export const validateUsername = validateField(
  "Họ và tên",
  /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\ ]{2,}$/,
  "Họ và tên chỉ chứa chữ cái và dấu cách!",
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

// valid tên phim ít nhất 2 ký tự
export const validateMovieName = validateField(
  "Tên phim",
  /.{2,}/u,
  "Tên phim ít nhất 2 ký tự!",
  false
);

// valid ist nhất 2 ký tự và không chứa ký tự đặc biệt, không chứa ký tự số
export const validateTwoChar = (field) =>
  validateField(
    field,
    /^[^\W_]{2,}$/i,
    `${field} ít nhất 2 ký tự và là chữ cái, không chứa ký tự đặc biệt`,
    false
  );

// valid cho tên giá, tên khuyến mãi có ít nhất 2 ký tự
export const validateTwoCharVietnamese = (field) =>
  validateField(
    field,
    /.{2,}/u,
    `${field} ít nhất 2 ký tự, không chứa ký tự đặc biệt`,
    false
  );
