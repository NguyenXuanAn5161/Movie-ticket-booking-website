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
      darkGrey: "#ccc",
      standard: "#6959CD",
      vip: "#FF8247",
      sweetBox: "#FF1493",
      selectedSeat: "green",
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
