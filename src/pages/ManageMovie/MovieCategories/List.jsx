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
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineReload,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputSearch from "../../../components/InputSearch/InputSearch";
import { doSetMovieGenre } from "../../../redux/movie/movieGenreSlice";
import { callFetchListUser } from "../../../services/api";

const MovieGenreList = () => {
  const genres = [
    { id: "1", code: "action", nameGenre: "Hành động" },
    { id: "2", code: "adventure", nameGenre: "Phiêu lưu" },
    { id: "3", code: "animation", nameGenre: "Hoạt hình" },
    { id: "4", code: "anime", nameGenre: "Anime" },
    { id: "5", code: "drama", nameGenre: "Kịch tính" },
    { id: "6", code: "comedy", nameGenre: "Hài hước" },
    { id: "7", code: "horror", nameGenre: "Kinh dị" },
    { id: "8", code: "science_fiction", nameGenre: "Khoa học viễn tưởng" },
    { id: "9", code: "romance", nameGenre: "Lãng mạn" },
    { id: "10", code: "thriller", nameGenre: "Hồi hộp" },
    { id: "11", code: "crime", nameGenre: "Tội phạm" },
    { id: "12", code: "family", nameGenre: "Gia đình" },
    { id: "13", code: "war", nameGenre: "Chiến tranh" },
    { id: "14", code: "martial_arts", nameGenre: "Nghệ thuật đối đầu" },
    { id: "15", code: "sports", nameGenre: "Thể thao" },
    { id: "16", code: "superhero", nameGenre: "Siêu anh hùng" },
    { id: "17", code: "fantasy", nameGenre: "Fantasy" },
    { id: "18", code: "sci_fi", nameGenre: "Khoa học viễn tưởng" },
    { id: "19", code: "historical", nameGenre: "Lịch sử" },
    { id: "20", code: "musical", nameGenre: "Âm nhạc" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mặc định #2
  const [listData, setListData] = useState(genres);
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
    const res = await callFetchListUser(query);
    if (res && res.data) {
      //   setListData(res.data.result);
      //   setTotal(res.data.meta.total);
    }

    setIsLoading(false);
  };

  // mặc định #2
  const handleDeleteData = async (dataId) => {
    // thay đổi #1 api call
    const res = await callDeleteUser(dataId);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Xoá loại phim thành công!");
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
    dispatch(doSetMovieGenre(data));
    navigate(`${url}/${data.id}`);
  };

  // thay đổi #1
  const columns = [
    {
      title: "Mã loại phim",
      dataIndex: "code",
      width: 100,
      fixed: "left",
    },
    {
      title: "Loại phim",
      dataIndex: "nameGenre",
      sorter: true,
      width: 100,
      fixed: "left",
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
              title={"Xác nhận xóa loại phim"}
              description={"Bạn có chắc chắn muốn xóa loại phim này?"}
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
        Danh sách loại phim
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
    { field: "code", label: "Mã loại phim" },
    { field: "nameGenre", label: "Loại phim" },
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
            rowKey="code"
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

export default MovieGenreList;
