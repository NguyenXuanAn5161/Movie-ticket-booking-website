import { Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import SimpleBarChart from "../../components/Charts/BarChart";
import { renderDate } from "../../components/FunctionRender/FunctionRender";
import TableHeader from "../../components/TableHeader/TableHeader";
import { callGetRevenueByInvoiceCancel } from "../../services/Statistical";
import { FORMAT_DATE_SEND_SERVER } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";
import { getFirstAndLastDayOfMonth } from "../../utils/date";
import { StatisticByReturnInvoice } from "./RevenueDb";

const RevenueDbByInvoiceCancel = () => {
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("ASC");
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

    // thay đổi #1 api call
    const res = await callGetRevenueByInvoiceCancel(query);
    console.log("res", res);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  const columns = [
    createColumn("Mã hóa đơn hủy", "code"),
    createColumn("Mã hóa đơn", "invoiceCode"),
    createColumn("Mã khách hàng", "userCode"),
    createColumn("Tên khách hàng", "userName"),
    createColumn("Lý do hủy", "reason"),
    createColumn("Ngày hủy", "cancelDate", 150, true, renderDate),
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
    StatisticByReturnInvoice(listData, dateRanger, invoiceDetail);
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
  };

  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Table
          scroll={{
            x: "100%",
            y: "100%",
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
      <SimpleBarChart data={listData} type={"returnInvoce"} />
    </Row>
  );
};

export default RevenueDbByInvoiceCancel;