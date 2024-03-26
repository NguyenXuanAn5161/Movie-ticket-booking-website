import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../../services/api";

// thay đổi #1
const FoodCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // thay đổi #1
    const { image, foodName, category_id, size, price, status } = values;
    console.log("value: ", values);
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      // thay đổi #1 message
      message.success("Tạo mới đồ ăn thành công!");
      form.resetFields();
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/admin/food");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };

  return (
    <>
      {/* // thay đổi #1 title */}
      <PageHeader title="Tạo mới đồ ăn" numberBack={-1} type="create" />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới đồ ăn" bordered={false}>
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
                label="Tên đồ ăn"
                name="foodName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đồ ăn!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên đồ ăn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá!",
                  },
                ]}
              >
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  min={1000}
                  style={{ width: "100%" }}
                  addonAfter={"VND"}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Loại đồ ăn"
                name="category_id"
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
                label="Size"
                name="size"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn size cho đồ ăn!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio.Button value="Small">Small</Radio.Button>
                  <Radio.Button value="Medium">Medium</Radio.Button>
                  <Radio.Button value="Large">Large</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Hình ảnh"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình ảnh!",
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
    </>
  );
};

export default FoodCreate;
