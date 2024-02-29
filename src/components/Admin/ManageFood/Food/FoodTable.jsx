import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
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
import React, { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { callDeleteBook, callFetchListBook } from "../../../../services/api";
import { FORMAT_DATE_DISPLAY } from "../../../../utils/constant";
import FoodModalCreate from "./FoodModalCreate";
import FoodModalUpdate from "./FoodModalUpdate";
import FoodViewDetail from "./FoodViewDetal";
import InputSearch from "./InputSearch";
import FoodExport from "./data/FoodExport";

const FoodTable = () => {
  const [listFood, setListFood] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  // const [sortQuery, setSortQuery] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [dataViewDetail, setDataViewDetail] = useState("");
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState("");

  useEffect(() => {
    fetchFood();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  const fetchFood = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await callFetchListBook(query);
    if (res && res.data) {
      setListFood(res.data.result);
      setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  const handleDeleteBook = async (bookId) => {
    const res = await callDeleteBook(bookId);
    if (res && res.data) {
      message.success("Xoá đồ ăn thành công!");
      await fetchFood();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
  };

  // sau này load động cột này
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            href={`food#${record._id}`}
            onClick={() => {
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên đồ ăn",
      dataIndex: "mainText",
      sorter: true,
      filters: [
        {
          text: "update123",
          value: "update123",
        },
        {
          text: "Category 1",
          value: "Category 1",
        },
        {
          text: "Category 2",
          value: "Category 2",
        },
      ],
      filterMode: "menu",
      filterSearch: true,
      onFilter: (value, record) => record.mainText.startsWith(value),
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
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
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "author",
      sorter: true,
      render: (author) => {
        let tagText = author;
        let color = "";
        let icon = null;

        if (author.length > 10) {
          color = "success";
          icon = <CheckCircleOutlined />;
        } else {
          color = "default";
          icon = <CloseCircleOutlined />;
        }

        return (
          <span>
            <Tag icon={icon} color={color} key={tagText}>
              {tagText.toUpperCase()}
            </Tag>
          </span>
        );
      },
      filters: [
        {
          text: "Có sẵn",
          value: "Available",
        },
        {
          text: "Không có sẵn",
          value: "Unavailable",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === "Available") {
          return record.author.length > 10;
        } else if (value === "Unavailable") {
          return record.author.length <= 10;
        }
      },
      // onFilter: (value, record) => record.author.startsWith(value),
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "updatedAt",
      render: (text, record, index) => {
        return (
          <span>{moment(record.updatedAt).format(FORMAT_DATE_DISPLAY)}</span>
        );
      },
      sorter: true,
    },
    {
      title: "Thao tác",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa đồ ăn"}
              description={"Bạn có chắc chắn muốn xóa đồ ăn này?"}
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteBook(record._id)}
            >
              <span>
                <AiOutlineDelete
                  style={{ color: "red", cursor: "pointer", marginRight: 10 }}
                />
              </span>
            </Popconfirm>

            <CiEdit
              style={{ color: "#f57800", cursor: "pointer" }}
              onClick={() => {
                setDataUpdate(record);
                setOpenModalUpdate(true);
              }}
            />
          </>
        );
      },
    },
  ];

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Bảng danh sách đồ ăn</span>
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
          onClick={() => setOpenModalCreate(true)}
        >
          Thêm mới
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setCurrent(1);
            setFilter("");
            setSortQuery("");
          }}
        >
          <AiOutlineReload />
        </Button>
      </span>
    </div>
  );

  const handleSearch = (query) => {
    setFilter(query);
  };

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
          <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            columns={columns}
            dataSource={listFood}
            onChange={onChange}
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

      <FoodModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchFood={fetchFood}
      />

      <FoodViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <FoodExport
        openModalExport={openModalExport}
        setOpenModalExport={setOpenModalExport}
        listFood={listFood}
      />

      <FoodModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        fetchFood={fetchFood}
      />
    </>
  );
};

export default FoodTable;
