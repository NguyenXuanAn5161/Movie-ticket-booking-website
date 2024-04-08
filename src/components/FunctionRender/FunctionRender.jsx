import { Tag } from "antd";
import moment from "moment";
import React from "react";
import { FORMAT_DATE_HH_MM_SS } from "../../utils/constant";

export const renderAddress = (text, record) => {
  return (
    <span>
      {record.address.street}, {record.address.ward}, {record.address.district},{" "}
      {record.address.city}, {record.address.nation}
    </span>
  );
};

export const renderDate = (text, record) => {
  return <span>{moment(text).format(FORMAT_DATE_HH_MM_SS)}</span>;
};

export const renderStatus = (text, record) => {
  return (
    <Tag color={record.status ? "success" : "error"}>
      {record.status ? "Được chiếu" : "Ngừng chiếu"}
    </Tag>
  );
};

export const renderCurrency = (text, record) => {
  return (
    <span>
      {new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(text ?? 0)}
    </span>
  );
};
