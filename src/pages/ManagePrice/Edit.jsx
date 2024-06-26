import {
  Button,
  Card,
  Col,
  DatePicker,
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
import PageHeader from "../../components/PageHeader/PageHeader";
import { doSetPrice } from "../../redux/price/priceSlice";
import {
  callGetPriceHeaderById,
  callUpdateSalePrice,
} from "../../services/apiPrice";
import { FORMAT_DATE_HHmm } from "../../utils/constant";
import {
  defaultEndDate,
  defaultStartDate,
  formatDateYYYY_MM_DDT_HH_MM_SS,
} from "../../utils/date";
import { getErrorMessageSalePriceHeader } from "../../utils/errorHandling";
import { validateTwoCharVietnamese } from "../../utils/validData";

const PriceEdit = () => {
  const { priceId } = useParams();
  const dispatch = useDispatch();

  const price = useSelector((state) => state.price.price);

  // fetch data f5
  useEffect(() => {
    if (!price) {
      getPriceHeaderById();
    }
  }, [price]);

  const getPriceHeaderById = async () => {
    const res = await callGetPriceHeaderById(priceId);
    if (res) {
      dispatch(doSetPrice(res));
    } else {
      const error = getErrorMessageSalePriceHeader(res.response.data.message, {
        id: priceId,
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
    form.setFieldsValue(price); // Cập nhật dữ liệu vào form
  }, [price, form]);

  const onFinish = async (values) => {
    console.log("check value: ", values);
    const { id, name, timeApply, description, status } = values;
    const checked = checkStartDate(timeApply[0]);
    var startDate = null;
    if (!checked) {
      startDate = dayjs(timeApply[0]).format("YYYY-MM-DDTHH:mm:ss.SSS");
    }
    const endDate = dayjs(timeApply[1]).format("YYYY-MM-DDTHH:mm:ss.SSS");
    setIsSubmit(true);
    const res = await callUpdateSalePrice(
      id,
      name,
      startDate,
      endDate,
      description,
      status
    );
    console.log("res", res);
    if (res?.status === 200) {
      message.success("cập nhật chương trình quản lý giá thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/price");
    } else {
      const error = getErrorMessageSalePriceHeader(res.response.data.message, {
        name: name,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
      setIsSubmit(false);
    }
  };

  // check price?.startDate nhỏ hơn ngày hiện tại - return true
  const checkStartDate = (priceStartDate) => {
    const currentDate = formatDateYYYY_MM_DDT_HH_MM_SS(defaultStartDate);
    const result = priceStartDate && priceStartDate < currentDate;
    return result;
  };

  return (
    <>
      <PageHeader
        title="Cập nhật thông tin chương trình quản lý giá"
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
                label="Tên chương trình quản lý giá"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên chương trình quản lý giá!",
                  },
                  {
                    validator: validateTwoCharVietnamese(
                      "Tên chương trình quản lý giá"
                    ),
                  },
                ]}
              >
                <Input placeholder="Nhập tên chương trình quản lý giá" />
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
                  price
                    ? [dayjs(price?.startDate), dayjs(price?.endDate)]
                    : [defaultStartDate, defaultEndDate]
                }
              >
                <DatePicker.RangePicker
                  disabled={[checkStartDate(price?.startDate), false]}
                  showTime
                  format={FORMAT_DATE_HHmm}
                  minDate={defaultStartDate}
                  defaultValue={[price?.startDate, price?.endDate]}
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
                {/* vẫn cho phép cập nhật giá bình thường vì đã có valid kiểm tra ngày của nó rồi chứ không phải chỉ dựa vào trạng thái */}
                <Radio.Group value={price?.status}>
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

export default PriceEdit;
