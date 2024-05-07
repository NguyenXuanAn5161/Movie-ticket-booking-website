import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Popconfirm,
  Row,
  Table,
  Tag,
  message,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { doSetCinema } from "../../redux/cinema/cinemaSlice";
import { doSetRoom } from "../../redux/cinema/room/roomSlice";
import { callFetchCinemaById } from "../../services/apiCinema";
import { callDeleteRoom, callFetchListRoom } from "../../services/apiRoom";
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
    if (!cinema) {
      getCinemaById();
    }
  }, [cinema]);

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
      await fetchData();
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
    navigate(`${url}/${data.id}`);
  };

  const columns = [
    {
      title: "Mã phòng",
      dataIndex: "code",
      width: 100,
      fixed: "left",
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      sorter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      width: 80,
    },
    {
      title: "Tổng số ghế",
      dataIndex: "totalSeats",
      width: 100,
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (text, record, index) => {
        return (
          <Tag color={record.status ? "success" : "error"}>
            {record.status ? "Hoạt động" : "Ngừng hoạt động"}
          </Tag>
        );
      },
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "createdDate",
      width: 150,
      render: (text, record, index) => {
        return (
          <span>
            {moment(record.createdDate).format("DD-MM-YYYY HH:mm:ss")}
          </span>
        );
      },
      sorter: true,
    },
    {
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              // thay đổi #1 sửa title và description
              title={"Xác nhận xóa phòng chiếu"}
              description={"Bạn có chắc chắn muốn xóa phòng chiếu này?"}
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteData(record.id)}
            >
              <span>
                <AiOutlineDelete
                  style={{ color: "red", cursor: "pointer", marginRight: 10 }}
                />
              </span>
            </Popconfirm>
            <BsEye
              style={{ cursor: "pointer", marginRight: 10 }}
              onClick={() => handleView(record, "show")}
            />
            <CiEdit
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleView(record, "room/edit");
              }}
            />
          </>
        );
      },
    },
  ];

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* thay đổi #1 */}
      <span style={{ fontWeight: "700", fontSize: "16" }}>
        Danh sách phòng chiếu phim của {cinema?.name}
      </span>
      <span style={{ display: "flex", gap: 15 }}>
        <Button
          icon={<AiOutlinePlus />}
          type="primary"
          onClick={(event) => {
            // Điều hướng đến trang mới và truyền userId qua URL
            navigate(`room/create`);
          }}
        >
          Thêm mới
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setFilter("");
            setSortQuery("");
            setCurrent(1);
          }}
        >
          <AiOutlineReload />
        </Button>
      </span>
    </div>
  );

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
            // loading={isLoading}
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
