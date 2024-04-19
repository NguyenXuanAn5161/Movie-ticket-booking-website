import { Tag } from "antd";
import moment from "moment";
import React from "react";
import { FORMAT_DATE_HH_MM_SS } from "../../utils/constant";

const getStatusMap = (type) => {
  switch (type) {
    case "payment":
      return {
        true: { color: "success", label: "Đã thanh toán" },
        false: { color: "error", label: "Chưa thanh toán" },
      };
    case "movie":
      return {
        true: { color: "success", label: "Được chiếu" },
        false: { color: "error", label: "Ngừng chiếu" },
      };
    case "food":
      return {
        true: { color: "success", label: "Có sẵn" },
        false: { color: "error", label: "Không có sẵn" },
      };
    default:
      return {
        true: { color: "success", label: "Hoạt động" },
        false: { color: "error", label: "Không hoạt động" },
      };
  }
};

export const renderStatus = (type) => (text, record) => {
  const statusMap = getStatusMap(type);
  const statusKey = String(record.status);
  const { color, label } = statusMap[statusKey] || {
    color: "default",
    label: "Không xác định",
  };
  return <Tag color={color}>{label}</Tag>;
};

export const renderAddress = (text, record) => {
  return (
    <span>
      {record.address.street}, {record.address.ward}, {record.address.district},{" "}
      {record.address.city}, {record.address.nation}
    </span>
  );
};

export const renderDate = (text, record) => {
  return (
    <span>
      {text ? moment(text).format(FORMAT_DATE_HH_MM_SS) : "Chưa có thông tin"}
    </span>
  );
};

export const renderCurrency = (text, record) => {
  return (
    <span>
      {text !== 0 && text !== null ? (
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text ?? 0)
      ) : (
        <span style={{ color: "red", fontWeight: "700" }}>Chưa tạo giá</span>
      )}
    </span>
  );
};

export const renderTypePrice = (text, record) => {
  return (
    <span>
      {record?.type === "TYPE_SEAT"
        ? "Loại ghế"
        : record?.type === "FOOD"
        ? "Đồ ăn"
        : "Phòng"}
    </span>
  );
};

export const renderPriceName = (text, record) => {
  return (
    <span>
      {record.type === "TYPE_SEAT"
        ? record?.name === "SWEETBOX"
          ? "Ghế đôi"
          : record?.name === "STANDARD"
          ? "Ghế thường"
          : "Ghế vip"
        : record?.name}
    </span>
  );
};

export const renderSeatType = (text, record) => {
  return (
    <span>
      {text === "VIP"
        ? "Ghế vip"
        : text === "STANDARD"
        ? "Ghế thường"
        : "Ghế đôi"}
    </span>
  );
};

export const renderTypePromotion = (text, record) => {
  return (
    <span>
      {record?.typePromotion === "DISCOUNT"
        ? "Giảm Giá"
        : record?.typePromotion === "FOOD"
        ? "Tặng đồ ăn"
        : "Tặng vé"}
    </span>
  );
};
