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
import { doSetPriceDetail } from "../../redux/price/priceDetailSlice";
import { doSetPrice } from "../../redux/price/priceSlice";
import {
  callDeleteSalePriceDetail,
  callGetAllPriceDetail,
  callGetPriceHeaderById,
} from "../../services/apiPrice";
import { createColumn } from "../../utils/createColumn";
import { getErrorMessageSalePriceHeader } from "../../utils/errorHandling";
import PriceDetailModalCreate from "./PriceDetail/PriceDetailModalCreate";

const PriceShow = () => {
  const { priceId } = useParams();
  const dispatch = useDispatch();

  const price = useSelector((state) => state.price.price);
  // const priceDetail = useSelector((state) => state.priceDetail.priceDetail);

  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalExport, setOpenModalExport] = useState(false);
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
      await fetchData();
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
      label: "Mã giá",
      children: price?.code,
    },
    {
      label: "Tên giá",
      children: price?.name,
    },
    {
      label: "Ngày bắt đầu",
      children: moment(price?.startDate).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      label: "Ngày kết thúc",
      children: moment(price?.endDate).format("DD-MM-YYYY HH:mm:ss"),
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

  const handleView = (data, url) => {
    // thay đổi #1
    dispatch(doSetPriceDetail(data));
    setOpenModalUpdate(true);
  };

  const columns = [
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
            showDelete={true}
            showEdit={true}
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
    { field: "name", label: "Mã sản phẩm" },
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

  return (
    <>
      <PageHeader title="Xem chi tiết giá" numberBack={-1} type="show" />
      <Divider />
      <div style={{ padding: "0 20px" }}>
        <Card title="Thông tin giá" bordered={false}>
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
              y: 200,
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

      {/* <PriceDetailModalForm
        fetchSalePriceDetail={fetchSalePriceDetail}
        formType={
          openModalCreate ? "create" : openModalUpdate ? "update" : "view"
        }
        data={
          openModalCreate
            ? { priceId: priceId }
            : openModalUpdate
            ? dataUpdate
            : dataViewDetail
        }
        setData={
          openModalCreate
            ? null
            : openModalUpdate
            ? setDataUpdate
            : setDataViewDetail
        }
        openModal={openModalCreate || openModalUpdate || openViewDetail}
        setOpenModal={
          openModalCreate
            ? setOpenModalCreate
            : openModalUpdate
            ? setOpenModalUpdate
            : setOpenViewDetail
        }
        fetchData={getPriceHeaderById}
      /> */}
    </>
  );
};

export default PriceShow;
