import {
  Button,
  Col,
  Popconfirm,
  Row,
  Table,
  message,
  notification,
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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../../components/InputSearch/InputSearch";
import { doSetMovie } from "../../../redux/movie/movieSlice";
import { callFetchListUser } from "../../../services/api";

const MovieList = () => {
  const data = [
    {
      id: "1",
      code: "MOV001",
      movieName: "Kẻ Trộm Giấc Mơ",
      title: "Inception",
      image: "inception.jpg",
      description:
        "Một tên trộm đạo chích với khả năng đánh cắp bí mật của doanh nghiệp thông qua công nghệ chia sẻ giấc mơ được giao nhiệm vụ ngược lại là trồng một ý tưởng vào tâm trí của một CEO.",
      durationInMins: 148,
      genreName: "khoa-học-viễn-tưởng",
      language: "Tiếng Anh",
      releaseDate: "2010-07-16",
      country: "Mỹ",
      director: "Christopher Nolan",
      performer: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
      producer: "Christopher Nolan, Emma Thomas",
      status: "Đang chiếu",
      showTimes: [
        {
          id: "1",
          code: "ST001",
          show_date: "2024-03-20",
          startTime: "19:00",
          endTime: "21:28",
          room_id: "R001",
          cinema_id: "C001",
          seats_booked: 50,
          status: true,
        },
        {
          id: "2",
          code: "ST002",
          show_date: "2024-03-21",
          startTime: "21:30",
          endTime: "23:58",
          room_id: "R001",
          cinema_id: "C001",
          seats_booked: 30,
          status: true,
        },
        {
          id: "3",
          code: "ST003",
          show_date: "2024-03-23",
          startTime: "21:30",
          endTime: "23:58",
          room_id: "R001",
          cinema_id: "C001",
          seats_booked: 30,
          status: true,
        },
      ],
    },
    {
      id: "2",
      code: "MOV002",
      movieName: "Người Vận Chuyển",
      title: "The Transporter",
      image: "transporter.jpg",
      description:
        "Frank Martin, một tay lái xe chuyên nghiệp ở Pháp chấp nhận các nhiệm vụ đưa hàng cho các tên tội phạm mà không hỏi bất kỳ câu hỏi nào.",
      durationInMins: 92,
      genreName: "hành-động",
      language: "Tiếng Anh",
      releaseDate: "2002-10-11",
      country: "Pháp",
      director: "Louis Leterrier, Corey Yuen",
      performer: "Jason Statham, Shu Qi, Matt Schulze",
      producer: "Luc Besson",
      status: "Sắp chiếu",
      showTimes: [
        {
          id: "3",
          code: "ST003",
          show_date: "2024-03-22",
          startTime: "18:00",
          endTime: "19:32",
          room_id: "R002",
          cinema_id: "C002",
          seats_booked: 20,
          status: true,
        },
        {
          id: "4",
          code: "ST004",
          show_date: "2024-03-23",
          startTime: "20:00",
          endTime: "21:32",
          room_id: "R002",
          cinema_id: "C002",
          seats_booked: 40,
          status: true,
        },
      ],
    },
    {
      id: "3",
      code: "MOV003",
      movieName: "Hoa Mắt",
      title: "Eyes Wide Shut",
      image: "eyes-wide-shut.jpg",
      description:
        "Một bác sĩ thành phố New York vô tình khám phá ra một cộng đồng bí mật của người thừa kế tầm quan trọng của ông.",
      durationInMins: 159,
      genreName: "tâm-lý",
      language: "Tiếng Anh",
      releaseDate: "1999-07-16",
      country: "Mỹ",
      director: "Stanley Kubrick",
      performer: "Tom Cruise, Nicole Kidman, Todd Field",
      producer: "Stanley Kubrick",
      status: "Ngưng chiếu",
      showTimes: [
        // {
        //   id: "5",
        //   code: "ST005",
        //   show_date: "2024-03-24",
        //   startTime: "17:30",
        //   endTime: "19:29",
        //   room_id: "R003",
        //   cinema_id: "C003",
        //   seats_booked: 15,
        //   status: true,
        // },
        // {
        //   id: "6",
        //   code: "ST006",
        //   show_date: "2024-03-25",
        //   startTime: "19:30",
        //   endTime: "21:29",
        //   room_id: "R003",
        //   cinema_id: "C003",
        //   seats_booked: 25,
        //   status: true,
        // },
      ],
    },
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mặc định #2
  const [listData, setListData] = useState(data);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
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
    const res = await callFetchListUser(query);
    if (res && res.data) {
      // setListData(res.data.result);
      // setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteUser(dataId);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Xoá phim thành công!");
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
    dispatch(doSetMovie(data));
    navigate(`${url}/${data.id}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      width: 100,
      fixed: "left",
    },
    {
      title: "Tên phim",
      dataIndex: "movieName",
      sorter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "releaseDate",
      width: 150,
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "genreName",
      width: 150,
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      sorter: true,
    },
    {
      title: "Cập nhật ngày",
      dataIndex: "updatedAt",
      width: 150,
      render: (text, record, index) => {
        return (
          <span>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</span>
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
              // thay đổi #1 sửa title và description
              title={"Xác nhận xóa phim"}
              description={"Bạn có chắc chắn muốn xóa phim này?"}
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDeleteData(record._id)}
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
      <span style={{ fontWeight: "700", fontSize: "16" }}>Danh sách phim</span>
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
    { field: "movieName", label: "Tên phim" },
    { field: "author", label: "Tác giả" },
    { field: "movieCategories", label: "Thể loại" },
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputSearch
            itemSearch={itemSearch}
            handleSearch={handleSearch}
            setFilter={setFilter}
          />
        </Col>
        <Col span={24}>
          <Table
            locale={{ emptyText: "Không có dữ liệu" }}
            scroll={{
              x: "100%",
              y: 280,
            }}
            title={renderHeader}
            bordered
            // thay đổi #1
            // loading={isLoading}
            columns={columns}
            dataSource={listData}
            onChange={onChange}
            // thay đổi #1
            rowKey="_id"
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

export default MovieList;
