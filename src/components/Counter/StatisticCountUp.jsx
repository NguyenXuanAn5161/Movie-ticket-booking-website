import { Statistic } from "antd";
import React from "react";
import CountUp from "react-countup";

const StatisticCountUp = ({
  loading,
  title,
  value,
  prefix,
  suffix,
  formatFn,
  decimals,
  precision,
  ...props
}) => {
  const formatter = (value) => {
    if (typeof formatFn === "function") {
      return (
        <CountUp
          start={0}
          end={value}
          duration={2}
          separator=","
          decimal="."
          decimals={decimals}
          formattingFn={(value) => formatFn(value)}
        />
      );
    } else {
      return (
        <CountUp
          start={0}
          end={value}
          duration={2}
          separator=","
          decimal="."
          decimals={decimals}
        />
      );
    }
  };

  return (
    <Statistic
      loading={loading}
      title={title}
      value={value}
      prefix={prefix}
      suffix={suffix}
      precision={precision}
      formatter={formatter}
      {...props}
    />
  );
};

export default StatisticCountUp;
