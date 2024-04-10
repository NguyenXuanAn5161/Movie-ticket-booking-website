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
import { doSetPriceDetail } from "../../redux/price/priceDetailSlice";
import { doSetPrice } from "../../redux/price/priceSlice";
import {
  callDeleteSalePriceDetail,
  callGetAllPriceDetail,
  callGetPriceHeaderById,
} from "../../services/apiPrice";
import { getErrorMessageSalePriceHeader } from "../../utils/errorHandling";
import PriceDetailModalForm from "./PriceDetail/ModalForm";

const PriceShow = () => {
  const { priceId } = useParams();
  const dispatch = useDispatch();

  const price = useSelector((state) => state.price.price);
  const priceDetail = useSelector((state) => state.priceDetail.priceDetail);

  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [total, setTotal] = useState(price?.salePriceDetail?.length);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  }, [priceId]);

  // price detail
  const fetchSalePriceDetail = async () => {
    const res = await callGetAllPriceDetail(priceId);
    console.log("res", res);
    if (res) {
      dispatch(doSetPriceDetail(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  // Hàm thay đổi trang
  const onChange = (pagination, filters, sorter) => {
    console.log("params", pagination, filters, sorter);
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
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
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <span>
            {record?.food?.name ??
              (record?.typeSeat?.name === "VIP"
                ? "Ghế Vip"
                : record?.typeSeat?.name === "STANDARD"
                ? "Ghế thường"
                : "Ghế đôi")}
          </span>
        );
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
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      sorter: true,
      render: (status) => (
        <Tag color={status ? "success" : "error"}>
          {status ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "createdDate",
      width: 150,
      render: (text, record, index) => {
        return (
          <span>
            {moment(record.createdDate).format("DD-MM-YYYY HH:mm:ss")}
          </span>
        );
      },
      sorter: true,
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
              title={"Xác nhận xóa giá sản phẩm"}
              description={"Bạn có chắc chắn muốn xóa giá sản phẩm này?"}
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
            scroll={{
              x: "100%",
              y: 200,
            }}
            title={renderHeader}
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={priceDetail || []}
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
      />
    </>
  );
};

export default PriceShow;
