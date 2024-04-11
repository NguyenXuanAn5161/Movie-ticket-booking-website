import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callFetchListCinema } from "../../../services/apiCinema";
import {
  callCreateMovie,
  callFetchListGenreMovie,
  callUploadImage,
} from "../../../services/apiMovie";

// thay đổi #1
const MovieCreate = () => {
  // mặc định #2
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listGenre, setListGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  // const [imageUrl, setImageUrl] = useState("");
  // const [dataThumbnail, setDataThumbnail] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [cinema, setCinema] = useState(null);

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

  const onFinish = async (values) => {
    // thay đổi #1
    setIsSubmit(true);
    // thay đổi #1 api call
    const releaseDate = dayjs(values.releaseDate).format("YYYY-MM-DD");
    // const dateFormat = dayjsvalues.releaseDate
    const resImage = await callUploadImage(values.image.file);
    console.log("resImage", resImage.data);
    if (resImage?.status === 200) {
      const resMovie = await callCreateMovie(
        values,
        releaseDate,
        resImage.data.message
      );
      if (resMovie?.status === 201) {
        // thay đổi #1 message
        message.success("Tạo mới phim thành công!");
        form.resetFields();
        setIsSubmit(false);
        // thay đổi #1 thay đổi url
        navigate("/admin/movie");
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: resMovie.response.data.message,
        });
        setIsSubmit(false);
      }
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
      {/* // thay đổi #1 title */}
      <PageHeader title="Tạo mới phim" numberBack={-1} type="create" />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới phim" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[16]}>
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
                <Radio.Group>
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
                    message: "Vui lòng chọn thể loại!",
                  },
                ]}
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
                name="durationInMins"
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
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập chọn hình ảnh!",
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
                name="trailer"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trailer!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
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
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default MovieCreate;

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
