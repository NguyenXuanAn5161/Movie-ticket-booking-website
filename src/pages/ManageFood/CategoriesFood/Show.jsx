import { Card, Col, Descriptions, Divider, Row } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { doSetFoodCategory } from "../../../redux/food/foodCategorySlice";
import { callGetCategoryFoodById } from "../../../services/apiFood";
import { FORMAT_DATE_HH_MM_SS } from "../../../utils/constant";
import { getErrorMessageCategoryFood } from "../../../utils/errorHandling";

const FoodCategoryShow = () => {
  const { foodCategoryId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.account.user);
  const userRoles = user?.roles;
  const checked = userRoles?.some((role) => role === "ROLE_ADMIN");

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

  const item = [
    { label: "Mã loại đồ ăn", children: foodCategory?.code },
    {
      label: "Tên loại đồ ăn",
      children: foodCategory?.name,
    },
    {
      label: "Ngày cập nhật",
      children: moment(foodCategory?.createdDate).format(FORMAT_DATE_HH_MM_SS),
    },
  ];

  return (
    <>
      <PageHeader
        title="Xem chi tiết loại đồ ăn"
        numberBack={-1}
        type="show"
        hiddenEdit={!checked}
      />
      <Divider />
      {/* <div style={{ maxHeight: "480px", overflowY: "auto" }}> */}
      <Card title="Thông tin loại đồ ăn" bordered={false}>
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
                md: 2,
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

export default FoodCategoryShow;
