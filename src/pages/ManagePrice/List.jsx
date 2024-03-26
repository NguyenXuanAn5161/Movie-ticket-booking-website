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
import { doSetPrice } from "../../redux/price/priceSlice";
import { callDeleteUser } from "../../services/api";

const PriceList = () => {
  const data = [
    {
      id: "1",
      code: "priceSeatVip",
      name: "Giá ghế vip",
      description:
        "Giá ghế vip đầu xuân 2024 dành cho khách hàng là thành viên",
      startDate: "2024-01-16",
      endDate: "2024-03-31",
      status: true,
      salePriceDetail: [
        {
          id: "1",
          code: "priceSeatVip1",
          salePriceHeader_id: "1",
          price: 150000,
          list_seat_type_id: ["vip", "sweet"], // example seat types
          list_food_id: null, // example food items
          type_sale: "seat", // or "Food"
        },
        {
          id: "2",
          code: "priceSeatVip2",
          salePriceHeader_id: "1",
          price: 150000,
          list_seat_type_id: ["vip"], // example seat types
          list_food_id: null, // example food items
          type_sale: "seat", // or "Food"
        },
      ],
    },
    {
      id: "2",
      code: "bapRangXuan",
      name: "Bắp rang xuân 2024",
      description: "Bắp rang xuân 2024 ưu đãi dành cho toàn bộ khách hàng",
      startDate: "2024-01-16",
      endDate: "2024-03-31",
      status: false,
      salePriceDetail: [
        {
          id: "2",
          code: "bapRangXuan",
          salePriceHeader_id: "2",
          price: 50000,
          list_seat_type_id: null, // example seat type
          list_food_id: ["popcorn"], // example food item
          type_sale: "food", // or "Seat"
        },
      ],
    },
    {
      id: "3",
      code: "priceSeatVip",
      name: "Giá ghế Vip đầu lễ noel 2023",
      description: "Giá ghế vip nhân dịp lễ noel 2023",
      startDate: "2023-12-30",
      endDate: "2023-12-20",
      status: true,
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
    // const res = await callFetchListUser(query);
    // if (res && res.data) {
    //   setListData(res.data.result);
    //   setTotal(res.data.meta.total);
    // }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteUser(dataId);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Xoá giá sản phẩm thành công!");
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
    dispatch(doSetPrice(data));
    navigate(`${url}/${data.code}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Mã giá sản phẩm",
      dataIndex: "code",
      width: 150,
      fixed: "left",
    },
    {
      title: "Tên giá sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 150,
      fixed: "left",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      width: 120,
      render: (text, record, index) => {
        return <span>{moment(record.startDate).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      width: 130,
      render: (text, record, index) => {
        return <span>{moment(record.endDate).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag color={status ? "success" : "error"}>
          {status ? "Hoạt động" : "Không hoạt động"}
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
              title={"Xác nhận xóa giá sản phẩm"}
              description={"Bạn có chắc chắn muốn xóa giá sản phẩm này?"}
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
      <span style={{ fontWeight: "700", fontSize: "16" }}>
        Danh sách giá sản phẩm
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
    { field: "status", label: "Trạng thái" },
    { field: "start_date", label: "Ngày bắt đầu" },
    { field: "end_date", label: "Ngày kết thúc" },
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

export default PriceList;
