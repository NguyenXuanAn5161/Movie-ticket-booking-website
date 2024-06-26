import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetMovie } from "../../../redux/movie/movieSlice";
import { callFetchListCinema } from "../../../services/apiCinema";
import {
  callFetchListGenreMovie,
  callGetMovieById,
  callUpdateMovie,
  callUploadImage,
} from "../../../services/apiMovie";
import { validateMovieName } from "../../../utils/validData";

const MovieEdit = () => {
  // thay đổi #1
  const movie = useSelector((state) => state.movie.movie);
  const { movieId } = useParams();
  const dispatch = useDispatch();
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const [listGenre, setListGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(
    movie?.imageLink ? [movie.imageLink] : []
  );
  const [cinema, setCinema] = useState(null);

  // fetch cinema lần đầu khi có movie
  useEffect(() => {
    if (movie?.cinemaIds) {
      fetchCinemaByCinemaIds(movie.cinemaIds);
    }
  }, [movie]);

  const fetchCinemaByCinemaIds = async (cinemaIds) => {
    let size = cinemaIds.length;
    let query = `size=${size}&cinemaId=${cinemaIds.map((item) => item.id)}`;
    const res = await callFetchListCinema(query);
    if (res?.content) {
      setCinema(
        res.content.map((item) => ({ label: item.name, value: item.id }))
      );
    }
  };

  // f5 fetch data
  useEffect(() => {
    if (!movie) {
      getMovieById();
    }
  }, [movie]);

  const getMovieById = async () => {
    const res = await callGetMovieById(movieId);
    if (res) {
      dispatch(doSetMovie(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  useEffect(() => {
    fetchDataGenre();
  }, []);

  const fetchDataGenre = async () => {
    setIsLoading(true);
    let query = `&size=100`;
    const res = await callFetchListGenreMovie(query);
    if (res?.content) {
      setListGenre(res.content);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (cinema) {
      form.resetFields();
      // thay đổi #1 [], setfields
      form.setFieldsValue(movie);
      form.setFieldsValue({ cinemaId: cinema });
      form.setFieldsValue({ releaseDate: moment(movie.releaseDate) });
    }
  }, [movie, form, cinema]);

  const onFinish = async (values) => {
    // thay đổi #1
    setIsSubmit(true);
    // thay đổi #1 api call
    console.log("values update movie: ", values);
    if (
      typeof values.imageLink === "string" &&
      values.imageLink.startsWith("https")
    ) {
      console.log("values update movie khong anh: ");
      const res = await callUpdateMovie(values, null);
      handleResponse(res);
    } else {
      const resImage = await callUploadImage(values.imageLink.file);
      if (resImage?.data?.status === 200) {
        const res = await callUpdateMovie(values, resImage.data.message);
        handleResponse(res);
      }
    }
    setIsSubmit(false);
  };

  const handleResponse = (res) => {
    console.log("res update: ", res);
    if (res?.status === 200) {
      message.success("Cập nhật phim thành công!");
      navigate("/movie");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  // xử lý ảnh
  const handleRemoveFile = (file) => {
    setImageFile([]);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setImageFile(e.file);
    return e && e.fileList;
  };

  return (
    <>
      <PageHeader title="Cập nhật thông tin phim" numberBack={-1} type="edit" />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Form.Item hidden labelCol={{ span: 24 }} label="Id phim" name="id">
              <Input />
            </Form.Item>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên phim"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên phim!",
                  },
                  {
                    validator: validateMovieName,
                  },
                ]}
              >
                <Input placeholder="Nhập tên phim" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  mode="multiple"
                  style={{ textAlign: "start" }}
                  value={cinema}
                  onChange={(newValue) => {
                    setCinema(newValue);
                  }}
                  placeholder="Chọn rạp"
                  fetchOptions={fetchCinemaList}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Trạng thái"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
              >
                <Radio.Group value={movie?.status}>
                  <Radio value={true}>Được chiếu</Radio>
                  <Radio value={false}>Ngưng chiếu</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="genreId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng thể loại phim!",
                  },
                ]}
                initialValue={movie?.genres.map((item) => item.id)}
              >
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  // onChange={handleChange}
                  options={listGenre.map((item) => ({
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
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thời lượng"
                name="durationMinutes"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thời lượng của phim!",
                  },
                ]}
              >
                <InputNumber
                  min={10}
                  style={{ width: "100%" }}
                  addonAfter={"Phút"}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ngày sản xuất"
                name="releaseDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày sản xuất của phim!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                  placeholder="Chọn ngày sản xuất"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Quốc gia"
                name="country"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên quốc gia sản xuất phim!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đạo diễn"
                name="director"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đạo diễn!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Nhà sản xuất"
                name="producer"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhà sản xuất phim!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Diễn viên"
                name="cast"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên các diễn viên chính!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả của phim!",
                  },
                ]}
              >
                <Input.TextArea
                  style={{ width: "100%" }}
                  placeholder="Nhập mô tả"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Hình ảnh"
                name="imageLink"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình ảnh!",
                  },
                ]}
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  beforeUpload={() => false}
                  onRemove={(file) => handleRemoveFile(file)}
                  onChange={(info) => normFile(info)}
                  listType="picture-card"
                  defaultFileList={
                    movie?.imageLink ? [{ url: movie.imageLink }] : []
                  }
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Trailer"
                name="trailerLink"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập link trailer!",
                  },
                  {
                    type: "url",
                    message: "Vui lòng nhập đúng định dạng link!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Form.Item>
              <Button loading={isSubmit} type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default MovieEdit;

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
