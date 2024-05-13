import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Radio,
  Row,
  Select,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import PageHeader from "../../../components/PageHeader/PageHeader";
import DynamicFieldsList from "../../../components/TypeInput/DynamicFieldsList";
import { callFetchListCinema } from "../../../services/apiCinema";
import {
  callFetchListMovie,
  callGetMovieById,
} from "../../../services/apiMovie";
import { callFetchListRoom } from "../../../services/apiRoom";
import { callCreateShowtime } from "../../../services/apiShowTime";

const defaultStartDate = dayjs().startOf("day").add(1, "day");

// thay đổi #1
const ScheduleCreate = () => {
  // mặc định #2
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);
  const [movie, setMovie] = useState({});
  const [cinema, setCinema] = useState({});
  const [room, setRoom] = useState([]);
  const [dataMovieSelected, setDataMovieSelected] = useState(null);

  // fetch movie đã chọn để lấy thời lượng của phim
  useEffect(() => {
    if (movie?.value) {
      fetchDataMovie(movie.value);
    }
  }, [movie]);

  const fetchDataMovie = async (id) => {
    try {
      const res = await callGetMovieById(id);
      if (res) {
        setDataMovieSelected(res);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (cinema) {
      setRoom([]);
      // reset field room
      form.resetFields(["roomId"]);
      fetchData();
    }
  }, [cinema]);

  // mặc định #2
  const fetchData = async () => {
    let query = `size=100&cinemaId=${cinema?.value}`;
    // thay đổi #1 api call
    const res = await callFetchListRoom(query);
    if (res?.content) {
      setRoom(res.content);
    }
  };

  useEffect(() => {
    if (cinema) {
      fetchMovieList();
    }
  }, [cinema]);

  const fetchMovieList = async (movieName) => {
    try {
      let query = `size=5&name=${movieName}&cinemaId=${cinema?.value}`;
      const res = await callFetchListMovie(query);
      const movie = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return movie;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching movies:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  const onFinish = async (values) => {
    console.log("Check value: ", values);

    // return;
    // thay đổi #1
    setIsSubmit(true);
    const res = await callCreateShowtime(values);
    try {
      if (res?.status === 201) {
        // thay đổi #1 message
        message.success("Tạo mới lịch chiếu phim thành công!");
        // setIsSubmit(false);
        navigate("/schedule");
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: res.response.data.message,
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

  const handleClearForm = () => {
    form.resetFields();
  };

  return (
    <>
      <PageHeader
        title="Tạo mới lịch chiếu phim"
        numberBack={-1}
        type="create"
      />
      <Divider />
      <Card
        title={
          dataMovieSelected !== null
            ? `Tạo mới lịch chiếu phim cho ${dataMovieSelected?.name} với thời lượng ${dataMovieSelected?.durationMinutes} phút`
            : "Tạo mới lịch chiếu phim"
        }
        bordered={false}
      >
        <Row>
          <Col span={24}>
            {/* Hàm onSubmit chịu trách nhiệm thôi vào data ở trên */}
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
                    label="Chọn rạp"
                    name="cinemaId"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn rạp!",
                      },
                    ]}
                  >
                    <DebounceSelect
                      value={cinema}
                      onChange={(newValue) => {
                        setCinema(newValue);
                      }}
                      placeholder="Chọn rạp"
                      fetchOptions={fetchCinemaList}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Chọn phòng chiếu"
                    name="roomId"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phòng chiếu!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      allowClear
                      // onChange={handleChange}
                      options={room.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        // Tìm kiếm không phân biệt hoa thường
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    label="Chọn phim"
                    name="movieId"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phim!",
                      },
                    ]}
                  >
                    <DebounceSelect
                      value={movie}
                      onChange={(newValue) => {
                        setMovie(newValue);
                      }}
                      placeholder="Chọn phim"
                      fetchOptions={fetchMovieList}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    labelCol={{ span: 24 }}
                    name="dateTime"
                    label="lịch chiếu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày chiếu!",
                      },
                    ]}
                  >
                    <DynamicFieldsList name="dateTime" />
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
                    Thêm
                  </Button>
                </Form.Item>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ScheduleCreate;

// Hàm fetch danh sách cinema
async function fetchCinemaList(cinemaName) {
  try {
    let query = `size=5&name=${cinemaName}`;
    const res = await callFetchListCinema(query);
    const food = res.content.map((data) => ({
      label: data.name,
      value: data.id,
    }));

    return food;
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
    console.error("Error fetching movies:", error);
    // Trả về một mảng trống nếu xảy ra lỗi
    return [];
  }
}
