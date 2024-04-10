import {
  Button,
  Card,
  Descriptions,
  Divider,
  Popconfirm,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { doSetPromotion } from "../../redux/promotion/promotionSlice";
import {
  callGetPromotionHeaderById,
  callGetPromotionLineByPromotionId,
} from "../../services/apiPromotion";
import PromotionLineModalForm from "./PromotionLines/PromotionLineForm";

const PromotionShow = () => {
  const promotionHeader = useSelector((state) => state.promotion.promotion);
  const { promotionId } = useParams();
  const dispatch = useDispatch();
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
  const [pageSize, setPageSize] = useState(2);
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
      label: "Tên khuyến mãi",
      key: "2",
      children: promotionHeader?.name,
    },
    {
      label: "Ngày bắt đầu",
      key: "3",
      children: moment(promotionHeader?.startDate).format(
        "DD-MM-YYYY HH:mm:ss"
      ),
    },
    {
      label: "Ngày kết thúc",
      key: "4",
      children: moment(promotionHeader?.endDate).format("DD-MM-YYYY HH:mm:ss"),
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

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontWeight: "500" }}>
        Danh sách chương trình khuyến mãi (CTKM)
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

  const columns = [
    {
      title: "Mã CTKM",
      dataIndex: "code",
      width: 150,
      fixed: "left",
    },
    {
      title: "Tên CTKM",
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
    // {
    //   title: "Cập nhật ngày",
    //   dataIndex: "updatedAt",
    //   width: 150,
    //   render: (text, record, index) => {
    //     return (
    //       <span>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</span>
    //     );
    //   },
    //   sorter: true,
    // },
    {
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa CTKM"}
              description={"Bạn có chắc chắn muốn xóa CTKM này?"}
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteBook(record.id)}
            >
              <span>
                <AiOutlineDelete
                  style={{ color: "red", cursor: "pointer", marginRight: 10 }}
                />
              </span>
            </Popconfirm>
            <BsEye
              style={{ cursor: "pointer", marginRight: 10 }}
              onClick={() => {
                setDataViewDetail(record);
                setOpenViewDetail(true);
              }}
            />
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

  return (
    <>
      <PageHeader title="Xem chi tiết khuyến mãi" numberBack={-1} type="show" />
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
              y: 200,
            }}
            title={renderHeader}
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={promotionLines}
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

      <PromotionLineModalForm
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
      />

      {/* <PromotionLineModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      /> */}
    </>
  );
};

export default PromotionShow;
