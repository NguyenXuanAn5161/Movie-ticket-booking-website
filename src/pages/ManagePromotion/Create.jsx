import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callCreatePromotionHeader } from "../../services/apiPromotion";
import { validateTwoCharVietnamese } from "../../utils/validData";

const dateFormat = "DD-MM-YYYY HH:mm";
const defaultStartDate = dayjs().startOf("day").add(1, "day");
const defaultEndDate = dayjs().endOf("day").add(1, "day");

const PromotionCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsSubmit(true);
    const res = await callCreatePromotionHeader(values);
    if (res?.status === 200) {
      message.success("Tạo mới sự kiện khuyến mãi thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/promotion");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
      setIsSubmit(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Tạo mới sự kiện khuyến mãi"
        numberBack={-1}
        type="create"
      />
      <Divider />
      <Card title="Tạo mới sự kiện khuyến mãi" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên sự kiện khuyến mãi"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sự kiện khuyến mãi!",
                  },
                  {
                    validator: validateTwoCharVietnamese(
                      "Tên sự kiện khuyến mãi"
                    ),
                  },
                ]}
              >
                <Input placeholder="Nhập tên sự kiện khuyến mãi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="timeValue"
                label="Thời gian áp dụng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian áp dụng!",
                  },
                ]}
                initialValue={[defaultStartDate, defaultEndDate]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  showTime={{ format: "HH:mm" }}
                  format={dateFormat}
                  minDate={defaultStartDate}
                  // defaultValue={[defaultStartDate, defaultEndDate]}
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                />
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

export default PromotionCreate;
