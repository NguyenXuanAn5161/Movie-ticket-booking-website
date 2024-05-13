import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callCreateGenreMovie } from "../../../services/apiMovie";
import { validateTwoChar } from "../../../utils/validData";

// thay đổi #1
const MovieGenreCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // thay đổi #1
    const { name } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callCreateGenreMovie(name);
    if (res?.status === 201) {
      // thay đổi #1 message
      message.success("Tạo mới loại phim thành công!");
      form.resetFields();
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/movieGenre");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
      setIsSubmit(false);
    }
  };

  return (
    <>
      {/* // thay đổi #1 title */}
      <PageHeader title="Tạo mới loại phim" numberBack={-1} type="create" />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới loại phim" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="false"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[16]}>
            <Col span={24}>
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
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default MovieGenreCreate;
