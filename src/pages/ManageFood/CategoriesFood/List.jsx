import { Col, Row, Table, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../../components/Button/ActionButtons";
import { renderDate } from "../../../components/FunctionRender/FunctionRender";
import SearchList from "../../../components/InputSearch/SearchList";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { doSetFoodCategory } from "../../../redux/food/foodCategorySlice";
import {
  callDeleteCategoryFood,
  callFetchListCategoryFood,
} from "../../../services/apiFood";
import { createColumn } from "../../../utils/createColumn";
import { getErrorMessageCategoryFood } from "../../../utils/errorHandling";

const FoodCategoryList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;
  const checked = userRoles?.some((role) => role === "ROLE_ADMIN");

  // mặc định #2
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất

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
      query += `${filter}`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callFetchListCategoryFood(query);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteCategoryFood(dataId);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá loại đồ ăn thành công!");
      await fetchData();
    } else {
      const error = getErrorMessageCategoryFood(res.response.data.message, {
        id: dataId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  const handleView = (data, url) => {
    // thay đổi #1
    dispatch(doSetFoodCategory(data));
    navigate(`${url}/${data.id}`);
  };

  const columns = [
    createColumn("Mã loại đồ ăn", "code", 100, false, undefined, "left"),
    createColumn("Loại đồ ăn", "name", 100, false, undefined, "left"),
    createColumn("Cập nhật ngày", "createdDate", 150, false, renderDate),
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
            showEdit={checked}
            showView={true}
            itemName={"loại đồ ăn"}
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
    { field: "code", label: "Mã loại đồ ăn" },
    { field: "name", label: "Loại đồ ăn" },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      headerTitle={"Danh sách loại đồ ăn"}
      create={handleToPageCreate}
      showCreate={checked}
      showFuncOther={false}
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

  // mặc định #2
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter?.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  return (
    <Row gutter={[20, 10]}>
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
  );
};

export default FoodCategoryList;
