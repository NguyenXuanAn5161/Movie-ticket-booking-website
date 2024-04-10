import {
  Button,
  Col,
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
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../../components/InputSearch/InputSearch";
import { doSetSchedule } from "../../../redux/schedule/scheduleSlice";
import { callFetchListShowtime } from "../../../services/apiShowTime";

const ScheduleList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mặc định #2
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [openModalExport, setOpenModalExport] = useState(false);

  // mặc định #2
  useEffect(() => {
    fetchData();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  // mặc định #2
  const fetchData = async () => {
    setIsLoading(true);
    let query = `page=${current - 1}&size=${pageSize}`;

    if (!filter) {
      query += `&cinemaId=7&movieId=1`;
    }

    if (filter) {
      query += `&${filter}`;
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
    const res = await callDeleteUser(dataId);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Xoá phim thành công!");
      await fetchData();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
  };

  const handleView = (data, url) => {
    // thay đổi #1
    dispatch(doSetSchedule(data));
    navigate(`${url}/${data.id}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Tên phim",
      // dataIndex: "name",
      dataIndex: "movieId",
      sorter: true,
      width: 200,
      fixed: "left",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "showDate",
      width: 150,
      sorter: true,
      // render: (showTimes) => {
      //   if (showTimes && showTimes.length > 0) {
      //     const renderShowTimes = showTimes.map((showTime, index) => (
      //       <Col
      //         key={showTime.id}
      //         style={{ marginBottom: showTimes.length > 2 ? 5 : null }}
      //       >
      //         <Tag>{showTime.show_date}</Tag>
      //       </Col>
      //     ));

      //     return <Row gutter={[8, 8]}>{renderShowTimes}</Row>;
      //   } else {
      //     return <span>Chưa có lịch chiếu</span>; // Trường hợp không có lịch chiếu
      //   }
      // },
    },
    {
      title: "Giờ chiếu",
      dataIndex: "showTime",
      width: 150,
      sorter: true,
    },
    {
      title: "Rạp chiếu",
      dataIndex: "cinemaId",
      width: 150,
    },
    {
      title: "Phòng chiếu",
      dataIndex: "roomId",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (text, record, index) => {
        return (
          <Tag color={record.status ? "success" : "error"}>
            {record.status ? "Được chiếu" : "Ngừng chiếu"}
          </Tag>
        );
      },
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "createdDate",
      width: 150,
      sorter: true,
      render: (text, record, index) => {
        return (
          <span>
            {moment(record.createdDate).format("DD-MM-YYYY HH:mm:ss")}
          </span>
        );
      },
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
              title={"Xác nhận xóa phim"}
              description={"Bạn có chắc chắn muốn xóa phim này?"}
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteData(record._id)}
            >
              <span>
                <AiOutlineDelete
                  style={{ color: "red", cursor: "pointer", marginRight: 10 }}
                />
              </span>
            </Popconfirm>
            {/* <BsEye
              style={{ cursor: "pointer", marginRight: 10 }}
              onClick={() => handleView(record, "show")}
            /> */}
            <CiEdit
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleView(record, "edit");
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
        Danh sách lịch chiếu theo từng phim
      </span>
      <span style={{ display: "flex", gap: 15 }}>
        <Button
          icon={<AiOutlineExport />}
          type="primary"
          onClick={() => setOpenModalExport(true)}
        >
          Export
        </Button>
        <Button
          icon={<AiOutlinePlus />}
          type="primary"
          onClick={(event) => {
            // Điều hướng đến trang mới và truyền userId qua URL
            navigate(`create`);
          }}
        >
          Thêm mới
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setFilter("");
            setSortQuery("");
          }}
        >
          <AiOutlineReload />
        </Button>
      </span>
    </div>
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

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  // thay đổi #1
  const itemSearch = [
    { field: "cinemaId", label: "Tên rạp" },
    { field: "movieId", label: "Tên phim" },
    { field: "date", label: "Ngày chiếu" },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch
            itemSearch={itemSearch}
            handleSearch={handleSearch}
            setFilter={setFilter}
          />
        </Col>
        <Col span={24}>
          <Table
            locale={{ emptyText: "Không có dữ liệu" }}
            scroll={{
              x: "100%",
              y: 280,
            }}
            title={renderHeader}
            bordered
            // thay đổi #1
            // loading={isLoading}
            columns={columns}
            dataSource={listData}
            onChange={onChange}
            // thay đổi #1
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
    </>
  );
};

export default ScheduleList;
