import { Card, Col, Descriptions, Divider, Image, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetFood } from "../../../redux/food/foodSlice";
import {
  callGetCategoryFoodById,
  callGetFoodById,
} from "../../../services/apiMovie";
import { imageError } from "../../../utils/imageError";

const FoodShow = () => {
  const [foodCategory, setFoodCategory] = useState(null);
  const { foodId } = useParams();
  const dispatch = useDispatch();
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
        id: foodId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  useEffect(() => {
    console.log("category: ", foodCategory);
  }, [foodCategory]);

  // get tên theo loại đồ ăn
  // fetch lai data cinema khi f5
  useEffect(() => {
    if (food) {
      getCategoryFoodById();
    }
  }, [food]);

  const getCategoryFoodById = async () => {
    const res = await callGetCategoryFoodById(food?.categoryId);
    if (res) {
      setFoodCategory(res);
    } else {
      const error = getErrorMessageCategoryFood(res.response.data.message, {
        id: food?.categoryId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

  const item = [
    { label: "Mã đồ ăn", children: food?.code },
    {
      label: "Tên đồ ăn",
      children: food?.name,
    },
    {
      label: "Giá",
      children: (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(food?.price ?? 0)}
        </span>
      ),
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={food?.status ? "success" : "error"}>
          {food?.status ? "Còn hàng" : "Hết hàng"}
        </Tag>
      ),
    },
    {
      label: "Loại đồ ăn",
      children: foodCategory?.name,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Size",
      children: food?.size,
      span: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
      },
    },
    {
      label: "Hình ảnh",
      children: (
        <Image
          width={200}
          height={200}
          src={food?.image}
          fallback={imageError}
          alt="Lỗi tải hình ảnh"
        />
      ),
      span: {
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
      },
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết đồ ăn" numberBack={-1} type="show" />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin đồ ăn" bordered={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Descriptions
              labelStyle={{ color: "#333", fontWeight: "700" }}
              layout="vertical"
              bordered
              size="small"
              column={{
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 4,
              }}
              items={item}
            />
          </Col>
        </Row>
      </Card>
      {/* </div> */}
    </>
  );
};

export default FoodShow;
