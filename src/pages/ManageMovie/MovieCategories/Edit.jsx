import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetMovieGenre } from "../../../redux/movie/movieGenreSlice";
import {
  callGetGenreMovieById,
  callUpdateGenreMovie,
} from "../../../services/apiMovie";
import { validateTwoChar } from "../../../utils/validData";

const MovieGenreEdit = () => {
  const { categoryMovieId } = useParams();
  const dispatch = useDispatch();
  // thay đổi #1
  const movieGenre = useSelector((state) => state.movieGenre.movieGenre);
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  // f5 fetch data
  useEffect(() => {
    if (!movieGenre) {
      getMovieGenreById();
    }
  }, [movieGenre]);

  const getMovieGenreById = async () => {
    const res = await callGetGenreMovieById(categoryMovieId);
    if (res) {
      dispatch(doSetMovieGenre(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(movieGenre); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [movieGenre, form]);

  const onFinish = async (values) => {
    // thay đổi #1
    const { id, name } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callUpdateGenreMovie(id, name);
    if (res?.status === 200) {
      // thay đổi #1 message và url
      message.success("Cập nhật loại phim thành công!");
      navigate("/movieGenre");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <PageHeader
        title="Cập nhật thông tin loại phim"
        numberBack={-1}
        type="edit"
      />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Id loại phim"
                name="id"
                hidden
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên loại phim"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại phim!",
                  },
                  {
                    validator: validateTwoChar("Tên thể loại"),
                  },
                ]}
              >
                <Input placeholder="Nhập tên loại phim" />
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

export default MovieGenreEdit;
