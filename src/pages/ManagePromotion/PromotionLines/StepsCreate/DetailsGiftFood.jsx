import { Col, Form, InputNumber, Row } from "antd";
import React, { useEffect, useState } from "react";
import DebounceSelect from "../../../../components/DebounceSelect/DebounceSelect";
import {
  callFetchListFood,
  callGetFoodById,
} from "../../../../services/apiFood";

const PromotionDetailsGiftFood = ({ form, promotionFoodDetailDto, type }) => {
  const [foodRequired, setFoodRequired] = useState(null);
  const [foodPromotion, setFoodPromotion] = useState(null);

  useEffect(() => {
    form.setFieldsValue(promotionFoodDetailDto);
  }, [promotionFoodDetailDto, form]);

  useEffect(() => {
    if (foodRequired && foodPromotion) {
      form.setFieldsValue({
        foodRequired: foodRequired,
      });

      form.setFieldsValue({
        foodPromotion: foodPromotion,
      });
    }
    console.log("foodRequired", foodRequired);
  }, [foodRequired, foodPromotion]);

  // fetch đồ ăn lần đầu khi có dữ liệu đồ ăn
  useEffect(() => {
    if (promotionFoodDetailDto?.foodRequired) {
      fetchFoodRequired(promotionFoodDetailDto.foodRequired);
    }

    if (promotionFoodDetailDto?.foodPromotion) {
      fetchFoodPromotion(promotionFoodDetailDto.foodPromotion);
    }
  }, [promotionFoodDetailDto]);

  const fetchFoodRequired = async (foodId) => {
    const res = await callGetFoodById(foodId);
    if (res) {
      setFoodRequired({ label: res.name, value: res.id });
    }
  };
  const fetchFoodPromotion = async (foodId) => {
    const res = await callGetFoodById(foodId);
    if (res) {
      setFoodPromotion({ label: res.name, value: res.id });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={type === "update" ? true : false}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Đồ ăn cần mua"
            name="foodRequired"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <DebounceSelect
              value={foodRequired}
              onChange={(newValue) => {
                setFoodRequired(newValue);
              }}
              placeholder="Chọn đồ ăn"
              fetchOptions={fetchFoodList}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lượng mua tối thiểu"
            name="quantityRequired"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min={1}
              max={99}
              addonAfter="món"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Sản phẩm tặng"
            name="foodPromotion"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <DebounceSelect
              value={foodPromotion}
              onChange={(newValue) => {
                setFoodPromotion(newValue);
              }}
              placeholder="Chọn đồ ăn"
              fetchOptions={fetchFoodList}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lượng tặng cho 1 hóa đơn"
            name="quantityPromotion"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} addonAfter={"món"} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionDetailsGiftFood;

// Hàm fetch danh sách phim
async function fetchFoodList(foodName) {
  try {
    let query = `size=5&name=${foodName}&cinemaId=1`;
    const res = await callFetchListFood(query);
    const foodRequired = res.content.map((data) => ({
      label: data.name,
      value: data.id,
    }));

    return foodRequired;
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
    console.error("Error fetching movies:", error);
    // Trả về một mảng trống nếu xảy ra lỗi
    return [];
  }
}
