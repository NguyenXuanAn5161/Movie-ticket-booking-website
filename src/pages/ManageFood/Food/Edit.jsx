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

const FoodEdit = () => {
  // thay đổi #1
  const food = useSelector((state) => state.food.food);
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(food); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [food, form]);

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
      message.success("Cập nhật đồ ăn thành công!");
      navigate("/admin/food");
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
        title="Cập nhật thông tin đồ ăn"
        numberBack={-1}
        type="edit"
      />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
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
                label="Trạng thái"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
              >
                <Radio.Group value={food?.status}>
                  <Radio.Button value="available">Có sẵn</Radio.Button>
                  <Radio.Button value="unavailable">Hết hàng</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
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
                <Radio.Group value={food?.size}>
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

export default FoodEdit;
