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
import { useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";
import PromotionLineModalForm from "./PromotionLines/PromotionLineForm";

const PromotionShow = () => {
  const promotionHeader = useSelector((state) => state.promotion.promotion);

  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(promotionHeader?.promotionLines.length);
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
      label: "Mã khuyến mãi",
      key: "1",
      children: promotionHeader?.code,
    },
    {
      label: "Tên khuyến mãi",
      key: "2",
      children: promotionHeader?.name,
    },
    {
      label: "Ngày bắt đầu",
      key: "3",
      children: moment(promotionHeader?.start_date).format(
        "DD-MM-YYYY HH:mm:ss"
      ),
    },
    {
      label: "Ngày kết thúc",
      key: "4",
      children: moment(promotionHeader?.end_date).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      label: "Trạng thái",
      key: "5",
      children: (
        <Tag color={promotionHeader?.status === "available" ? "green" : "red"}>
          {promotionHeader?.status === "available"
            ? "Hoạt động"
            : "Không hoạt động"}
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
        lg: 5,
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
      dataIndex: "start_date",
      width: 120,
      render: (text, record, index) => {
        return <span>{moment(record.start_date).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      width: 130,
      render: (text, record, index) => {
        return <span>{moment(record.end_date).format("DD-MM-YYYY")}</span>;
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
        <Tag color={status === "available" ? "green" : "red"}>
          {status === "available" ? "Hoạt động" : "Không hoạt động"}
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
            dataSource={promotionHeader?.promotionLines}
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

      <PromotionLineModalForm
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

      {/* <PromotionLineModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      /> */}
    </>
  );
};

export default PromotionShow;
