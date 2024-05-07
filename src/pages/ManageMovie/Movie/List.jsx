import { Col, Row, Table, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../../components/Button/ActionButtons";
import {
  renderDate,
  renderStatus,
} from "../../../components/FunctionRender/FunctionRender";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { doSetMovieGenre } from "../../../redux/movie/movieGenreSlice";
import { doSetMovie } from "../../../redux/movie/movieSlice";
import {
  callDeleteMovie,
  callFetchListGenreMovie,
  callFetchListMovie,
} from "../../../services/apiMovie";
import { createColumn } from "../../../utils/createColumn";

const MovieList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movieGenre = useSelector((state) => state.movieGenre.movieGenre);
  // mặc định #2
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất

  useEffect(() => {
    fetchDataGenre();
  }, []);

  const fetchDataGenre = async () => {
    setIsLoading(true);
    let query = `&size=100`;
    const res = await callFetchListGenreMovie(query);
    if (res?.content) {
      const data = res.content.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      dispatch(doSetMovieGenre(data));
    }

    setIsLoading(false);
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

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callFetchListMovie(query);
    console.log("res", res);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteMovie(dataId);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá phim thành công!");
      setCurrent(1);
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
    dispatch(doSetMovie(data));
    navigate(`${url}/${data.id}`);
  };

  const columns = [
    createColumn("Tên phim", "name", 250, "left"),
    createColumn("Đạo diễn", "director", 150),
    createColumn("Diễn viên", "cast"),
    createColumn("Ngày sản xuất", "releaseDate", 150, undefined, renderDate),
    createColumn("Trạng thái", "status", 150, undefined, renderStatus("movie")),
    createColumn("Cập nhật ngày", "createdDate", 150, undefined, renderDate),
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
            showDelete={true}
            showEdit={true}
            showView={true}
            itemName={"phim"}
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
    { field: "name", label: "Tên phim" },
    {
      field: "genreId",
      label: "Thể loại",
      type: "select",
      options: movieGenre,
    },
    { field: "cinemaId", label: "Rạp" },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Danh sách phim"}
      itemSearch={itemSearch}
      create={handleToPageCreate}
    />
  );

  // mặc định #2
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

  // mặc định #2
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
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
          <Table
            scroll={{
              x: "100%",
              y: "64vh",
            }}
            title={renderHeader}
            bordered
            // thay đổi #1
            // loading={isLoading}
            columns={columns}
            dataSource={listData}
            onChange={onChange}
            // thay đổi #1
            rowKey="_id"
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

export default MovieList;
