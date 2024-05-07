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
import { AiOutlineDelete, AiOutlineReload } from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../components/InputSearch/InputSearch";
import { doSetUser } from "../../redux/account/userSlice";
import { callDeleteUser, callFetchListUser } from "../../services/apiUser";
import { getErrorMessageUser } from "../../utils/errorHandling";

const UserList = () => {
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

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontWeight: "700", fontSize: "16" }}>
        Danh sách người dùng
      </span>
      <span style={{ display: "flex", gap: 15 }}>
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

  const itemSearch = [
    { field: "username", label: "Họ và tên" },
    { field: "email", label: "Email" },
    { field: "phone", label: "Số điện thoại" },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch
            itemSearch={itemSearch}
            handleSearch={handleSearch} // Hàm xử lý tìm kiếm, truyền vào từ props
            setFilter={setFilter}
            filter={filter}
          />
        </Col>
        <Col span={24}>
          <Table
            scroll={{
              x: "100%",
              y: "64vh",
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
    </>
  );
};

export default UserList;
