import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../components/Button/ActionButtons";
import {
  renderCurrency,
  renderDate,
  renderStatus,
} from "../../components/FunctionRender/FunctionRender";
import SearchList from "../../components/InputSearch/SearchList";
import TableHeader from "../../components/TableHeader/TableHeader";
import { callFetchListCinema } from "../../services/apiCinema";
import { callFetchListMovie } from "../../services/apiMovie";
import { callGetAllOrder } from "../../services/apiOder";
import { callFetchListRoom } from "../../services/apiRoom";
import { callFetchListUser } from "../../services/apiUser";
import { FORMAT_DATE_SEND_SERVER } from "../../utils/constant";
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

  const [cinema, setCinema] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(!cinema);
  }, [cinema]);

  const fetchUserList = async (username) => {
    let query = `size=5&=username${username}`;
    try {
      const res = await callFetchListUser(query);
      const user = res.content.map((data) => ({
        label: data.username,
        value: data.id,
      }));
      return user;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching user:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  const fetchCinemaList = async (cinemaName) => {
    try {
      let query = `size=5&name=${cinemaName}`;
      const res = await callFetchListCinema(query);
      const cinema = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      setCinema(cinema[0]);

      return cinema;
    } catch (error) {
      console.error("Error fetching cinema list:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  const fetchRoomList = async (roomName) => {
    try {
      let query = `size=5&name=${roomName}&cinemaId=${cinema.value}`;
      const res = await callFetchListRoom(query);
      const room = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return room;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching room:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  // tìm phim theo rạp
  const fetchMovieList = async (movieName) => {
    let query = `size=5&cinemaId=${cinema.value}`;

    if (movieName) {
      query += `&name=${movieName}`;
    }

    try {
      const res = await callFetchListMovie(query);
      const movie = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return movie;
    } catch (error) {
      console.error("Error fetching movie list:", error);
      return [];
    }
  };

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

  const handleView = (data, url) => {
    navigate(`${url}/${data.id}`);
  };

  const columns = [
    createColumn("Mã hóa đơn", "code", 130, false, undefined, "left"),
    createColumn("Họ và tên", "userName", 130),
    createColumn("Tên phim", "movieName", 130),
    createColumn("Rạp", "cinemaName", 130),
    createColumn("Trạng thái", "status", 150, false, renderStatus("payment")),
    createColumn("Ngày hóa đơn", "createdDate", 150, false, renderDate),
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
    setCinema(null);
    setCurrent(1);
  };

  const itemSearch = [
    {
      field: "userId",
      label: "Họ và tên",
      type: "debounceSelect",
      fetchOptions: fetchUserList,
    },
    { field: "invoiceCode", label: "Mã hóa đơn" },
    { field: "dateRange", label: "Khoảng thời gian", type: "rangePicker" },
    {
      field: "cinemaId",
      label: "Tên rạp",
      type: "debounceSelect",
      fetchOptions: fetchCinemaList,
    },
    {
      field: "roomId",
      label: "Tên phòng",
      type: "debounceSelect",
      fetchOptions: fetchRoomList,
      disabled: disabled,
    },
    {
      field: "movieId",
      label: "Tên phim",
      type: "debounceSelect",
      fetchOptions: fetchMovieList,
      disabled: disabled,
    },
    {
      field: "showTimeCode",
      label: "Mã lịch chiếu",
    },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      headerTitle={"Danh sách hóa đơn"}
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
        if (label === "roomId") {
          q += `&${label}=${value.value}`;
        } else if (label === "cinemaId") {
          q += `&${label}=${value.value}`;
        } else if (label === "userId") {
          q += `&${label}=${value.value}`;
        } else if (label === "dateRange") {
          q += `&startDate=${value[0].format(
            FORMAT_DATE_SEND_SERVER
          )}&endDate=${value[1].format(FORMAT_DATE_SEND_SERVER)}`;
        } else if (label === "movieId") {
          q += `&${label}=${value.value}`;
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
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <SearchList
            itemSearch={itemSearch}
            handleSearch={handleSearch}
            setFilter={setFilter}
            filter={filter}
            setNull={setCinema}
            maxColumnsPerRow={3}
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
