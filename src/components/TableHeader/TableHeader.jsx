import { Col, Row, message } from "antd";
import React from "react";
import { AiOutlinePlus, AiOutlineReload } from "react-icons/ai";
import { CiExport, CiImport, CiMenuBurger } from "react-icons/ci";
import TooltipButton from "../Button/TooltipButton";
import Search from "../InputSearch/Search";
import "./TableHeader.scss";

const handleMenuClick = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const items = [
  {
    label: "Import",
    key: "1",
    icon: <CiImport />,
  },
  {
    label: "Export",
    key: "2",
    icon: <CiExport />,
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

const TableHeader = ({
  headerTitle,
  onReload,
  itemSearch,
  handleSearch,
  setFilter,
  filter,
  create,
}) => {
  return (
    <Row className="flex-container">
      <Col span={8} style={{ fontWeight: "700", fontSize: "16" }}>
        {headerTitle}
      </Col>
      <Col
        span={16}
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <Search
          itemSearch={itemSearch}
          handleSearch={handleSearch}
          setFilter={setFilter}
          filter={filter}
        />
        <TooltipButton
          icon={<AiOutlinePlus />}
          tooltipTitle="Thêm mới"
          onClick={create}
        />
        <TooltipButton
          icon={<AiOutlineReload />}
          tooltipTitle="Tải lại"
          onClick={onReload}
        />
        <TooltipButton
          icon={<CiMenuBurger />}
          tooltipTitle="Chức năng khác"
          trigger={"hover"}
          dropdown={menuProps}
        />
      </Col>
    </Row>
  );
};

export default TableHeader;
