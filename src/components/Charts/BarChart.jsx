import PropTypes from "prop-types";
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
import { formatCurrency } from "../../utils/formatData";

const GroupedBarChart = ({ data, type, title }) => {
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
        <XAxis dataKey="name" color="red" />
        <YAxis width={100} tickFormatter={formatCurrency} />
        <Tooltip />
        <Legend />
        {type === "returnInvoce" ? (
          <Bar dataKey="quantity" fill="#8884d8" name="Số lượng" />
        ) : (
          <Bar dataKey="totalRevenue" fill="#82ca9d" name={title} />
        )}
      </BarChart>
    </div>
  );
};

// xác định loại cho các data truyền vào
GroupedBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
};

export default GroupedBarChart;
