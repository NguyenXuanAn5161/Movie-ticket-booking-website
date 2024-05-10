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
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { callFetchListCinema } from "../../../services/apiCinema";
import {
  callCreateFood,
  callFetchListCategoryFood,
} from "../../../services/apiFood";
import { callUploadImage } from "../../../services/apiMovie";
import { getErrorMessageCategoryFood } from "../../../utils/errorHandling";

const FoodCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodCategory, setFoodCategory] = useState([]);
  const [cinema, setCinema] = useState(null);

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
    console.log("values create food: ", values);
    setIsSubmit(true);
    const resImage = await callUploadImage(values.image.file);
    console.log("resImage", resImage);
    if (resImage?.status === 200) {
      const res = await callCreateFood(values, resImage.data.message);
      console.log("res create food: ", res);
      if (res?.status === 200) {
        message.success("Tạo mới đồ ăn thành công!");
        form.resetFields();
        setImageFile(null);
        setIsSubmit(false);
        navigate("/admin/food");
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: res.response.data.message,
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
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Loại đồ ăn"
                name="categoryId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại đồ ăn!",
                  },
                ]}
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
            <Col span={8}>
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
                getValueFromEvent={normFile}
                valuePropName="fileList"
              >
                <Upload
                  name="image"
                  accept="image/*"
                  maxCount={1}
                  beforeUpload={() => false}
                  onRemove={(file) => handleRemoveFile(file)}
                  onChange={(info) => normFile(info)}
                  listType="picture-card"
                  showUploadList={{ showPreviewIcon: false }}
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
