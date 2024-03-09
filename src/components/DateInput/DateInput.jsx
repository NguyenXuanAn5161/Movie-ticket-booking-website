// DateInput.js
import { Input } from "antd";
import React from "react";

const DateInput = ({ name, placeholder, onChange }) => {
  const handleChange = (e) => {
    let { value } = e.target;
    // Kiểm tra xem giá trị nhập vào có đủ 10 ký tự không (mm/dd/yyyy)
    if (value && value.length === 10) {
      // Tách ngày, tháng và năm từ giá trị nhập vào
      const parts = value.split("/");
      const day = parts[1];
      const month = parts[0];
      const year = parts[2];
      // Tạo chuỗi mới với định dạng "dd/mm/yyyy"
      const formattedValue = `${day}/${month}/${year}`;
      // Gán giá trị mới vào ô nhập liệu
      e.target.value = formattedValue;
    }
    // Chuyển sự kiện onChange tới parent component nếu có
    onChange(e);
  };

  return (
    <>
      <Input
        id={name}
        type="date"
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </>
  );
};

export default DateInput;
