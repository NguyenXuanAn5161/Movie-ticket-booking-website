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
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../components/InputSearch/InputSearch";
import { doSetCinema } from "../../redux/cinema/cinemaSlice";
import { callFetchListUser } from "../../services/api";

const CinemaList = () => {
  const addressData = [
    {
      id: "1",
      code: "VN001",
      streetAddress: "123 Đường Lê Lợi",
      district: "Quận 1",
      city: "Thành phố Hồ Chí Minh",
      nation: "Việt Nam",
    },
    {
      id: "2",
      code: "VN002",
      streetAddress: "456 Đường Nguyễn Huệ",
      district: "Quận 1",
      city: "Thành phố Hồ Chí Minh",
      nation: "Việt Nam",
    },
    {
      id: "3",
      code: "VN003",
      streetAddress: "789 Đường Hàng Bài",
      district: "Quận 5",
      city: "Thành phố Hồ Chí Minh",
      nation: "Việt Nam",
    },
  ];

  const cinemaData = [
    {
      id: "1",
      code: "CIN001",
      name: "Galaxy Nguyễn Du",
      totalRoom: 6,
      address_id: "1",
      status: "available",
    },
    {
      id: "2",
      code: "CIN002",
      name: "CGV Parkson",
      totalRoom: 8,
      address_id: "2",
      status: "unavailable",
    },
    {
      id: "3",
      code: "CIN003",
      name: "BHD Quận 5",
      totalRoom: 4,
      address_id: "3",
      status: "available",
    },
  ];

  const mergedData = cinemaData.map((cinema) => {
    const address = addressData.find(
      (address) => address.id === cinema.address_id
    );
    return {
      ...cinema,
      address: address,
    };
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mặc định #2
  const [listData, setListData] = useState(mergedData);
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
      message.success("Xoá rạp thành công!");
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
    dispatch(doSetCinema(data));
    navigate(`${url}/${data.id}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Mã rạp",
      dataIndex: "code",
      width: 100,
      fixed: "left",
    },
    {
      title: "Tên rạp",
      dataIndex: "name",
      sorter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Tổng số phòng",
      dataIndex: "totalRoom",
      width: 150,
      sorter: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 150,
      sorter: true,
      render: (text, record, index) => {
        return (
          <span>
            {record.address.streetAddress}, {record.address.district},{" "}
            {record.address.city}, {record.address.nation}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      sorter: true,
      render: (status) => (
        <Tag color={status === "available" ? "green" : "red"}>
          {status === "available" ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "updatedAt",
      width: 150,
      render: (text, record, index) => {
        return (
          <span>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</span>
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
              title={"Xác nhận xóa rạp phim"}
              description={"Bạn có chắc chắn muốn xóa rạp phim này?"}
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
      <span style={{ fontWeight: "700", fontSize: "16" }}>
        Danh sách rạp chiếu phim
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
    { field: "code", label: "Mã rạp" },
    { field: "cinemaName", label: "Tên rạp" },
    { field: "address", label: "Địa chỉ" },
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

export default CinemaList;
