import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../components/Button/ActionButtons";
import {
  renderCurrency,
  renderDate,
  renderStatus,
} from "../../components/FunctionRender/FunctionRender";
import TableHeader from "../../components/TableHeader/TableHeader";
import { doSetUser } from "../../redux/account/userSlice";
import { callGetAllOrder } from "../../services/apiOder";
import { createColumn } from "../../utils/createColumn";
import ModalCancel from "./ModalCancel";

const OrderList = () => {
  const navigate = useNavigate();

  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [showModal, setShowModal] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");

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

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callGetAllOrder(query);
    console.log("res", res);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  const handleModal = (invoiceId) => {
    setShowModal(true);
    setInvoiceId(invoiceId);
  };

  const dispatch = useDispatch();

  const handleView = (user, url) => {
    dispatch(doSetUser(user));
    navigate(`${url}/${user.id}`);
  };

  const columns = [
    createColumn("Mã hóa đơn", "code", 130, false, undefined, "left"),
    createColumn("Họ và tên", "userName", 130),
    createColumn("Tên phim", "movieName", 130),
    createColumn("Rạp", "cinemaName", 130),
    createColumn("Trạng thái", "status", 150, false, renderStatus("payment")),
    createColumn("Ngày hóa đơn", "createdDate", 150, false, renderDate),
    // createColumn("Ngày hủy", "cancelledDate", 150, false, renderDate),
    createColumn("Tổng tiền", "totalPrice", 150, false, renderCurrency),
    createColumn("Nhân viên", "staffName", "right"),
    {
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            <span>
              <AiOutlineDelete
                onClick={() => handleModal(record.id)}
                style={{ color: "red", cursor: "pointer", marginRight: 10 }}
              />
            </span>
            <ActionButtons
              record={record}
              handleView={handleView}
              showView={true}
              itemName={"hóa đơn"}
            />
          </>
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
    { field: "userId", label: "Họ tên" },
    {
      field: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: "true", label: "Đã thanh toán" },
        { value: "false", label: "Chưa thanh toán" },
      ],
    },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Danh sách hóa đơn"}
      itemSearch={itemSearch}
    />
  );

  const handleSearch = (query) => {
    let q = "";
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const label = key;
        const value = query[key];
        if (value) {
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
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table
            scroll={{
              x: "100%",
              y: 280,
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
      <ModalCancel
        fetchData={fetchData}
        openModal={showModal}
        setOpenModal={setShowModal}
        invoiceId={invoiceId}
      />
    </>
  );
};

export default OrderList;
