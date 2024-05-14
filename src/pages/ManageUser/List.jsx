import { Col, Row, Table, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../components/Button/ActionButtons";
import {
  renderDateOnly,
  renderGender,
  renderPhone,
  renderStatus,
} from "../../components/FunctionRender/FunctionRender";
import SearchList from "../../components/InputSearch/SearchList";
import TableHeader from "../../components/TableHeader/TableHeader";
import { doSetUser } from "../../redux/account/userSlice";
import { callDeleteUser, callFetchListUser } from "../../services/apiUser";
import { createColumn } from "../../utils/createColumn";
import { getErrorMessageUser } from "../../utils/errorHandling";
import { validateEmail, validatePhoneNumber } from "../../utils/validData";

const UserList = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;
  const checked = userRoles?.some((role) => role === "ROLE_ADMIN");

  const [listUser, setListUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất

  useEffect(() => {
    fetchUser();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  const fetchUser = async () => {
    setIsLoading(true);

    let query = `page=${current - 1}&size=${pageSize}`;

    if (filter) {
      query += `${filter}`;
    }

    const res = await callFetchListUser(query);
    if (res?.content) {
      setListUser(res.content);
      setTotal(res.totalElements);
    }
    setIsLoading(false);
  };

  const handleDeleteData = async (userId) => {
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

  const columns = [
    createColumn("Mã khách hàng", "code", 120, false, undefined, "left"),
    createColumn("Họ và tên", "username", 180, false, undefined, "left"),
    createColumn("Email", "email", 190),
    createColumn("Số điện thoại", "phone", 120, false, renderPhone),
    createColumn("Giới tính", "gender", 90, false, renderGender),
    createColumn("Ngày sinh", "birthday", 120, false, renderDateOnly),
    createColumn("Trạng thái", "enabled", 120, false, renderStatus()),
    {
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <ActionButtons
            record={record}
            handleDelete={handleDeleteData}
            handleView={handleView}
            showDelete={checked}
            showEdit={false}
            showView={true}
            itemName={"người dùng"}
          />
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
    { field: "code", label: "Mã khách hàng" },
    { field: "username", label: "Họ và tên" },
    { field: "email", label: "Email", validator: validateEmail },
    { field: "phone", label: "Số điện thoại", validator: validatePhoneNumber },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      headerTitle={"Danh sách người dùng"}
      create={handleToPageCreate}
      showFuncOther={false}
      showCreate={checked}
    />
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
    setFilter(q);
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
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <SearchList
          itemSearch={itemSearch}
          handleSearch={handleSearch}
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
  );
};

export default UserList;
