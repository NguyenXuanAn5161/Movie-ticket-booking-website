import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  TimePicker,
  message,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetSchedule } from "../../../redux/schedule/scheduleSlice";
import { callFetchListCinema } from "../../../services/apiCinema";
import { callFetchListMovie } from "../../../services/apiMovie";
import { callFetchListRoom } from "../../../services/apiRoom";
import {
  callGetShowtimeById,
  callUpdateShowtime,
} from "../../../services/apiShowTime";

const ScheduleEdit = () => {
  const { movieScheduleId } = useParams();
  // thay đổi #1
  const dispatch = useDispatch();

  const schedule = useSelector((state) => state.schedule.schedule);

  useEffect(() => {
    console.log("schedule", schedule);
  }, [schedule]);

  // fetch lai data schedule khi f5
  useEffect(() => {
    getScheduleById(movieScheduleId);
  }, [movieScheduleId]);

  const getScheduleById = async () => {
    const res = await callGetShowtimeById(movieScheduleId);
    if (res) {
      dispatch(doSetSchedule(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  // mặc định #2
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [value, setValue] = useState([]);
  const [cinema, setCinema] = useState({});
  const [room, setRoom] = useState({});

  const fetchCinemaList = async (cinemaName) => {
    try {
      let query = `size=5&name=${cinemaName}`;
      const res = await callFetchListCinema(query);
      const cinema = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return cinema;
    } catch (error) {
      console.error("Error fetching cinema list:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  const fetchRoomList = async (roomName) => {
    try {
      let query = `size=5&name=${roomName}&cinemaId=${cinema.value}`;
      const res = await callFetchListRoom(query);
      const room = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return room;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching room:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(schedule);
    if (schedule) {
      form.setFieldsValue({
        showDate: moment(schedule?.showDate),
        showTime: moment(schedule?.showTime, "HH:mm"),
      });
    }
  }, [schedule, form]);

  const onFinish = async (values) => {
    console.log("value check: ", values);
    const res = await callUpdateShowtime(values);

    console.log("res", res);
    if (res?.status === 200) {
      message.success("Cập nhật lịch chiếu thành công!");
      navigate("/schedule");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Cập nhật thông tin lịch chiếu phim"
        numberBack={-1}
        type="edit"
      />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
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
                  disabled={true}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn rạp"
                name="cinemaName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn rạp!",
                  },
                ]}
              >
                <DebounceSelect
                  style={{ textAlign: "start" }}
                  value={cinema}
                  onChange={(newValue) => {
                    dispatch(doSetSelectedCinema(newValue));
                    setCinema(newValue);
                  }}
                  placeholder="Chọn rạp"
                  fetchOptions={fetchCinemaList}
                  disabled={true}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn phòng chiếu"
                name="roomName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng chiếu!",
                  },
                ]}
              >
                <DebounceSelect
                  value={room}
                  onChange={(newValue) => {
                    setRoom(newValue);
                  }}
                  placeholder="Chọn phòng chiếu"
                  fetchOptions={fetchRoomList}
                  disabled={true}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="showDate"
                label="Ngày chiếu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày chiếu!",
                  },
                ]}
              >
                <DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày chiếu" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="showTime"
                label="Giờ chiếu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giờ chiếu!",
                  },
                ]}
              >
                <TimePicker format="HH:mm" placeholder="Chọn giờ chiếu" />
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
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Cập nhật
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default ScheduleEdit;

const fetchMovieList = async (movieName) => {
  try {
    let query = `size=5&name=${movieName}`;
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
