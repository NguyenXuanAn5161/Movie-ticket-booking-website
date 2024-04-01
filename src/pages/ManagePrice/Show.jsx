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
import { doSetPrice } from "../../redux/price/priceSlice";
import { callGetPriceHeaderById } from "../../services/apiMovie";
import { getErrorMessageSalePriceHeader } from "../../utils/errorHandling";
import PriceDetailModalForm from "./PriceDetail/ModalForm";

const PriceShow = () => {
  const { priceId } = useParams();
  const dispatch = useDispatch();

  const price = useSelector((state) => state.price.price);

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

  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [total, setTotal] = useState(price?.salePriceDetail?.length);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [filter, setFilter] = useState(null);
  const [sortQuery, setSortQuery] = useState("");

  // Hàm thay đổi trang
  const onChange = (pagination, filters, sorter) => {
    console.log("params", pagination, filters, sorter);
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
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

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontWeight: "500" }}>Chi tiết giá sản phẩm</span>
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
      title: "Mã giá sản phẩm",
      dataIndex: "code",
      width: 150,
      fixed: "left",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      width: 120,
      render: (text, record, index) => {
        return <span>{moment(record.startDate).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      width: 130,
      render: (text, record, index) => {
        return <span>{moment(record.endDate).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Giá cho",
      dataIndex: "type_sale",
      key: "type_sale",
      width: 150,
      render: (text, record, index) => {
        return <span>{record.type_sale === "Seat" ? "Ghế" : "Đồ ăn"}</span>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: true,
      width: 150,
      fixed: "right",
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
              title={"Xác nhận xóa giá sản phẩm"}
              description={"Bạn có chắc chắn muốn xóa giá sản phẩm này?"}
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
            locale={{ emptyText: "Không có dữ liệu" }}
            scroll={{
              x: "100%",
              y: 200,
            }}
            title={renderHeader}
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={price?.salePriceDetail || []}
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

      <PriceDetailModalForm
        formType={
          openModalCreate ? "create" : openModalUpdate ? "update" : "view"
        }
        data={
          openModalCreate ? null : openModalUpdate ? dataUpdate : dataViewDetail
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
    </>
  );
};

export default PriceShow;
