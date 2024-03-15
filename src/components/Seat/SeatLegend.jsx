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
          border: "1px solid black",
          borderRadius: 5,
          width: 30,
          height: 30,
          backgroundColor: color,
          margin: 10,
        }}
      />
      <span style={{ color: "#000000", fontSize: 12, fontWeight: 500 }}>
        {text}
      </span>
    </div>
  );
};

export default SeatLegend;
