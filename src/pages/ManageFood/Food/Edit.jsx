import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
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
  Upload,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetFood } from "../../../redux/food/foodSlice";
import {
  callFetchListCategoryFood,
  callGetFoodById,
  callUpdateFood,
} from "../../../services/apiFood";
import {
  getErrorMessageCategoryFood,
  getErrorMessageFood,
} from "../../../utils/errorHandling";

const FoodEdit = () => {
  const [foodCategory, setFoodCategory] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [initForm, setInitForm] = useState(null);
  const [initImage, setInitImage] = useState(null);

  const { foodId } = useParams();
  const dispatch = useDispatch();
  // mặc định #2
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // thay đổi #1
  const food = useSelector((state) => state.food.food);
  // fetch lai data cinema khi f5
  useEffect(() => {
    if (!food) {
      getFoodById();
    }
  }, [food]);

  const getFoodById = async () => {
    const res = await callGetFoodById(foodId);
    if (res) {
      dispatch(doSetFood(res));
    } else {
      const error = getErrorMessageFood(res.response.data.message, {
        foodId: foodId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  // get categoryFood
  useEffect(() => {
    getCategoryFood();
  }, []);

  const getCategoryFood = async () => {
    let query = `size=100`;
    const res = await callFetchListCategoryFood(query);
    console.log("res: ", res);
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
    console.log("values update food: ", values);
    if (values.image.startsWith("http")) {
      const res = await callUpdateFood(values, null);
      handleResponse(res);
    } else {
      const resImage = await callUploadImage(values.image.file);
      if (resImage?.status === 200) {
        const res = await callUpdateFood(values, resImage.data.message);
        handleResponse(res);
      }
    }
  };

  const handleResponse = (res) => {
    console.log("res update: ", res);
    if (res?.status === 200) {
      message.success("Cập nhật đồ ăn thành công!");
      navigate("/admin/food");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  // load data cho form edit
  useEffect(() => {
    if (food?.id) {
      // create data init for form update
      const init = {
        id: food.id,
        code: food.code,
        name: food.name,
        price: food.price,
        status: food.status,
        categoryId: food.categoryId,
        quantity: food.quantity,
        sizeFood: food.size,
        image: food.image,
        cinemaId: food.cinemaId,
      };
      setInitForm(init);
      setInitImage(food.image);
      setImageFile(food.image);
      // có s là set nhiều field
      form.setFieldsValue(init);
    }
    // reset field upload - bug
    return () => {
      form.resetFields();
    };
  }, [food]);

  // xử lý ảnh
  const handleRemoveFile = (file) => {
    setImageFile([]);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setImageFile(e.file);
    setInitImage(null);
    return e && e.fileList;
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
            <Form.Item
              hidden
              labelCol={{ span: 24 }}
              label="Id đồ ăn"
              name="id"
            >
              <Input />
            </Form.Item>
            <Form.Item
              hidden
              labelCol={{ span: 24 }}
              label="Id rạp"
              name="cinemaId"
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
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số lượng!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
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
                    message: "Vui lòng chọn loại đồ ăn!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  // onChange={handleChange}
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
              >
                <Radio.Group value={food?.status}>
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
                initialValue={"SMALL"}
              >
                <Radio.Group value={food?.sizeFood}>
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
                    message: "Vui lòng chọn hình ảnh!",
                  },
                ]}
              >
                <Upload
                  accept="image/*"
                  maxCount={1}
                  beforeUpload={() => false}
                  onRemove={(file) => handleRemoveFile(file)}
                  onChange={(info) => normFile(info)}
                  listType="picture-card"
                  defaultFileList={food?.image ? [{ url: food.image }] : []}
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
