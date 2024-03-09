import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callUpdateUser } from "../../../services/api";

const MovieEdit = () => {
  // thay đổi #1
  const movie = useSelector((state) => state.movie.movie);
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(movie); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [movie, form]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

  const onFinish = async (values) => {
    console.log("value check: ", values);
    // thay đổi #1
    const { _id, fullName, phone } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callUpdateUser(_id, fullName, phone);
    if (res && res.data) {
      // thay đổi #1 message và url
      message.success("Cập nhật phim thành công!");
      navigate("/admin/movie");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <PageHeader title="Cập nhật thông tin phim" numberBack={-1} type="edit" />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên phim"
                name="movieName"
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
                  <Radio.Button value="Đang chiếu">Đang chiếu</Radio.Button>
                  <Radio.Button value="Sắp chiếu">Sắp chiếu</Radio.Button>
                  <Radio.Button value="Ngưng chiếu">Ngưng chiếu</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="genre_id"
                // rules={[
                //   {
                //     required: true,
                //     message: "Vui lòng nhập tên quốc gia sản xuất phim!",
                //   },
                // ]}
              >
                <Select
                  // defaultValue={null}
                  showSearch
                  allowClear
                  // onChange={handleChange}
                  // options={listCategory}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ngôn ngữ của phim"
                name="language"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngôn ngữ của phim!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
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
                label="Ngày chiếu"
                name="releaseDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày chiếu của phim!",
                  },
                ]}
              >
                <Input type="date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Quốc gia sản xuất phim"
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
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Diễn viên"
                name="performer"
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

            <Col span={6}>
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
                    message: "Vui lòng nhập tổng số phòng!",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
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
