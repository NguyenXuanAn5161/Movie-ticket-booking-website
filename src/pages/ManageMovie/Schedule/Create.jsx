import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  TimePicker,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
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
import { useNavigate } from "react-router-dom";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../../services/api";
import ScheduleModalForm from "./ModalForm";

// thay đổi #1
const ScheduleCreate = () => {
  // mặc định #2
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState([]);
  const [listData, setListData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState(null);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [openModalExport, setOpenModalExport] = useState(false);

  const onFinish = async (values) => {
    // thay đổi #1
    const {
      movieName,
      Image,
      trailer,
      description,
      durationInMins,
      genre_id,
      language,
      releaseDate,
      country,
      director,
      performer,
      producer,
    } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Tạo mới lịch chiếu phim thành công!");
      form.resetFields();
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/admin/shedule");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontWeight: "500" }}>Chi tiết lịch chiếu phim</span>
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
      title: "Rạp chiếu",
      dataIndex: "cinemaName",
      width: 120,
      render: (text, record, index) => {
        return <span>{moment(record.show_date).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Phòng chiếu",
      dataIndex: "type_sale",
      key: "type_sale",
      width: 150,
      render: (text, record, index) => {
        return <span>{record.type_sale === "Seat" ? "Ghế" : "Đồ ăn"}</span>;
      },
    },
    {
      title: "Ngày chiếu",
      dataIndex: "show_date",
      width: 120,
      render: (text, record, index) => {
        return <span>{moment(record.show_date).format("DD-MM-YYYY")}</span>;
      },
    },
    {
      title: "Giờ chiếu",
      dataIndex: "startTime",
      width: 120,
      render: (text, record, index) => {
        return <span>{moment(record.startDate).format("DD-MM-YYYY")}</span>;
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
      {/* // thay đổi #1 title */}
      <PageHeader
        title="Tạo mới lịch chiếu phim"
        numberBack={-1}
        type="create"
      />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới lịch chiếu phim" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[16]}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn phim"
                name="movieName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phim!",
                  },
                ]}
              >
                <DebounceSelect
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  placeholder="Chọn phim"
                  fetchOptions={fetchMovieList}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn rạp"
                name="cinema_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn rạp!",
                  },
                ]}
              >
                <DebounceSelect
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  placeholder="Chọn rạp"
                  fetchOptions={fetchMovieList}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn phòng chiếu"
                name="room_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng chiếu!",
                  },
                ]}
              >
                <DebounceSelect
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  placeholder="Chọn phòng chiếu"
                  fetchOptions={fetchMovieList}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="show_date"
                label="Ngày chiếu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày chiếu!",
                  },
                ]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="startTime"
                label="Giờ chiếu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày chiếu!",
                  },
                ]}
              >
                <Space wrap>
                  <TimePicker defaultValue={dayjs("12:08:23", "HH:mm:ss")} />
                </Space>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="status"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
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
          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>

      <ScheduleModalForm
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

export default ScheduleCreate;

// Hàm fetch danh sách phim
// async function fetchMovieList(value) {
//   try {
//     // Thực hiện gọi API hoặc tìm kiếm dữ liệu từ nguồn dữ liệu có sẵn
//     // Ví dụ: Gửi yêu cầu tới API để lấy danh sách phim dựa trên giá trị tìm kiếm `value`
//     const response = await fetch(
//       `https://example.com/api/movies?search=${value}`
//     );

//     // Kiểm tra xem kết quả trả về từ API có thành công không
//     if (!response.ok) {
//       // Xử lý lỗi nếu cần thiết, ví dụ: throw new Error("Failed to fetch movies");
//     }

//     // Chuyển đổi dữ liệu nhận được từ API sang định dạng phù hợp để hiển thị trong ô chọn phim
//     const data = await response.json();
//     const movies = data.results.map((movie) => ({
//       label: movie.title, // Label của mỗi phim, có thể là tiêu đề của phim
//       value: movie.id, // Giá trị của mỗi phim, có thể là ID của phim
//     }));

//     // Trả về một mảng các đối tượng { label: string, value: any } đại diện cho danh sách phim tìm kiếm được
//     return movies;
//   } catch (error) {
//     // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
//     console.error("Error fetching movies:", error);
//     // Trả về một mảng trống nếu xảy ra lỗi
//     return [];
//   }
// }

async function fetchMovieList(username) {
  console.log("fetching user", username);
  return fetch("https://randomuser.me/api/?results=5")
    .then((response) => response.json())
    .then((body) =>
      body.results.map((user) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }))
    );
}
