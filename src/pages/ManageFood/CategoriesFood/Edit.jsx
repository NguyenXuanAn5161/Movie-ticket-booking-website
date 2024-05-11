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
import { doSetFoodCategory } from "../../../redux/food/foodCategorySlice";
import {
  callGetCategoryFoodById,
  callUpdateCategoryFood,
} from "../../../services/apiFood";
import { getErrorMessageCategoryFood } from "../../../utils/errorHandling";

const FoodCategoryEdit = () => {
  const { foodCategoryId } = useParams();
  const dispatch = useDispatch();
  // thay đổi #1
  const foodCategory = useSelector((state) => state.foodCategory.foodCategory);
  // fetch lai data cinema khi f5
  useEffect(() => {
    if (!foodCategory) {
      getCategoryFoodById();
    }
  }, [foodCategory]);

  const getCategoryFoodById = async () => {
    const res = await callGetCategoryFoodById(foodCategoryId);
    if (res) {
      dispatch(doSetFoodCategory(res));
    } else {
      const error = getErrorMessageCategoryFood(res.response.data.message, {
        id: foodCategoryId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(foodCategory); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [foodCategory, form]);

  const onFinish = async (values) => {
    // thay đổi #1
    const { name, id } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callUpdateCategoryFood(id, name);
    if (res?.status === 200) {
      // thay đổi #1 message và url
      message.success("Cập nhật loại đồ ăn thành công!");
      navigate("/foodCategories");
    } else {
      const error = getErrorMessageCategoryFood(res.response.data.message, {
        name: name,
        id: id,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
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
            <Form.Item
              hidden
              labelCol={{ span: 24 }}
              label="Id loại đồ ăn"
              name="id"
            >
              <Input />
            </Form.Item>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên loại đồ ăn"
                name="name"
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
