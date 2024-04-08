import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Popconfirm,
  Radio,
  Row,
  Table,
  Tag,
  TimePicker,
  message,
  notification,
} from "antd";
import moment from "moment";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import PageHeader from "../../../components/PageHeader/PageHeader";

// thay đổi #1
const ScheduleCreate = () => {
  // mặc định #2
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState([]);
  const [listData, setListData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt"); // default sort by updateAt mới nhất
  const [openModalExport, setOpenModalExport] = useState(false);

  const onFinish = async (values) => {
    const check = {
      ...values,
      startTime: values["startTime"].format("HH:mm:ss"),
    };
    console.log("Check values of form: ", check);
    // thay đổi #1
    setIsSubmit(true);
    // Gọi API để tạo mới hoặc cập nhật dữ liệu với dữ liệu từ Form
    try {
      // Nếu có dữ liệu từ hàng được chọn, đó là việc cập nhật
      if (selectedRowData) {
        // Gọi API để cập nhật dữ liệu với dữ liệu từ Form
      } else {
        // Nếu không có dữ liệu từ hàng được chọn, đó là việc tạo mới
        // Gọi API để tạo mới dữ liệu với dữ liệu từ Form
      }
      // if (res && res.data) {
      if (true) {
        // thay đổi #1 message
        message.success("Tạo mới lịch chiếu phim thành công!");
        // setIsSubmit(false);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: res.message,
        });
        setIsSubmit(false);
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: "Xin vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const renderHeader = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontWeight: "500" }}>Chi tiết lịch chiếu phim</span>
    </div>
  );

  const handleEdit = (record) => {
    form.setFieldsValue({
      // movieName: record.movieName,
      cinema_id: record.cinema_id,
      room_id: record.room_id,
      show_date: moment(record.show_date), // Chuyển đổi định dạng ngày nếu cần
      startTime: moment(record.startTime), // Chuyển đổi định dạng giờ nếu cần
      status: record.status,
    });
    setSelectedRowData(record);
  };

  const columns = [
    {
      title: "Tên phim",
      dataIndex: "movieName",
      width: 120,
    },
    {
      title: "Rạp chiếu",
      dataIndex: "cinema_id",
      width: 120,
    },
    {
      title: "Phòng chiếu",
      dataIndex: "room_id",
      key: "room_id",
      width: 150,
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
      title: "Thao tác",
      width: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa lịch chiếu phim"}
              description={"Bạn có chắc chắn muốn xóa lịch chiếu phim này?"}
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
              onClick={() => handleEdit(record)}
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

  const handleClearForm = () => {
    form.resetFields();
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
                // initialValue={}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày chiếu" />
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
                    message: "Vui lòng chọn giờ chiếu!",
                  },
                ]}
                initialValue={moment()}
              >
                <TimePicker format="HH:mm" />
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
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={true}>Hoạt động</Radio>
                  <Radio value={false}>Ngưng hoạt động</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Form.Item>
              <Button type="primary" onClick={handleClearForm}>
                Xóa trắng
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                locale={{ emptyText: "Không có dữ liệu" }}
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
        </Form>
      </Card>
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
  return fetch("https://randomuser.me/api/?results=5")
    .then((response) => response.json())
    .then((body) =>
      body.results.map((user) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }))
    );
}
