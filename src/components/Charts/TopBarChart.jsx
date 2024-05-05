import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TopBarChart = ({ data, type }) => {
  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {type === "returnInvoce" ? (
          <Bar dataKey="quantity" fill="#8884d8" name="Số lượng" />
        ) : (
          <Bar dataKey="totalRevenue" fill="#82ca9d" name="Tổng doanh thu" />
        )}
      </BarChart>
    </div>
  );
};

export default TopBarChart;
