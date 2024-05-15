import { Tag } from "antd";
import moment from "moment";
import React from "react";
import { FORMAT_DATE, FORMAT_DATE_HHmm } from "../../utils/constant";

const getStatusMap = (type) => {
  switch (type) {
    case "payment":
      return {
        true: { color: "success", label: "Đã thanh toán" },
        false: { color: "default", label: "Đã hủy" },
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
  const statusKey = String(text);
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
      {text ? moment(text).format(FORMAT_DATE_HHmm) : "Chưa có thông tin"}
    </span>
  );
};

export const renderDateOnly = (text, record) => {
  return (
    <span>{text ? moment(text).format(FORMAT_DATE) : "Chưa có thông tin"}</span>
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
        <span style={{ color: "red", fontWeight: "700" }}>Chưa có giá</span>
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

export const renderPromotionType = (text, record) => {
  return (
    <span>
      {record?.promotionType === "DISCOUNT"
        ? "Giảm Giá"
        : record?.promotionType === "FOOD"
        ? "Tặng đồ ăn"
        : "Tặng vé"}
    </span>
  );
};

export const renderQuantity = (text, record) => {
  return (
    <span>
      {record?.quantity === 0 ? (
        <span style={{ color: "red", fontWeight: "700" }}>Hết hàng</span>
      ) : record?.quantity === null ? (
        <Tag color="default">Chưa có thông tin</Tag>
      ) : (
        record?.quantity
      )}
    </span>
  );
};

export const renderGender = (text, record) => {
  return <span>{record?.gender === true ? "Nam" : "Nữ"}</span>;
};

export const renderPhone = (text, record) => {
  return <span>{record?.phone || "Chưa có thông tin"}</span>;
};
