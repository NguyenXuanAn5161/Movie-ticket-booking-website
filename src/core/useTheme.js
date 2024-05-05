import { useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState({
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
      success: "#28a745",
      info: "#17a2b8",
      warning: "#ffc107",
      danger: "#dc3545",
      light: "#f8f9fa",
      dark: "#343a40",
      orange: "#FE3323",
      pink: "#FF1493",
      grey: "#8C8C8C",
      greyRgba: "rgba(0, 0, 0, 0.45)",
      darkGrey: "#ccc",
      standard: "#6959CD",
      vip: "#FF8247",
      sweetBox: "#FF1493",
      selectedSeat: "green",
    },
    fontSize: {
      small: "12px",
      medium: "16px",
      large: "20px",
      fz_18: "18px",
      fz_20: "20px",
      fz_24: "24px",
      fz_28: "28px",
      fz_32: "32px",
    },
    fonts: {
      body: "Arial, sans-serif",
      heading: "Helvetica, sans-serif",
      // Các font khác...
    },
    // Các thuộc tính khác của theme...
  });

  const updateTheme = (updatedTheme) => {
    setTheme(updatedTheme);
  };

  return { theme, updateTheme };
};

export default useTheme;
