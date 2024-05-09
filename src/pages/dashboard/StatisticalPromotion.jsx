import { Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  renderDate,
  renderPromotionType,
} from "../../components/FunctionRender/FunctionRender";
import TableHeader from "../../components/TableHeader/TableHeader";
import { callGetRevenueByPromotion } from "../../services/Statistical";
import { FORMAT_DATE_SEND_SERVER } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";
import { getFirstAndLastDayOfMonth } from "../../utils/date";
import { StatisticByPromotion } from "./RevenueDb";

const StatisticalPromotion = () => {
  const user = useSelector((state) => state.account.user);

  const [listData, setListData] = useState([]);
  const [listDataFull, setListDataFull] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("DESC");
  const [sortType, setSortType] = useState("total");
  const [dateRanger, setDateRanger] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const [startDate, endDate] = getFirstAndLastDayOfMonth();
    setDateRanger({ startDate: startDate, endDate: endDate });
  }, []);

  useEffect(() => {
    revenueByUser();
  }, [current, pageSize, filter, sortQuery, dateRanger]);

  // khi thay doi current va pageSize thi search died!
  const revenueByUser = async () => {
    setIsLoading(true);
    let query = `page=${current - 1}&size=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (!filter.includes("startDate") && !filter.includes("endDate")) {
      const [startDate, endDate] = getFirstAndLastDayOfMonth();
      // query += `&startDate=${startDate}&endDate=${endDate}`;
      query += `&startDate=2024-04-01&endDate=${endDate}`;
    }

    if (!filter.includes("promotionLineCode")) {
      query += `&promotionLineCode=`;
    }

    if (!filter.includes("code")) {
      query += `&code=`;
    }

    if (sortQuery) {
      query += `&sortDirection=${sortQuery}`;
    }

    if (sortType) {
      query += `&sortType=${sortType}`;
    }

    // thay đổi #1 api call
    const res = await callGetRevenueByPromotion(query);
    console.log("res", res);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    const queryFull = query.replace("size=10", "size=10000");
    const resFull = await callGetRevenueByPromotion(queryFull);
    if (res?.content) {
      setListDataFull(resFull.content);
    }

    setIsLoading(false);
  };

  const columns = [
    createColumn("Mã CTKM", "code", 150, false, undefined, "left"),
    createColumn("Tên CTKM", "name", 150, false, undefined, "left"),
    createColumn("Ngày bắt đầu", "startDate", 150, true, renderDate),
    createColumn("Ngày kết thúc", "endDate", 150, false, renderDate),
    createColumn("Loại", "promotionType", 130, false, renderPromotionType),
    createColumn("Tổng số lượng", "totalQuantity", 150, false),
    createColumn("Đã dùng", "quantityUsed", 150, true),
    createColumn("Còn lại", "quantityNotUsed", 150, false, undefined, "right"),
  ];

  const handleReload = () => {
    setFilter("");
    setSortQuery("");
    setCurrent(1);
  };

  const itemSearch = [
    { field: "promotionLineCode", label: "Mã chương trình khuyến mãi" },
    { field: "dateRange", label: "Khoảng thời gian", type: "rangePicker" },
  ];

  const handleExportData = () => {
    StatisticByPromotion(listDataFull, dateRanger, user?.username);
  };

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Thống kê chương trình khuyến mãi"}
      itemSearch={itemSearch}
      handleExportData={handleExportData}
    />
  );

  const handleSearch = (query) => {
    let q = "";
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const label = key;
        const value = query[key];
        if (label === "dateRange") {
          setDateRanger({
            startDate: value[0].format(FORMAT_DATE_SEND_SERVER),
            endDate: value[1].format(FORMAT_DATE_SEND_SERVER),
          });
          q += `&startDate=${value[0].format(
            FORMAT_DATE_SEND_SERVER
          )}&endDate=${value[1].format(FORMAT_DATE_SEND_SERVER)}`;
        } else if (value) {
          q += `&${label}=${value}`;
        }
      }
    }
    setFilter(q);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    console.log("sorter", sorter);
    if (sorter) {
      if (sorter.order === "ascend") {
        setSortQuery("ASC");
      } else if (sorter.order === "descend") {
        setSortQuery("DESC");
      }
      setSortType(
        sorter.field === "totalQuantity"
          ? "total"
          : sorter.field === "quantityUsed"
          ? "quantityUsed"
          : "date"
      );
    }
  };

  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Table
          scroll={{
            x: "100%",
            y: "64vh",
          }}
          style={{ width: "100%", height: "100%" }}
          title={renderHeader}
          bordered
          loading={isLoading}
          columns={columns}
          dataSource={listData}
          onChange={onChange}
          rowKey="id"
          pagination={{
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            total: total,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} trên {total} dòng
                </div>
              );
            },
          }}
        />
      </Col>
    </Row>
  );
};

export default StatisticalPromotion;
