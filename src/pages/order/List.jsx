import { Col, Popconfirm, Row, Table, Tag, message, notification } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserExport from "../../components/Admin/User/data/UserExport";
import UserImport from "../../components/Admin/User/data/UserImport";
import TableHeader from "../../components/TableHeader/TableHeader";
import { doSetUser } from "../../redux/account/userSlice";
import { callDeleteUser, callFetchListUser } from "../../services/apiMovie";
import { getErrorMessageUser } from "../../utils/errorHandling";

const OrderList = () => {
  const navigate = useNavigate();

  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalExport, setOpenModalExport] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  const fetchUser = async () => {
    setIsLoading(true);
    const res = await callFetchListUser(
      current - 1,
      pageSize,
      filter.username || "",
      filter.phone || "",
      filter.email || ""
    );
    if (res?.content) {
      setListUser(res.content);
      setTotal(res.totalElements);
    }
    setIsLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    const res = await callDeleteUser(userId);
    if (res.status === 200) {
      message.success("Tắt hoạt động người dùng thành công!");
      await fetchUser();
    } else {
      const error = getErrorMessageUser(res.response.data.message, {
        id: userId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  const dispatch = useDispatch();

  const handleView = (user, url) => {
    dispatch(doSetUser(user));
    navigate(`${url}/${user.id}`);
  };

  // sau này load động cột này -> cần có sự hợp tác của backend
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "username",
      sorter: true,
      width: 180,
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 180,
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 120,
      sorter: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: 90,
      render: (text, record, index) => {
        return <span>{record?.gender === true ? "Nam" : "Nữ"}</span>;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      width: 120,
      render: (text, record, index) => {
        return <span>{moment(record.birthday).format("DD-MM-YYYY")}</span>;
      },
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      width: 150,
      sorter: true,
      render: (text, record, index) => (
        <Tag color={record.enabled === true ? "success" : "error"}>
          {record.enabled === true ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
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
              title={"Xác nhận tắt hoạt động người dùng"}
              description={
                "Bạn có chắc chắn muốn tắt hoạt động người dùng này?"
              }
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteUser(record.id)}
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
          </>
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

  const itemSearch = [
    { field: "username", label: "Tên" },
    { field: "age", label: "Tuổi", type: "number" },
    {
      field: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { value: "male", label: "Nam" },
        { value: "female", label: "Nữ" },
      ],
    },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Danh sách người dùng"}
      itemSearch={itemSearch}
      create={handleToPageCreate}
    />
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
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table
            locale={{ emptyText: "Không có dữ liệu" }}
            scroll={{
              x: "100%",
              y: 280,
            }}
            title={renderHeader}
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={listUser}
            onChange={onChange}
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

      <UserImport
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
        fetchUser={fetchUser}
      />

      <UserExport
        openModalExport={openModalExport}
        setOpenModalExport={setOpenModalExport}
        listUser={listUser}
      />
    </>
  );
};

export default OrderList;
