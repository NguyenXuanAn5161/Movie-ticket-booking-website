import { Button, Col, Popconfirm, Row, Table, Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import PromotionModalCreate from "./PromotionModalCreate";
import PromotionViewDetail from "./PromotionViewDetal";

const PromotionTable = ({ data }) => {
  const [listPromotion, setListPromotion] = useState([
    {
      id: 1,
      code: "T2T3Sale_20240301",
      name: "Ưu đãi Mua vé Thứ 2 - Thứ 3",
      start_date: "2024-03-01",
      end_date: "2024-03-15",
      description: "Giảm giá 20% cho tất cả vé xem phim vào Thứ 2 và Thứ 3.",
      status: "available",
      promotionLines: [
        {
          id: 101,
          code: "T2T3Sale_20240301_Phase1",
          name: "Giai Đoạn 1",
          start_date: "2024-03-01",
          end_date: "2023-03-10",
          description: "Giảm giá 15% cho tất cả vé xem phim.",
          applicable_object: "All Customers",
          type_promotion: "PERCENT",
          value: 15,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "available",
          promotionDetails: {
            id: "10101",
            promotion_line_id: "101",
            discount_value: 15,
            min_spend: 100000, // Áp dụng giảm giá khi chi tiêu tối thiểu 100,000 VNĐ
            max_spend: 500000, // Áp dụng giảm giá tối đa cho các hóa đơn dưới 500,000 VNĐ
          },
        },
        {
          id: 102,
          code: "T2T3Sale_20240301_Phase2",
          name: "Giai Đoạn 2",
          start_date: "2024-03-11",
          end_date: "2024-03-15",
          description: "Giảm giá 20% cho tất cả vé xem phim.",
          applicable_object: "All Customers",
          type_promotion: "PERCENT",
          value: 20,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "available",
          promotionDetails: {
            id: "10201",
            promotion_line_id: "102",
            discount_value: 20,
            min_spend: 200000, // Áp dụng giảm giá khi chi tiêu tối thiểu 200,000 VNĐ
            max_spend: Infinity, // Không giới hạn giá trị tối đa cho việc áp dụng giảm giá
          },
        },
      ],
    },
    {
      id: 2,
      code: "ComboDeal_20240401",
      name: "Combo Vé Xem Phim + Bắp Nước",
      start_date: "2024-04-01",
      end_date: "2024-04-03",
      description: "Mua combo vé xem phim và bắp nước với giá chỉ 150.000 VNĐ.",
      status: "available",
      promotionLines: [
        {
          id: 201,
          code: "ComboDeal_20240401_Promotion1",
          name: "Combo Vé Xem Phim + Bắp Nước",
          start_date: "2024-04-01",
          end_date: "2024-04-03",
          description: "Combo vé xem phim + bắp nước với giá chỉ 150.000 VNĐ.",
          applicable_object: "All Customers",
          type_promotion: "AMOUNT",
          value: 150000,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "available",
          promotionDetails: {
            id: "20101",
            promotion_line_id: "201",
            discount_value: 150000, // Giá trị của ưu đãi là 150.000 VNĐ (giảm giá trực tiếp)
            min_spend: 0, // Không có điều kiện tối thiểu về chi tiêu
            max_spend: Infinity, // Không giới hạn giá trị tối đa cho việc áp dụng ưu đãi
          },
        },
      ],
    },
    {
      id: 3,
      code: "ThẻThànhViên_20241220",
      name: "Ưu đãi cho Thẻ Thành Viên",
      start_date: "2024-12-20",
      end_date: "2025-01-05",
      description:
        "Thành viên được giảm giá 30% cho tất cả các vé xem phim và nhận thêm 1 bắp nước miễn phí mỗi tuần.",
      status: "unavailable",
      promotionLines: [
        {
          id: 301,
          code: "ThẻThànhViên_20241220_Promotion1",
          name: "Ưu đãi cho Thẻ Thành Viên",
          start_date: "2024-12-20",
          end_date: "2025-01-05",
          description:
            "Thành viên được giảm giá 30% cho tất cả các vé xem phim và nhận thêm 1 bắp nước miễn phí mỗi tuần.",
          applicable_object: "Members Only",
          type_promotion: "PERCENT",
          value: 30,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
        },
      ],
    },
    {
      id: 4,
      code: "GiờVàng_20240901",
      name: "Chương trình Giờ Vàng",
      start_date: "2024-09-01",
      end_date: "2024-09-15",
      description:
        "Giảm giá vé xem phim 50% trong khung giờ 14:00 - 16:00 từ Thứ Hai đến Thứ Sáu.",
      status: "unavailable",
      promotionLines: [
        {
          id: 401,
          code: "GiờVàng_20240901_Promotion1",
          name: "Chương trình Giờ Vàng",
          start_date: "2024-09-01",
          end_date: "2024-09-15",
          description:
            "Giảm giá vé xem phim 50% trong khung giờ 14:00 - 16:00 từ Thứ Hai đến Thứ Sáu.",
          applicable_object: "All Customers",
          type_promotion: "PERCENT",
          value: 50,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
        },
      ],
    },
    {
      id: 5,
      code: "BuổiHọpFan_20240615",
      name: "Buổi Họp Fan: Phim Siêu Anh Hùng",
      start_date: "2024-06-15",
      end_date: "2024-07-15",
      description:
        "Tham gia buổi họp fan và nhận ngay vé xem phim miễn phí cùng với quà tặng đặc biệt từ diễn viên.",
      status: "unavailable",
      promotionLines: [
        {
          id: 501,
          code: "BuổiHọpFan_20240615_Promotion1",
          name: "Buổi Họp Fan: Phim Siêu Anh Hùng - Vé Miễn Phí",
          start_date: "2024-06-15",
          end_date: "2024-06-15",
          description:
            "Nhận ngay vé xem phim miễn phí khi tham gia buổi họp fan.",
          applicable_object: "All Attendees",
          type_promotion: "PERCENT",
          value: 100,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
        },
      ],
    },
    {
      id: 6,
      code: "SummerSale_20230301",
      name: "Ưu đãi Mùa Hè",
      start_date: "2023-06-01",
      end_date: "2023-09-01",
      description: "Giảm giá 30% cho tất cả vé xem phim vào mùa hè.",
      status: "unavailable",
      promotionLines: [
        {
          id: 601,
          code: "SummerSale_20230301_Promotion1",
          name: "Ưu đãi Mùa Hè",
          start_date: "2023-06-01",
          end_date: "2023-09-01",
          description: "Giảm giá 30% cho tất cả vé xem phim vào mùa hè.",
          applicable_object: "All Customers",
          type_promotion: "PERCENT",
          value: 30,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
        },
      ],
    },
    {
      id: 7,
      code: "EarlyBird_20220201",
      name: "Ưu đãi Mua sớm",
      start_date: "2022-02-01",
      end_date: "2022-03-01",
      description:
        "Giảm giá 25% cho tất cả vé xem phim khi đặt trước ít nhất 1 tháng.",
      status: "unavailable",
      promotionLines: [
        {
          id: 701,
          code: "EarlyBird_20220201_Promotion1",
          name: "Ưu đãi Mua sớm",
          start_date: "2022-02-01",
          end_date: "2022-03-01",
          description:
            "Giảm giá 25% cho tất cả vé xem phim khi đặt trước ít nhất 1 tháng.",
          applicable_object: "All Customers",
          type_promotion: "PERCENT",
          value: 25,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
        },
      ],
    },
    {
      id: 8,
      code: "WinterSale_20230101",
      name: "Ưu đãi Mùa Đông",
      start_date: "2023-12-01",
      end_date: "2024-01-15",
      description: "Giảm giá 35% cho tất cả vé xem phim vào mùa đông.",
      status: "unavailable",
      promotionLines: [
        {
          id: 801,
          code: "WinterSale_20230101_Promotion1",
          name: "Ưu đãi Mùa Đông",
          start_date: "2023-12-01",
          end_date: "2024-01-15",
          description: "Giảm giá 35% cho tất cả vé xem phim vào mùa đông.",
          applicable_object: "All Customers",
          type_promotion: "PERCENT",
          value: 35,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalExport, setOpenModalExport] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(listPromotion.length);
  const [filter, setFilter] = useState(null);
  const [sortQuery, setSortQuery] = useState("");

  //   hàm add data vì chưa get api
  const handleAddPromotion = (newPromotion) => {
    // Tìm id lớn nhất hiện có trong mảng listPromotion
    const maxId = Math.max(...listPromotion.map((promo) => promo.id));
    // Tạo id mới bằng cách tăng id lớn nhất thêm 1 đơn vị
    const newId = maxId + 1;
    // Thêm trường id vào chương trình khuyến mãi mới
    newPromotion.id = newId;
    // Thêm chương trình khuyến mãi mới vào mảng listPromotion
    setListPromotion([...listPromotion, newPromotion]);
  };

  // Hàm tìm kiếm
  const handleSearch = (value) => {
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setListPromotion(filteredData);
    setTotal(filteredData.length);
  };

  // Hàm thay đổi trang
  const onChange = (pagination, filters, sorter) => {
    console.log("params", pagination, filters, sorter);
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Hàm render header
  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Bảng danh sách khuyến mãi</span>
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

  // Các cột của bảng
  const columns = [
    {
      title: "Mã Khuyến Mãi",
      dataIndex: "code",
      render: (text, record, index) => {
        return (
          <a
            href={`promotion#${record.code}`}
            onClick={() => {
              setDataViewDetail(record);
              setOpenViewDetail(true);
            }}
          >
            {record.code}
          </a>
        );
      },
    },
    {
      title: "Tên Khuyến Mãi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "start_date",
      render: (text, record, index) => {
        return <>{moment(record).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "end_date",
      render: (text, record, index) => {
        return <>{moment(record).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "available" ? "green" : "red"}>
          {status === "available" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "thao tác",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa đồ ăn"}
              description={"Bạn có chắc chắn muốn xóa đồ ăn này?"}
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
      <Row gutter={[20, 20]}>
        <Col span={24}>
          {/* <PromotionSearch handleSearch={handleSearch} setFilter={setFilter} /> */}
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            columns={columns}
            dataSource={listPromotion}
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
        </Col>
      </Row>

      <PromotionModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        addPromotion={handleAddPromotion}
      />

      <PromotionViewDetail
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />
    </>
  );
};

export default PromotionTable;
