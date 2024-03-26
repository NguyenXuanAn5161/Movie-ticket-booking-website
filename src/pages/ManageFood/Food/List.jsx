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
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../../components/InputSearch/InputSearch";
import { doSetFood } from "../../../redux/food/foodSlice";
import { callFetchListUser } from "../../../services/api";

// thay đổi #1
const FoodList = () => {
  const data = [
    {
      id: "1",
      code: "item_001",
      image: "path/to/image1.jpg",
      foodName: "Popcorn",
      category_id: "1",
      size: "Medium",
      price: 20000,
      status: "unavailable",
    },
    {
      id: "2",
      code: "item_002",
      image: "path/to/image2.jpg",
      foodName: "Nước ngọt",
      category_id: "1",
      size: "Small",
      price: 45000,
      status: "available",
    },
    {
      id: "3",
      code: "item_003",
      image: "path/to/image3.jpg",
      foodName: "Bánh quy",
      category_id: "2",
      size: "Small",
      price: 30000,
      status: "available",
    },
    {
      id: "4",
      code: "item_004",
      image: "path/to/image4.jpg",
      foodName: "Kẹo cao su",
      category_id: "2",
      size: "Small",
      price: 1.99,
      status: "unavailable",
    },
    {
      id: "5",
      code: "item_005",
      image: "path/to/image5.jpg",
      foodName: "Bắp rang",
      category_id: "3",
      size: "Large",
      price: 6.99,
      status: "available",
    },
    {
      id: "6",
      code: "item_006",
      image: "path/to/image6.jpg",
      foodName: "Kem",
      category_id: "3",
      size: "Small",
      price: 3.99,
      status: "available",
    },
    {
      id: "7",
      code: "item_007",
      image: "path/to/image7.jpg",
      foodName: "Bánh hamburger",
      category_id: "3",
      size: "Small",
      price: 5.99,
      status: "available",
    },
    {
      id: "8",
      code: "item_008",
      image: "path/to/image8.jpg",
      foodName: "Nacho",
      category_id: "3",
      size: "Large",
      price: 7.99,
      status: "available",
    },
    {
      id: "9",
      code: "item_009",
      image: "path/to/image9.jpg",
      foodName: "Nước trái cây",
      category_id: "4",
      size: "Small",
      price: 3.49,
      status: "available",
    },
    {
      id: "10",
      code: "item_010",
      image: "path/to/image10.jpg",
      foodName: "Cốc nước lạnh",
      category_id: "4",
      size: "Large",
      price: 2.99,
      status: "unavailable",
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
      message.success("Xoá đồ ăn thành công!");
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
    dispatch(doSetFood(data));
    navigate(`${url}/${data.id}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      width: 100,
      fixed: "left",
    },
    {
      title: "Tên đồ ăn",
      dataIndex: "foodName",
      sorter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Loại đồ ăn",
      dataIndex: "category",
      width: 150,
      sorter: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 150,
      sorter: true,
      render: (text, record, index) => {
        return (
          <span>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(record?.price ?? 0)}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      sorter: true,
      render: (status) => (
        <Tag color={status === "available" ? "green" : "red"}>
          {status === "available" ? "Có sẵn" : "Hết hàng"}
        </Tag>
      ),
    },
    // {
    //   title: "Cập nhật ngày",
    //   dataIndex: "updatedAt",
    //   width: 150,
    //   render: (text, record, index) => {
    //     return (
    //       <span>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</span>
    //     );
    //   },
    //   sorter: true,
    // },
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
              title={"Xác nhận xóa đồ ăn"}
              description={"Bạn có chắc chắn muốn xóa đồ ăn này?"}
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
      <span style={{ fontWeight: "700", fontSize: "16" }}>Danh sách đồ ăn</span>
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
    { field: "foodName", label: "Tên đồ ăn" },
    { field: "category", label: "Loại đồ ăn" },
    { field: "status", label: "Trạng thái" },
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

export default FoodList;
