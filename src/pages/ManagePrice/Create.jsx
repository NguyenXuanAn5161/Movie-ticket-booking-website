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
import { callCreateSalePrice } from "../../services/apiPrice";
import { FORMAT_DATE_HHmm } from "../../utils/constant";
import { getErrorMessageSalePriceHeader } from "../../utils/errorHandling";
import { validateTwoCharVietnamese } from "../../utils/validData";

const defaultStartDate = dayjs().startOf("day").add(1, "day");
const defaultEndDate = dayjs().endOf("day").add(1, "day");

const PriceCreate = () => {
  // mặc định #2
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, timeApply, description } = values;
    const startDate = dayjs(timeApply[0]).format("YYYY-MM-DDTHH:mm:ss.SSS");
    const endDate = dayjs(timeApply[1]).format("YYYY-MM-DDTHH:mm:ss.SSS");
    setIsSubmit(true);
    const res = await callCreateSalePrice(
      name,
      startDate,
      endDate,
      description
    );
    if (res?.status === 200) {
      message.success("Tạo mới chương trình quản lý giá thành công!");
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

  return (
    <>
      <PageHeader
        title="Tạo mới chương trình quản lý giá"
        numberBack={-1}
        type="create"
      />
      <Divider />
      <Card title="Tạo mới chương trình quản lý giá" bordered={false}>
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
            <Col span={12}>
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
                initialValue={[defaultStartDate, defaultEndDate]}
              >
                <DatePicker.RangePicker
                  showTime
                  format={FORMAT_DATE_HHmm}
                  minDate={defaultStartDate}
                  defaultValue={[defaultStartDate, defaultEndDate]}
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

export default PriceCreate;
