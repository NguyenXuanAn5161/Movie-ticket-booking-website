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
import {
  callDeleteSalePrice,
  callFetchListSalePrice,
} from "../../services/apiPrice";

const PriceList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mặc định #2
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    let query = `page=${current - 1}&size=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callFetchListSalePrice(query);
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
    const res = await callDeleteSalePrice(dataId);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá giá sản phẩm thành công!");
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
    dispatch(doSetPrice(data));
    navigate(`${url}/${data.id}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Mã giá",
      dataIndex: "code",
      width: 150,
      fixed: "left",
    },
    {
      title: "Tên giá",
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
        return (
          <span>{moment(record.startDate).format("DD-MM-YYYY HH:mm:ss")}</span>
        );
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      width: 130,
      render: (text, record, index) => {
        return (
          <span>{moment(record.endDate).format("DD-MM-YYYY HH:mm:ss")}</span>
        );
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
    // trạng thái
    { field: "code", label: "Mã khuyến mãi" },
    { field: "startDate", label: "Ngày bắt đầu" },
    { field: "endDate", label: "Ngày kết thúc" },
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
