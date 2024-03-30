import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
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
  Upload,
  message,
  notification,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callFetchListCategoryFood } from "../../../services/apiMovie";
import { getErrorMessageCategoryFood } from "../../../utils/errorHandling";

const props = {
  beforeUpload: (file) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    if (!isImage) {
      message.error(`Tệp này không phải là tệp jpg hoặc png`);
      return Upload.LIST_IGNORE;
    }
    const isLt1M = file.size / 1024 / 1024 < 1; // Kiểm tra kích thước của file, 1MB = 1024 KB * 1024 KB
    if (!isLt1M) {
      message.error("Hình ảnh phải nhỏ hơn 1MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  },
  customRequest: ({ file, onSuccess }) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onSuccess(reader.result, file);
    };
  },
};

// thay đổi #1
const FoodCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodCategory, setFoodCategory] = useState([]);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // get category
  useEffect(() => {
    getCategoryFood();
  }, []);

  const getCategoryFood = async () => {
    let query = `size=100`;
    const res = await callFetchListCategoryFood(query);
    if (res?.content) {
      const d = res.content.map((item) => {
        return { label: item.name, value: item.id };
      });
      setFoodCategory(d);
    } else {
      const error = getErrorMessageCategoryFood(res.response.data.message);
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  const onFinish = async (values) => {
    // thay đổi #1
    setIsSubmit(true);
    // thay đổi #1 api call
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("categoryId", values.category_id);
    formData.append("sizeFood", values.sizeFood);
    formData.append("quantity", values.quantity);
    formData.append("status", values.status);
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/food",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Create food success:", response.data);
      message.success("Create food success");
      form.resetFields();
    } catch (error) {
      console.error("Error creating food:", error);
      message.error("Error creating food");
    } finally {
      setIsSubmit(false);
    }
  };

  // xử lý hình ảnh
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
            <Form.Item
              hidden
              labelCol={{ span: 24 }}
              label="Id đồ ăn"
              name="id"
            >
              <Input />
            </Form.Item>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên đồ ăn"
                name="name"
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
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng!",
                  },
                ]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Loại đồ ăn"
                name="category_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên quốc gia sản xuất phim!",
                  },
                ]}
                initialValue={1}
              >
                <Select
                  showSearch
                  allowClear
                  options={foodCategory}
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
            <Col span={8}>
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
                initialValue={true}
              >
                <Radio.Group>
                  <Radio value={true}>Còn hàng</Radio>
                  <Radio value={false}>Hết hàng</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Kich cỡ"
                name="sizeFood"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn size cho đồ ăn!",
                  },
                ]}
                initialValue={"MEDIUM"}
              >
                <Radio.Group>
                  <Radio value="SMALL">Nhỏ</Radio>
                  <Radio value="MEDIUM">Vừa</Radio>
                  <Radio value="LARGE">Lớn</Radio>
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
                <Upload
                  accept="image/*"
                  beforeUpload={() => false}
                  onChange={(info) => normFile(info)}
                  fileList={imageFile ? [imageFile] : []}
                  listType="picture-card"
                  {...props}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                </Upload>
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
