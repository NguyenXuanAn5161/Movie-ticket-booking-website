import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../components/Button/ActionButtons";
import {
  renderCurrency,
  renderDate,
} from "../../components/FunctionRender/FunctionRender";
import SearchList from "../../components/InputSearch/SearchList";
import TableHeader from "../../components/TableHeader/TableHeader";
import { callGetAllReturnInvoice } from "../../services/apiOder";
import { FORMAT_DATE_SEND_SERVER } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";

const ReturnInvoiceList = () => {
  const navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất

  useEffect(() => {
    fetchData();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  const fetchData = async () => {
    setIsLoading(true);
    let query = `page=${current - 1}&size=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (!filter.includes("code")) {
      query += `&code=`;
    }

    if (!filter.includes("userCode")) {
      query += `&userCode=`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callGetAllReturnInvoice(query);
    console.log("res", res);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  const handleView = (data, url) => {
    console.log("data", data);
    console.log("url", url);
    navigate(`${url}/${data.invoiceId}`);
  };

  const columns = [
    createColumn("Mã hóa đơn hủy", "code", 130, false, undefined, "left"),
    createColumn("Mã hóa đơn", "invoiceCode", 130, false, undefined, "left"),
    createColumn("Mã khách hàng", "userCode", 150),
    createColumn("Họ và tên", "userName", 180),
    createColumn("Số lượng vé", "quantity", 120),
    createColumn("Ngày hóa đơn", "invoiceDate", 150, false, renderDate),
    createColumn("Ngày hủy", "cancelDate", 150, false, renderDate),
    createColumn("Lý do hủy", "reason", 150, false, undefined, "left"),
    createColumn("Tổng tiền", "total", 150, false, renderCurrency),
    {
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <ActionButtons
            record={record}
            handleView={handleView}
            showView={true}
            itemName={"hóa đơn"}
          />
        );
      },
    },
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

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      headerTitle={"Danh sách hóa đơn hủy"}
      showCreate={false}
      showFuncOther={false}
    />
  );

  const handleSearch = (query) => {
    let q = "";
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const label = key;
        const value = query[key];
        if (label === "dateRange") {
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
        <SearchList
          itemSearch={itemSearch}
          handleSearch={handleSearch}
          setFilter={setFilter}
          filter={filter}
        />
      </Col>
      <Col span={24}>
        <Table
          scroll={{
            x: "100%",
            y: "64vh",
          }}
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

export default ReturnInvoiceList;
