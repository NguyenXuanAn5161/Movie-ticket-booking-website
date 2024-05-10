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
import useTheme from "../../core/useTheme";
import { formatCurrency } from "../../utils/formatData";

const GroupedBarChart = ({ data, type, title, layout }) => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <BarChart layout={layout} width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          color="red"
          tick={{ stroke: theme.colors.dark, strokeWidth: 0.2 }}
        />
        <YAxis width={100} tickFormatter={formatCurrency} />
        <Tooltip formatter={formatCurrency} />
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
  layout: PropTypes.string,
};

export default GroupedBarChart;
