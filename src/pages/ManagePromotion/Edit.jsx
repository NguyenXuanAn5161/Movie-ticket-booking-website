import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomDatePicker from "../../components/DatePicker/CustomDatePicker";
import PageHeader from "../../components/PageHeader/PageHeader";
import { doSetPromotion } from "../../redux/promotion/promotionSlice";
import {
  callGetPromotionHeaderById,
  callUpdatePromotionHeader,
} from "../../services/apiPromotion";
import {
  FORMAT_DATE_HH_MM_SS,
  FORMAT_DATE_TIME_SEND_SERVER,
} from "../../utils/constant";
import {
  defaultEndDate,
  defaultStartDate,
  formatDateYYYY_MM_DDT_HH_MM_SS,
} from "../../utils/date";

const PromotionEdit = () => {
  // thay đổi #1
  const { promotionId } = useParams();
  const dispatch = useDispatch();
  const promotionHeader = useSelector((state) => state.promotion.promotion);

  // fetch data f5
  useEffect(() => {
    if (!promotionHeader) {
      getPromotionHeaderById();
    }
  }, [promotionHeader]);

  const getPromotionHeaderById = async () => {
    const res = await callGetPromotionHeaderById(promotionId);
    if (res) {
      dispatch(doSetPromotion(res));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
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
    form.setFieldsValue(promotionHeader); // Cập nhật dữ liệu vào form
  }, [promotionHeader, form]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

  const onFinish = async (values) => {
    console.log("value check: ", values);
    // thay đổi #1
    const { id, name, timeApply, description, status } = values;
    const checked = checkStartDate(timeApply[0]);
    var startDate = null;
    if (!checked) {
      startDate = dayjs(timeApply[0]).format(FORMAT_DATE_TIME_SEND_SERVER);
    }
    const endDate = dayjs(timeApply[1]).format(FORMAT_DATE_TIME_SEND_SERVER);
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callUpdatePromotionHeader(
      id,
      name,
      startDate,
      endDate,
      description,
      status
    );
    if (res?.status === 200) {
      // thay đổi #1 message và url
      message.success("Cập nhật khuyến mãi thành công thành công!");
      navigate("/admin/promotion");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
    setIsSubmit(false);
  };

  const checkStartDate = (promotionStartDate) => {
    const currentDate = formatDateYYYY_MM_DDT_HH_MM_SS(defaultStartDate);
    const result = promotionStartDate && promotionStartDate < currentDate;
    return result;
  };

  return (
    <>
      <PageHeader
        title="Cập nhật thông tin khuyến mãi"
        numberBack={-1}
        type="edit"
      />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Form.Item hidden labelCol={{ span: 24 }} label="Id" name="id">
              <Input />
            </Form.Item>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên khuyến mãi"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên khuyến mãi!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên khuyến mãi" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="timeApply"
                label="Khoảng thời gian áp dụng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày bắt đầu!",
                  },
                ]}
                initialValue={
                  promotionHeader
                    ? [
                        dayjs(promotionHeader?.startDate),
                        dayjs(promotionHeader?.endDate),
                      ]
                    : [defaultStartDate, defaultEndDate]
                }
              >
                <CustomDatePicker
                  disabled={[checkStartDate(promotionHeader?.startDate), false]}
                  showTime
                  format={FORMAT_DATE_HH_MM_SS}
                  minDate={defaultStartDate}
                  defaultValue={[
                    promotionHeader?.startDate,
                    promotionHeader?.endDate,
                  ]}
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
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
                <Radio.Group value={promotionHeader?.status}>
                  <Radio value={true}>Hoạt động</Radio>
                  <Radio value={false}>Ngưng hoạt động</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="description"
                label="Mô Tả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả!",
                  },
                ]}
              >
                <Input.TextArea placeholder="Nhập mô tả" />
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

export default PromotionEdit;
