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
import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../../../components/InputSearch/InputSearch";
import { doSetSeat } from "../../../../redux/seat/seatSlice";
import { callDeleteUser, callFetchListUser } from "../../../../services/api";

const SeatList = () => {
  const data = [
    {
      id: "1",
      code: "A1",
      isBooked: false,
      type_seat: {
        name: "Ghế đôi",
        price: 120000,
      },
      seatRow: 1,
      seatColumn: 1,
      room_id: "phòng 1",
    },
    {
      id: "2",
      code: "A2",
      isBooked: true,
      type_seat: {
        name: "Ghế vip",
        price: 80000,
      },
      seatRow: 1,
      seatColumn: 2,
      room_id: "phòng 1",
    },
    {
      id: "3",
      code: "B1",
      isBooked: false,
      type_seat: {
        name: "Ghế bình thường",
        price: 40000,
      },
      seatRow: 2,
      seatColumn: 1,
      room_id: "phòng 1",
    },
    {
      id: "4",
      code: "B2",
      isBooked: false,
      type_seat: {
        name: "Ghế vip",
        price: 80000,
      },
      seatRow: 2,
      seatColumn: 2,
      room_id: "phòng 1",
    },
    {
      id: "5",
      code: "C1",
      isBooked: true,
      type_seat: {
        name: "Ghế bình thường",
        price: 40000,
      },
      seatRow: 3,
      seatColumn: 1,
      room_id: "phòng 2",
    },
    {
      id: "6",
      code: "C2",
      isBooked: false,
      type_seat: {
        name: "Ghế bình thường",
        price: 40000,
      },
      seatRow: 3,
      seatColumn: 2,
      room_id: "phòng 2",
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mặc định #2
  const [listData, setListData] = useState(data);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalExport, setOpenModalExport] = useState(false);

  // mặc định #2
  useEffect(() => {
    fetchData();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  // mặc định #2
  const fetchData = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    // thay đổi #1 api call
    const res = await callFetchListUser(query);
    if (res && res.data) {
      // setListData(res.data.result);
      // setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteUser(dataId);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Xoá loại ghế thành công!");
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
    dispatch(doSetSeat(data));
    navigate(`${url}/${data.id}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Mã ghế",
      dataIndex: "code",
      width: 100,
      fixed: "left",
    },
    {
      title: "Loại ghế",
      dataIndex: "name",
      sorter: true,
      width: 100,
      fixed: "left",
      render: (text, record, index) => {
        return <span>{record.type_seat.name}</span>;
      },
    },
    {
      title: "Thuộc phòng",
      dataIndex: "room_id",
      width: 150,
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "isBooked",
      width: 100,
      render: (text, record, index) => {
        return (
          <Tag color={record?.isBooked ? "success" : "error"}>
            {record?.isBooked ? "Đã đặt" : "Chưa đặt"}
          </Tag>
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
              title={"Xác nhận xóa ghế"}
              description={"Bạn có chắc chắn muốn xóa ghế này?"}
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
            <BsEye
              style={{ cursor: "pointer", marginRight: 10 }}
              onClick={() => handleView(record, "show")}
            />
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
      <span style={{ fontWeight: "700", fontSize: "16" }}>Danh sách ghế</span>
      <span style={{ display: "flex", gap: 15 }}>
        <Button
          icon={<AiOutlineExport />}
          type="primary"
          onClick={() => setOpenModalExport(true)}
        >
          Export
        </Button>
        <Button
          icon={<AiOutlineImport />}
          type="primary"
          onClick={() => setOpenModalImport(true)}
        >
          Import
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
    setFilter(query);
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
    { field: "code", label: "Mã ghế" },
    { field: "room_id", label: "Ghế thuộc phòng" },
    { field: "isBooked", label: "Trạng thái" },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch itemSearch={itemSearch} handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            scroll={{
              x: "100%",
              y: 200,
            }}
            title={renderHeader}
            bordered
            // thay đổi #1
            // loading={isLoading}
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

export default SeatList;
