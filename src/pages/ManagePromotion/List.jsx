import {
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  Tag,
  message,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../components/InputSearch/InputSearch";
import { doSetPromotion } from "../../redux/promotion/promotionSlice";
import { callDeleteUser } from "../../services/api";

const PromotionList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mặc định #2
  const [listData, setListData] = useState([
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
          applicable_object: "all",
          type: "discount",
          type_promotion: "percent",
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
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
          applicable_object: "level_silver",
          type: "discount",
          type_promotion: "amount",
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "available",
          promotionDetails: {
            id: "10201",
            promotion_line_id: "102",
            discount_value: 20000,
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
          applicable_object: "all",
          type: "gift",
          type_promotion: null,
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "available",
          promotionDetails: {
            id: "20101",
            promotion_line_id: "201",
            listGift: ["Bánh quy", "Nước ngọt"],
            discount_value: 150000, // Giá trị của ưu đãi là 150.000 VNĐ (giảm giá trực tiếp)
            min_spend: 0, // Không có điều kiện tối thiểu về chi tiêu
            max_spend: 500000,
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
          uses_per_customer: 1,
          uses_per_promotion: 1000,
          status: "unavailable",
        },
      ],
    },
  ]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [openModalImport, setOpenModalImport] = useState(false);
  const [openModalExport, setOpenModalExport] = useState(false);

  // mặc định #2
  useEffect(() => {
    fetchData();
  }, [current, pageSize, filter, sortQuery]);

  // khi thay doi current va pageSize thi search died!
  // mặc định #2
  const fetchData = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }

    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    // thay đổi #1 api call
    // const res = await callFetchListUser(query);
    // if (res && res.data) {
    //   setListData(res.data.result);
    //   setTotal(res.data.meta.total);
    // }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteUser(dataId);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Xoá khuyến mãi thành công!");
      await fetchData();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
  };

  const handleView = (data, url) => {
    // thay đổi #1
    const { id, code, name, start_date, end_date, description, status } = data;
    dispatch(doSetPromotion(data));
    navigate(`${url}/${data.code}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Mã khuyến mãi",
      dataIndex: "code",
      width: 150,
      fixed: "left",
    },
    {
      title: "Tên khuyến mãi",
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
              // thay đổi #1 sửa title và description
              title={"Xác nhận xóa khuyến mãi"}
              description={"Bạn có chắc chắn muốn xóa khuyến mãi này?"}
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
              onClick={() => handleView(record, "show")}
            />
            <CiEdit
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleView(record, "edit");
              }}
            />
          </>
        );
      },
    },
  ];

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* thay đổi #1 */}
      <span style={{ fontWeight: "700", fontSize: "16" }}>
        Danh sách khuyến mãi
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
          icon={<AiOutlineImport />}
          type="primary"
          onClick={() => setOpenModalImport(true)}
        >
          Import
        </Button>
        <Button
          icon={<AiOutlinePlus />}
          type="primary"
          onClick={(event) => {
            // Điều hướng đến trang mới và truyền userId qua URL
            navigate(`create`);
          }}
        >
          Thêm mới
        </Button>
        <Button
          type="ghost"
          onClick={() => {
            setFilter("");
            setSortQuery("");
          }}
        >
          <AiOutlineReload />
        </Button>
      </span>
    </div>
  );

  // mặc định #2
  const handleSearch = (query) => {
    setFilter(query);
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

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
  };

  // thay đổi #1
  const itemSearch = [
    { field: "name", label: "Tên khuyến mãi" },
    { field: "start_date", label: "Ngày bắt đầu" },
    { field: "end_date", label: "Ngày kết thúc" },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch itemSearch={itemSearch} handleSearch={handleSearch} />
        </Col>
        <Col span={24}>
          <Table
            scroll={{
              x: "100%",
              y: 200,
            }}
            title={renderHeader}
            bordered
            // thay đổi #1
            // loading={isLoading}
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
    </>
  );
};

export default PromotionList;
