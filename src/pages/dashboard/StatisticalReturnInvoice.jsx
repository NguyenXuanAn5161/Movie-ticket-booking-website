import { Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  renderCurrency,
  renderDate,
} from "../../components/FunctionRender/FunctionRender";
import TableHeader from "../../components/TableHeader/TableHeader";
import { callGetRevenueByInvoiceCancel } from "../../services/Statistical";
import { FORMAT_DATE_SEND_SERVER } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";
import { getFirstAndLastDayOfMonth } from "../../utils/date";
import { StatisticByReturnInvoice } from "./RevenueDb";

const StatisticalReturnInvoice = () => {
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
  const [invoiceDetail, setInvoiceDetail] = useState(null);

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
      query += `&startDate=${startDate}&endDate=${endDate}`;
    }

    if (!filter.includes("userCode")) {
      query += `&userCode=`;
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
    const res = await callGetRevenueByInvoiceCancel(query);
    console.log("res", res);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    // dùng query ở trên nhưng thay đổi size thành 5000 để lấy hết dữ liệu
    const queryFull = query.replace("size=10", "size=10000");
    const resFull = await callGetRevenueByInvoiceCancel(queryFull);
    if (res?.content) {
      setListDataFull(resFull.content);
    }

    setIsLoading(false);
  };

  const columns = [
    createColumn("Mã hóa đơn hủy", "code", 150),
    createColumn("Mã hóa đơn", "invoiceCode", 150),
    createColumn("Mã khách hàng", "userCode", 150),
    createColumn("Tên khách hàng", "userName", 150),
    createColumn("Lý do hủy", "reason"),
    createColumn("Ngày hủy", "cancelDate", 150, true, renderDate),
    createColumn("Tổng tiền", "total", 150, true, renderCurrency),
  ];

  const handleReload = () => {
    setFilter("");
    setSortQuery("");
    setCurrent(1);
  };

  const itemSearch = [
    { field: "code", label: "Mã hóa đơn hủy" },
    { field: "userCode", label: "Mã khách hàng" },
    { field: "dateRange", label: "Khoảng thời gian", type: "rangePicker" },
  ];

  const handleExportData = () => {
    StatisticByReturnInvoice(
      listDataFull,
      dateRanger,
      invoiceDetail,
      user?.username
    );
  };

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Thống kê hóa đơn hủy"}
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
      setSortType(sorter.field === "cancelDate" ? "date" : "total");
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

export default StatisticalReturnInvoice;
