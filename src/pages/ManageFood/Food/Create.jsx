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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import {
  callCreateFood,
  callFetchListCategoryFood,
} from "../../../services/apiMovie";
import {
  getErrorMessageCategoryFood,
  getErrorMessageFood,
} from "../../../utils/errorHandling";

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
    const { name, price, quantity, categoryId, status, sizeFood } = values;
    setIsSubmit(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("sizeFood", sizeFood);
    formData.append("quantity", quantity);
    formData.append("status", status);
    formData.append("image", imageFile);

    const res = await callCreateFood(formData);
    if (res?.status === 200) {
      // thay đổi #1 message
      message.success("Tạo mới đồ ăn thành công!");
      form.resetFields();
      setImageFile(null);
      setIsSubmit(false);
      // thay đổi #1 thay đổi url
      navigate("/admin/food");
    } else {
      const error = getErrorMessageFood(res.response.data.message, {
        name: name,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
      setIsSubmit(false);
    }
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
      <PageHeader title="Tạo mới đồ ăn" numberBack={-1} type="create" />
      <Divider />
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
                name="categoryId"
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
