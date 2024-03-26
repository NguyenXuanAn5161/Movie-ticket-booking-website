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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callUpdateUser } from "../../../services/api";

const FoodCategoryEdit = () => {
  // thay đổi #1
  const foodCategory = useSelector((state) => state.foodCategory.foodCategory);

  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(foodCategory); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [foodCategory, form]);

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
      message.success("Cập nhật loại đồ ăn thành công!");
      navigate("/admin/foodCategories");
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
      <PageHeader
        title="Cập nhật thông tin loại đồ ăn"
        numberBack={-1}
        type="edit"
      />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Mã loại đồ ăn"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã loại đồ ăn!",
                  },
                ]}
              >
                <Input placeholder="Nhập mã loại đồ ăn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên loại đồ ăn"
                name="categoryName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên loại đồ ăn!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên loại đồ ăn" />
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

export default FoodCategoryEdit;
