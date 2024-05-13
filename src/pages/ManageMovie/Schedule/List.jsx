import { Col, Row, Table, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../../components/Button/ActionButtons";
import {
  renderDate,
  renderStatus,
} from "../../../components/FunctionRender/FunctionRender";
import SearchList from "../../../components/InputSearch/SearchList";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { doSetSchedule } from "../../../redux/schedule/scheduleSlice";
import { callFetchListCinema } from "../../../services/apiCinema";
import { callFetchListMovie } from "../../../services/apiMovie";
import {
  callDeleteShowtime,
  callFetchListShowtime,
} from "../../../services/apiShowTime";
import { FORMAT_DATE_SEND_SERVER } from "../../../utils/constant";
import { createColumn } from "../../../utils/createColumn";

const ScheduleList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;
  const checked = userRoles?.some((role) => role === "ROLE_ADMIN");

  // mặc định #2
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [listCinema, setListCinema] = useState([]);
  const [listMovie, setListMovie] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleSelectedMovie = () => {
    if (filter.includes("movieId")) {
      const movieId = filter.split("=")[1].split("&")[0];
      const movie = listMovie.find((item) => item.value == movieId);
      setSelectedMovie(movie?.label);
    } else {
      const movieId1 = listMovie.find((item) => item.value === 1);
      setSelectedMovie(movieId1?.label);
    }
  };

  const handleSelectedCinema = () => {
    if (filter.includes("cinemaId")) {
      const cinemaId = filter.split("=")[1].split("&")[0];
      const cinema = listCinema.find((item) => item.value == cinemaId);
      console.log("cinema", cinema);
      setSelectedCinema(cinema?.label);
    } else {
      const cinemaId1 = listCinema.find((item) => item.value === 1);
      setSelectedCinema(cinemaId1?.label);
    }
  };

  useEffect(() => {
    handleSelectedCinema();
    handleSelectedMovie();
  }, [filter]);

  useEffect(() => {
    fetchListCinema();
  }, []);

  const fetchListCinema = async () => {
    let query = `page=0&size=1000`;
    const res = await callFetchListCinema(query);
    if (res?.content) {
      const cinemas = res.content.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setListCinema(cinemas);
      // lấy ra rạp có id là 1
      const cinemaId1 = cinemas.find((item) => item.value === 1);
      setSelectedCinema(cinemaId1.label);
    }
  };

  useEffect(() => {
    fetchListMovie();
  }, []);

  const fetchListMovie = async () => {
    let query = `page=0&size=1000`;
    const res = await callFetchListMovie(query);
    if (res?.content) {
      const movies = res.content.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setListMovie(movies);
      // lấy ra movie có id là 1
      const movieId1 = movies.find((item) => item.value === 1);
      setSelectedMovie(movieId1.label);
    }
  };

  // mặc định #2
  useEffect(() => {
    fetchData();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  // mặc định #2
  const fetchData = async () => {
    setIsLoading(true);
    let query = `page=${current - 1}&size=${pageSize}`;

    if (filter) {
      query += `&${filter}`;
    }

    if (!filter.includes("cinemaId")) {
      query += `&cinemaId=1`;
    }

    if (!filter.includes("movieId")) {
      query += `&movieId=1`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callFetchListShowtime(query);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteShowtime(dataId);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá lịch chiếu thành công!");
      await fetchData();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  const handleView = (data, url) => {
    // thay đổi #1
    dispatch(doSetSchedule(data));
    navigate(`${url}/${data.id}`);
  };

  const columns = [
    createColumn("Tên phim", "movieName", 200, false, undefined, "left"),
    createColumn("Ngày chiếu", "showDate", 150, false, renderDate),
    createColumn("Giờ chiếu", "showTime"),
    createColumn("Rạp chiếu", "cinemaName"),
    createColumn("Phòng chiếu", "roomName"),
    createColumn("Trạng thái", "status", 150, false, renderStatus()),
    createColumn("Cập nhật ngày", "createdDate", 150, false, renderDate),
    {
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <ActionButtons
            record={record}
            handleDelete={handleDeleteData}
            handleView={handleView}
            showDelete={checked}
            showEdit={checked}
            showView={true}
            itemName={"lịch chiếu"}
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

  const handleToPageCreate = () => {
    navigate(`create`);
  };

  // fix tìm động rạp
  const itemSearch = [
    {
      field: "cinemaId",
      label: "Tên rạp",
      type: "select",
      options: listCinema,
    },
    {
      field: "movieId",
      label: "Tên phim",
      type: "select",
      options: listMovie,
    },
    { field: "date", label: "Ngày chiếu", type: "datePicker" },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      headerTitle={
        <>
          Danh sách lịch chiếu{" "}
          <span style={{ color: "#E38601" }}>{selectedMovie}</span> tại{" "}
          <span style={{ color: "#E38601" }}>{selectedCinema}</span>
        </>
      }
      create={handleToPageCreate}
      showCreate={checked}
      showFuncOther={false}
    />
  );

  // mặc định #2
  const handleSearch = (query) => {
    let q = "";
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const label = key;
        const value = query[key];
        if (label === "date") {
          console.log("value", value);
          q += `&date=${value.format(FORMAT_DATE_SEND_SERVER)}`;
        } else if (value) {
          q += `&${label}=${value}`;
        }
      }
    }
    console.log("q", q);
    setFilter(q);
  };

  // mặc định #2
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter?.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
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
            // thay đổi #1
            rowKey="code"
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
    </>
  );
};

export default ScheduleList;
