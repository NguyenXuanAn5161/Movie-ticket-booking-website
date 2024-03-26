import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callUpdateUser } from "../../services/api";

const PriceEdit = () => {
  // thay đổi #1
  const price = useSelector((state) => state.price.price);
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(price); // Cập nhật dữ liệu vào form
  }, [price, form]);

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
      message.success("Cập nhật giá sản phẩm thành công!");
      navigate("/admin/price");
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
      <PageHeader title="Cập nhật thông tin giá" numberBack={-1} type="edit" />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Mã giá sản phẩm"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã giá sản phẩm!",
                  },
                ]}
              >
                <Input placeholder="Nhập mã giá sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên giá sản phẩm"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên giá sản phẩm!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên giá sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={6}>
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
                <Radio.Group value={price?.status}>
                  <Radio.Button value={true}>Hoạt động</Radio.Button>
                  <Radio.Button value={false}>Ngưng hoạt động</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày bắt đầu!",
                  },
                ]}
              >
                <Input type="date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ngày kết thúc"
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày kết thúc!",
                  },
                ]}
              >
                <Input type="date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="description"
                label="Mô Tả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Nhập mô tả" />
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

export default PriceEdit;
