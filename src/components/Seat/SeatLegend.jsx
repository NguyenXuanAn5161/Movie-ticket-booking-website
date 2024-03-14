import React from "react";

const SeatLegend = ({ color, text }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          borderRadius: 5,
          width: 40,
          height: 40,
          backgroundColor: color,
          margin: 10,
        }}
      />
      <span style={{ color: "#000000", fontSize: 16, fontWeight: 500 }}>
        {text}
      </span>
    </div>
  );
};

export default SeatLegend;
