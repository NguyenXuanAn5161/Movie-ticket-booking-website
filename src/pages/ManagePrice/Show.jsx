import {
  Card,
  Descriptions,
  Divider,
  Table,
  Tag,
  message,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ActionButtons from "../../components/Button/ActionButtons";
import {
  renderCurrency,
  renderDate,
  renderPriceName,
  renderStatus,
  renderTypePrice,
} from "../../components/FunctionRender/FunctionRender";
import PageHeader from "../../components/PageHeader/PageHeader";
import TableHeader from "../../components/TableHeader/TableHeader";
import { doSetPrice } from "../../redux/price/priceSlice";
import {
  callDeleteSalePriceDetail,
  callGetAllPriceDetail,
  callGetPriceHeaderById,
} from "../../services/apiPrice";
import { FORMAT_DATE_HHmm } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";
import { getErrorMessageSalePriceHeader } from "../../utils/errorHandling";
import PriceDetailModalCreate from "./PriceDetail/PriceDetailModalCreate";
import PriceDetailModalUpdate from "./PriceDetail/PriceDetailModalUpdate";
import PriceDetailModalView from "./PriceDetail/PriceDetailModalView";

const PriceShow = () => {
  const { priceId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;
  const checked = userRoles?.some((role) => role === "ROLE_ADMIN");

  const price = useSelector((state) => state.price.price);
  // const priceDetail = useSelector((state) => state.priceDetail.priceDetail);

  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);

  const [listPriceDetail, setListPriceDetail] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState(null);
  const [sortQuery, setSortQuery] = useState("");

  // fetch data f5
  useEffect(() => {
    if (!price) {
      getPriceHeaderById();
    }
  }, [price]);

  const getPriceHeaderById = async () => {
    const res = await callGetPriceHeaderById(priceId);
    if (res) {
      dispatch(doSetPrice(res));
    } else {
      const error = getErrorMessageSalePriceHeader(res.response.data.message, {
        id: priceId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  useEffect(() => {
    if (priceId) {
      fetchSalePriceDetail();
    }
  }, [priceId, current, pageSize, filter, sortQuery]);

  // price detail
  const fetchSalePriceDetail = async () => {
    setIsLoading(true);
    let query = `page=${current - 1}&size=${pageSize}&priceHeaderId=${priceId}`;
    if (filter) {
      query += `&${filter}`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callGetAllPriceDetail(query);
    console.log("res", res);
    if (res?.content) {
      setListPriceDetail(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
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

  const handleDeleteData = async (dataId) => {
    const res = await callDeleteSalePriceDetail(dataId);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá giá thành công!");
      await fetchSalePriceDetail();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  // render thông tin promotion header
  const items = [
    {
      label: "Mã chương trình quản lý giá",
      children: price?.code,
    },
    {
      label: "Tên chương trình quản lý giá",
      children: price?.name,
    },
    {
      label: "Ngày bắt đầu",
      children: moment(price?.startDate).format(FORMAT_DATE_HHmm),
    },
    {
      label: "Ngày kết thúc",
      children: moment(price?.endDate).format(FORMAT_DATE_HHmm),
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={price?.status ? "success" : "error"}>
          {price?.status ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      label: "Mô tả",
      children: price?.description,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 5,
      },
    },
  ];

  const handleView = (data, type) => {
    if (type === "edit") {
      setDataUpdate(data);
      setOpenModalUpdate(true);
    } else {
      setDataViewDetail(data);
      setOpenViewDetail(true);
    }
  };

  const columns = [
    createColumn("Mã giá", "code", 100, false, undefined, "left"),
    createColumn("Giá cho", "type", 150, false, renderTypePrice, "left"),
    createColumn("Tên", "itemName", 150, false, renderPriceName, "left"),
    createColumn("Giá", "price", 150, false, renderCurrency),
    createColumn("Trạng thái", "status", 150, false, renderStatus()),
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
            itemName={"giá"}
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
    setOpenModalCreate(true);
  };

  const optionsPriceCode = [
    { value: "FOOD", label: "Đồ ăn" },
    { value: "ROOM", label: "Phòng" },
    { value: "TYPE_SEAT", label: "Loại ghế" },
  ];

  // fix tìm động rạp
  const itemSearch = [
    {
      field: "typeDetail",
      label: "Giá cho",
      type: "select",
      options: optionsPriceCode,
    },
    { field: "code", label: "Mã giá" },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Danh sách chi tiết giá"}
      itemSearch={itemSearch}
      create={handleToPageCreate}
      showFuncOther={false}
      showCreate={checked}
    />
  );

  const handleSearch = (query) => {
    let q = "";
    let codeExists = false;

    // Kiểm tra xem mã code có tồn tại không
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        if (key === "code" && query[key]) {
          codeExists = true;
          break;
        }
      }
    }

    // Nếu mã code tồn tại, thay đổi thành các giá trị mới
    if (codeExists) {
      q += "&foodCode=" + query.code;
      q += "&roomCode=" + query.code;
      q += "&typeSeatCode=" + query.code;
    } else {
      // Nếu không, duyệt qua các thuộc tính và thêm chúng vào chuỗi truy vấn
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          const label = key;
          const value = query[key];
          if (value) {
            q += `&${label}=${value}`;
          }
        }
      }
    }
    console.log("q", q);
    setFilter(q);
  };

  return (
    <>
      <PageHeader
        title="Xem chi tiết chương trình quản lý giá"
        numberBack={-1}
        type="show"
        hiddenEdit={!checked}
      />
      <Divider />
      <div style={{ padding: "0 20px" }}>
        <Card title="Thông tin chương trình quản lý giá" bordered={false}>
          <Descriptions
            labelStyle={{ color: "#333", fontWeight: "700" }}
            layout="vertical"
            bordered
            size="small"
            column={{
              xs: 1,
              sm: 2,
              md: 2,
              lg: 5,
              xl: 5,
              xxl: 5,
            }}
            items={items}
          />
          <br />
          <Table
            scroll={{
              x: "100%",
              y: 400,
            }}
            title={renderHeader}
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={listPriceDetail || []}
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
        </Card>
      </div>

      <PriceDetailModalCreate
        priceHeaderId={priceId}
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchData={fetchSalePriceDetail}
      />

      <PriceDetailModalUpdate
        dataUpdate={dataUpdate}
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        fetchData={fetchSalePriceDetail}
      />

      <PriceDetailModalView
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
      />
    </>
  );
};

export default PriceShow;
