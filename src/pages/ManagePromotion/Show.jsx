import {
  Card,
  Descriptions,
  Divider,
  Popconfirm,
  Table,
  Tag,
  message,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  renderDate,
  renderStatus,
  renderTypePromotion,
} from "../../components/FunctionRender/FunctionRender";
import PageHeader from "../../components/PageHeader/PageHeader";
import TableHeader from "../../components/TableHeader/TableHeader";
import { doSetPromotion } from "../../redux/promotion/promotionSlice";
import {
  callDeletePromotionLine,
  callGetPromotionHeaderById,
  callGetPromotionLineByPromotionId,
} from "../../services/apiPromotion";
import { HH_MM_SS_FORMAT_DATE } from "../../utils/constant";
import { createColumn } from "../../utils/createColumn";
import PromotionLineModalCreate from "./PromotionLines/PromotionLineModalCreate";
import PromotionLineModalUpdate from "./PromotionLines/PromotionLineModalUpdate";
import PromotionLineModalView from "./PromotionLines/PromotionLineModalView";

const optionsPromotion = [
  { value: "DISCOUNT", label: "Giảm giá" },
  { value: "FOOD", label: "Tặng đồ ăn" },
  { value: "TICKET", label: "Tặng vé" },
];

const PromotionShow = () => {
  const promotionHeader = useSelector((state) => state.promotion.promotion);
  const { promotionId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;
  const checked = userRoles?.some((role) => role === "ROLE_ADMIN");

  // f5 fetch data
  useEffect(() => {
    if (!promotionHeader) {
      getPromotionHeaderById();
    }
  }, [promotionHeader]);

  const getPromotionHeaderById = async () => {
    const res = await callGetPromotionHeaderById(promotionId);
    if (res) {
      dispatch(doSetPromotion(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState(null);
  const [sortQuery, setSortQuery] = useState("");
  const [promotionLines, setPromotionLines] = useState([]);

  // get promotion lines
  useEffect(() => {
    getPromotionLines();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  // mặc định #2
  const getPromotionLines = async () => {
    setIsLoading(true);
    let query = `page=${
      current - 1
    }&size=${pageSize}&promotionId=${promotionId}`;

    if (filter) {
      query += `&${filter}`;
    }

    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    // thay đổi #1 api call
    const res = await callGetPromotionLineByPromotionId(query);
    console.log("res", res);
    if (res?.content) {
      setPromotionLines(res.content);
      setTotal(res.totalElements);
    }

    setIsLoading(false);
  };

  // render thông tin promotion header
  const items = [
    {
      label: "Tên sự kiện khuyến mãi",
      key: "2",
      children: promotionHeader?.name,
    },
    {
      label: "Ngày bắt đầu",
      key: "3",
      children: moment(promotionHeader?.startDate).format(HH_MM_SS_FORMAT_DATE),
    },
    {
      label: "Ngày kết thúc",
      key: "4",
      children: moment(promotionHeader?.endDate).format(HH_MM_SS_FORMAT_DATE),
    },
    {
      label: "Trạng thái",
      key: "5",
      children: (
        <Tag color={promotionHeader?.status ? "success" : "error"}>
          {promotionHeader?.status ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      label: "Mô tả",
      key: "6",
      children: promotionHeader?.description,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
      },
    },
  ];

  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeletePromotionLine(dataId);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Xoá rạp thành công!");
      await getPromotionLines();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  const columns = [
    createColumn(
      "Loại",
      "typePromotion",
      100,
      false,
      renderTypePromotion,
      "left"
    ),
    createColumn("Mã CTKM", "code", 130, false, undefined, "left"),
    createColumn("Tên CTKM", "name", 150, false, undefined, "left"),
    createColumn("Ngày bắt đầu", "startDate", 120, false, renderDate),
    createColumn("Ngày kết thúc", "endDate", 130, false, renderDate),
    createColumn("Mô tả", "description", 230),
    createColumn("Trạng thái", "status", 150, false, renderStatus()),
    createColumn("Cập nhật ngày", "createdAt", 150, false, renderDate),
    {
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            {checked && (
              <Popconfirm
                placement="leftTop"
                title={"Xác nhận xóa CTKM"}
                description={"Bạn có chắc chắn muốn xóa CTKM này?"}
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
            )}
            <BsEye
              style={{ cursor: "pointer", marginRight: 10 }}
              onClick={() => {
                setDataViewDetail(record);
                setOpenViewDetail(true);
              }}
            />
            {checked && (
              <CiEdit
                style={{ color: "#f57800", cursor: "pointer" }}
                onClick={() => {
                  setDataUpdate(record);
                  setOpenModalUpdate(true);
                }}
              />
            )}
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
    setOpenModalCreate(true);
  };

  const itemSearch = [
    {
      field: "typePromotion",
      label: "Loại CTKM",
      type: "select",
      options: optionsPromotion,
    },
    { field: "code", label: "Mã CTKM" },
  ];

  const renderHeader = () => (
    <TableHeader
      onReload={handleReload}
      filter={filter}
      setFilter={setFilter}
      handleSearch={handleSearch}
      headerTitle={"Danh sách chương trình khuyến mãi (CTKM)"}
      itemSearch={itemSearch}
      create={handleToPageCreate}
      showFuncOther={false}
      showCreate={checked}
    />
  );

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
      <PageHeader
        title="Xem chi tiết sự kiện khuyến mãi"
        numberBack={-1}
        type="show"
        hiddenEdit={!checked}
      />
      <Divider />
      <div style={{ padding: "0 20px" }}>
        <Card title="Thông tin khyến mãi" bordered={false}>
          <Descriptions
            labelStyle={{ color: "#333", fontWeight: "700" }}
            layout="vertical"
            bordered
            size="small"
            column={{
              xs: 1,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
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
            dataSource={promotionLines}
            onChange={onChange}
            rowKey="id" // Đảm bảo id là trường định danh duy nhất của mỗi chương trình khuyến mãi
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

      {/* <PromotionLineModalForm
        formType={
          openModalCreate ? "create" : openModalUpdate ? "update" : "view"
        }
        data={
          openModalCreate
            ? promotionId
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
      /> */}

      <PromotionLineModalCreate
        type="create"
        promotionId={promotionId}
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        getPromotionLines={getPromotionLines}
      />

      <PromotionLineModalUpdate
        type="update"
        dataUpdate={dataUpdate}
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        getPromotionLines={getPromotionLines}
      />

      <PromotionLineModalView
        dataViewDetail={dataViewDetail}
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
      />
    </>
  );
};

export default PromotionShow;
