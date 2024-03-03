import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ title, numberBack }) => {
  // numberBack (-1): back 1 page, ...
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 16,
        fontSize: 20,
        gap: 10,
      }}
    >
      <IoArrowBack
        style={{ cursor: "pointer" }}
        onClick={() => navigate(numberBack)}
      />
      <span style={{ fontWeight: "700" }}>{title}</span>
    </div>
  );
};

export default PageHeader;
