import {
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Table,
  Tag,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ActionButtons from "../../components/Button/ActionButtons";
import {
  renderDate,
  renderStatus,
} from "../../components/FunctionRender/FunctionRender";
import PageHeader from "../../components/PageHeader/PageHeader";
import TableHeader from "../../components/TableHeader/TableHeader";
import { doSetCinema } from "../../redux/cinema/cinemaSlice";
import { doSetRoom } from "../../redux/cinema/room/roomSlice";
import { callFetchCinemaById } from "../../services/apiCinema";
import { callDeleteRoom, callFetchListRoom } from "../../services/apiRoom";
import { createColumn } from "../../utils/createColumn";
import {
  getErrorMessageCinema,
  getErrorMessageRoom,
} from "../../utils/errorHandling";

const CinemaShow = () => {
  const { cinemaId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // thay đổi #1
  const cinema = useSelector((state) => state.cinema.cinema);
  // fetch lai data cinema khi f5
  useEffect(() => {
    getCinemaById();
  }, []);

  const getCinemaById = async () => {
    const res = await callFetchCinemaById(cinemaId);
    if (res?.data) {
      dispatch(doSetCinema(res.data));
    } else {
      const error = getErrorMessageCinema(res.response.data.message, {
        id: cinemaId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  const [listDataRoom, setListDataRoom] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất

  useEffect(() => {
    if (cinema) {
      fetchData();
    }
  }, [current, pageSize, filter, sortQuery, cinema]);

  // khi thay doi current va pageSize thi search died!
  // mặc định #2
  const fetchData = async () => {
    setIsLoading(true);
    let query = `page=${current - 1}&size=${pageSize}&cinemaId=${cinema?.id}`;
    if (filter) {
      query += `${filter}`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callFetchListRoom(query);
    if (res?.content) {
      setListDataRoom(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteRoom(dataId);
    console.log("res: ", res);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá phòng thành công!");
      await getCinemaById();
    } else {
      const error = getErrorMessageRoom(res.response.data.message, {
        id: dataId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  const item = [
    { label: "Mã rạp phim", children: cinema?.code },
    {
      label: "Tên rạp phim",
      children: cinema?.name,
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={cinema?.status ? "success" : "error"}>
          {cinema?.status ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      label: "Tổng số phòng",
      children: cinema?.totalRoom,
    },
    {
      label: "Địa chỉ",
      children: (
        <span>
          {cinema?.address.street}, {cinema?.address.district},{" "}
          {cinema?.address.city}, {cinema?.address.nation}
        </span>
      ),
    },
  ];

  // danh sách phòng

  const handleView = (data, url) => {
    // thay đổi #1
    dispatch(doSetRoom(data));
    navigate(`room/${url}/${data.id}`);
  };

  const columns = [
    createColumn("Mã phòng", "code", 100, false, undefined, "left"),
    createColumn("Tên phòng", "name", 100, false, undefined, "left"),
    createColumn("Loại phòng", "type", 80),
    createColumn("Tổng số ghế", "totalSeats", 100),
    createColumn("Trạng thái", "status", 100, false, renderStatus()),
    createColumn("Cập nhật ngày", "createdDate", 100, false, renderDate),
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
            showView={false}
            itemName={"phòng chiếu"}
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
    navigate(`room/create`);
  };

  const itemSearch = [{ field: "code", label: "Mã phòng" }];

  // Danh sách phòng chiếu phim của {cinema?.name}
  const renderHeader = () => (
    <TableHeader
      headerTitle={`Danh sách phòng chiếu phim của {cinema?.name}`}
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      itemSearch={itemSearch}
      create={handleToPageCreate}
      showFuncOther={false}
    />
  );

  // mặc định #2
  const handleSearch = (query) => {
    console.log("query", query);
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
      <PageHeader title="Xem chi tiết rạp phim" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin rạp phim" bordered={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Descriptions
              labelStyle={{ color: "#333", fontWeight: "700" }}
              layout="vertical"
              bordered
              size="small"
              column={{
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 4,
              }}
              items={item}
            />
          </Col>
        </Row>
        <br />
        <Col span={24}>
          <Table
            scroll={{
              x: "100%",
              y: "64vh",
            }}
            title={renderHeader}
            bordered
            // thay đổi #1
            loading={isLoading}
            columns={columns}
            dataSource={listDataRoom}
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
      </Card>
      {/* </div> */}
    </>
  );
};

export default CinemaShow;
