import { Col, Row, Table, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../../components/Button/ActionButtons";
import {
  renderCurrency,
  renderDate,
  renderQuantity,
  renderStatus,
} from "../../../components/FunctionRender/FunctionRender";
import SearchList from "../../../components/InputSearch/SearchList";
import TableHeader from "../../../components/TableHeader/TableHeader";
import { doSetFoodCategory } from "../../../redux/food/foodCategorySlice";
import { doSetFood } from "../../../redux/food/foodSlice";
import {
  callFetchListCinema,
  callGetCinemaById,
} from "../../../services/apiCinema";
import {
  callDeleteFood,
  callFetchListCategoryFood,
  callFetchListFood,
} from "../../../services/apiFood";
import { createColumn } from "../../../utils/createColumn";
import { getErrorMessageFood } from "../../../utils/errorHandling";

// thay đổi #1
const FoodList = () => {
  const foodCategory = useSelector((state) => state.foodCategory.foodCategory);
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
  const [selectedCinema, setSelectedCinema] = useState(null);

  useEffect(() => {
    console.log("selectedCinema", selectedCinema);
  }, [selectedCinema]);

  const handleSelectedCinema = async () => {
    if (filter.includes("cinemaId")) {
      const cinemaId = filter.split("=")[1].split("&")[0];
      const cinema = await callGetCinemaById(cinemaId);
      if (cinema) {
        setSelectedCinema(cinema?.name);
      }
    } else {
      const cinemaId1 = await callGetCinemaById(1);
      setSelectedCinema(cinemaId1?.name);
    }
  };

  useEffect(() => {
    handleSelectedCinema();
  }, [filter]);

  // fetch tìm theo rạp
  const fetchCinemaList = async (cinemaName) => {
    try {
      let query = `size=5&name=${cinemaName}`;
      const res = await callFetchListCinema(query);
      const cinema = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return cinema;
    } catch (error) {
      console.error("Error fetching cinema list:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  useEffect(() => {
    fetchFoodCategory();
  }, []);

  const fetchFoodCategory = async () => {
    setIsLoading(true);
    let query = `size=${100}`;
    const res = await callFetchListCategoryFood(query);
    if (res?.content) {
      const data = res.content.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      dispatch(doSetFoodCategory(data));
    }
    setIsLoading(false);
  };

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

    if (!filter.includes("cinemaId")) {
      query += `&cinemaId=1`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callFetchListFood(query);
    if (res?.content) {
      setListData(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteFood(dataId);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá đồ ăn thành công!");
      await fetchData();
      setCurrent(1);
    } else {
      const error = getErrorMessageFood(res.response.data.message, {
        foodId: dataId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  const handleView = (data, url) => {
    // thay đổi #1
    dispatch(doSetFood(data));
    navigate(`${url}/${data.id}`);
  };

  const columns = [
    createColumn("Code", "code", 120, false, undefined, "left"),
    createColumn("Tên đồ ăn", "name", 200, false, undefined, "left"),
    createColumn("Giá", "price", 150, false, renderCurrency),
    createColumn("Số lượng", "quantity", 150, false, renderQuantity),
    createColumn("Trạng thái", "status", 150, false, renderStatus("food")),
    createColumn("Cập nhật ngày", "createdDate", 150, false, renderDate),
    {
      title: "Thao tác",
      width: 200,
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
            itemName={"đồ ăn"}
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
    { field: "code", label: "Mã đồ ăn" },
    { field: "name", label: "Tên đồ ăn" },
    {
      field: "categoryId",
      label: "Loại đồ ăn",
      type: "select",
      options: foodCategory,
    },
    {
      field: "cinemaId",
      label: "Tên rạp",
      type: "debounceSelect",
      fetchOptions: fetchCinemaList,
    },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      headerTitle={
        <>
          Danh sách đồ ăn tại rạp{" "}
          <span style={{ color: "#E38601" }}>{selectedCinema}</span>
        </>
      }
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
        if (label === "cinemaId") {
          q += `&${label}=${value.value}`;
        } else if (value) {
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
    <Row gutter={[16, 10]}>
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
          loading={isLoading}
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
  );
};

export default FoodList;
