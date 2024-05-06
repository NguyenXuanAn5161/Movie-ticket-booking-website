import { Card, Col, Row, Table } from "antd";
import { useEffect, useState } from "react";
import SimpleBarChart from "../../components/Charts/BarChart";
import { renderCurrency } from "../../components/FunctionRender/FunctionRender";
import SearchHeader from "../../components/TableHeader/SearchHeader";
import { callGetRevenueByCinema } from "../../services/Statistical";
import { callFetchListCinema } from "../../services/apiCinema";
import { FORMAT_DATE_SEND_SERVER } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";
import { getFirstAndLastDayOfMonth } from "../../utils/date";
import { StatisticByCinema } from "./RevenueDb";

const StatisticalCinema = () => {
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("ASC");
  const [sortType, setSortType] = useState("total");
  const [cinemas, setCinemas] = useState([]);
  const [dateRanger, setDateRanger] = useState({
    startDate: "",
    endDate: "",
  });
  const [cinema, setCinema] = useState(null);

  useEffect(() => {
    const [startDate, endDate] = getFirstAndLastDayOfMonth();
    setDateRanger({ startDate: startDate, endDate: endDate });
  }, []);

  useEffect(() => {
    getAllCinema();
  }, []);

  const getAllCinema = async () => {
    const response = await callFetchListCinema(0, 1000);
    if (response?.content) {
      const data = response.content.map((data) => ({
        label: data.name,
        value: data.code,
      }));

      setCinemas(data);
    }
  };

  useEffect(() => {
    revenueByCinema();
  }, [current, pageSize, filter, sortQuery, dateRanger, sortType]);

  // khi thay doi current va pageSize thi search died!
  const revenueByCinema = async () => {
    setIsLoading(true);
    let query = `page=${current - 1}&size=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (!filter.includes("startDate") && !filter.includes("endDate")) {
      const [startDate, endDate] = getFirstAndLastDayOfMonth();
      query += `&startDate=${startDate}&endDate=${endDate}`;
    }

    if (!filter.includes("cinemaCode")) {
      query += `&cinemaCode=`;
    }

    if (sortQuery) {
      query += `&sortDirection=${sortQuery}`;
    }

    if (sortType) {
      query += `&sortType=${sortType}`;
    }

    // thay đổi #1 api call
    const res = await callGetRevenueByCinema(query);
    console.log("res", res);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  const columns = [
    createColumn("Rạp", "name"),
    createColumn("Tổng hóa đơn", "totalInvoice"),
    createColumn("Tổng vé", "totalTicket"),
    createColumn("Tổng doanh thu", "totalRevenue", 150, false, renderCurrency),
  ];

  const handleReload = () => {
    setFilter("");
    setSortQuery("");
    setCurrent(1);
  };

  const itemSearch = [
    { field: "cinemaCode", label: "Tên rạp", type: "select", options: cinemas },
    { field: "dateRange", label: "Khoảng thời gian", type: "rangePicker" },
  ];

  const handleExportData = () => {
    StatisticByCinema(listData, dateRanger, cinema);
  };

  const renderHeader = () => (
    <SearchHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Doanh thu theo rạp"}
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
          setCinema(value);
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
        <Card>{renderHeader()}</Card>
      </Col>
      <Col span={24}>
        <Card>
          <SimpleBarChart data={listData} />
        </Card>
      </Col>
      <Col span={24}>
        <Table
          scroll={{
            x: "100%",
            y: "100%",
          }}
          style={{ width: "100%", height: "100%" }}
          title={() => "Doanh thu theo rạp"}
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

export default StatisticalCinema;
