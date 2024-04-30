import { Col, Row } from "antd";
import React from "react";
import { AiOutlinePlus, AiOutlineReload } from "react-icons/ai";
import { CiExport, CiImport, CiMenuBurger } from "react-icons/ci";
import TooltipButton from "../Button/TooltipButton";
import Search from "../InputSearch/Search";
import "./TableHeader.scss";

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

const TableHeader = ({
  headerTitle,
  onReload,
  itemSearch,
  handleSearch,
  setFilter,
  filter,
  create,
  handleExportData,
}) => {
  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        console.log("import");
        break;
      case "2":
        if (handleExportData) {
          handleExportData();
        } else {
          console.log("export");
        }
        break;
      default:
        break;
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <Row className="flex-container">
      <Col span={5} style={{ fontWeight: "700", fontSize: "16" }}>
        {headerTitle}
      </Col>
      <Col
        span={19}
        style={{
          display: "flex",
          gap: "0 20px",
          justifyContent: "flex-end",
        }}
      >
        <Search
          itemSearch={itemSearch}
          handleSearch={handleSearch}
          setFilter={setFilter}
          filter={filter}
        />
        <div
          style={{
            display: "flex",
            gap: "0 10px",
          }}
        >
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
        </div>
      </Col>
    </Row>
  );
};

export default TableHeader;
