import { Button } from "antd";
import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ title, numberBack, type, hiddenEdit }) => {
  // numberBack (-1): back 1 page, ...
  const navigate = useNavigate();

  const isCreatePage = type === "create";
  const isEditPage = type === "edit";

  const currentPathname = window.location.pathname;

  let editPathname;
  if (currentPathname.includes("/show")) {
    const showIndex = currentPathname.indexOf("/show");
    const pathBeforeShow = currentPathname.substring(0, showIndex);
    const userId = currentPathname.substring(showIndex + 6); // Length of "/show" is 5
    editPathname = `${pathBeforeShow}/edit/${userId}`;
  } else {
    editPathname = currentPathname;
  }

  const handleView = () => {
    navigate(editPathname);
  };

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
      <div
        style={{ marginLeft: "auto", display: isCreatePage ? "none" : "flex" }}
      >
        {!hiddenEdit && (
          <Button
            style={{ marginRight: 10, display: isEditPage ? "none" : "flex" }}
            type="primary"
            onClick={() => handleView()}
          >
            Cập nhật
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
