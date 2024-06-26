import {
  Button,
  Card,
  Cascader,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  message,
  notification,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callCreateCinema } from "../../services/apiCinema";
import addressOptions from "../../utils/data";
import { getErrorMessageCinema } from "../../utils/errorHandling";

const { Option } = Select;

const CinemaCreate = () => {
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { name, status, address, street } = values;
    setIsSubmit(true);

    const res = await callCreateCinema(
      name,
      status,
      address[0], // city
      address[1], // district
      address[2], // ward
      street
    );
    if (res?.status === 201) {
      message.success("Tạo mới rạp phim thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/cinema");
    } else {
      const error = getErrorMessageCinema(res?.message, {
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
      <PageHeader title="Tạo mới rạp phim" numberBack={-1} type="create" />
      <Divider />
      <Card title="Tạo mới rạp phim" bordered={false}>
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
                label="Tên rạp"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên rạp!" }]}
              >
                <Input
                  placeholder="Nhập tên rạp"
                  style={{ textTransform: "capitalize" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={true}>Hoạt động</Radio>
                  <Radio value={false}>Ngưng hoạt động</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã"
                name="address"
                rules={[
                  {
                    required: true,
                    message:
                      "Vui lòng chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã!",
                  },
                ]}
              >
                <Cascader
                  options={addressOptions}
                  placeholder="Chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số nhà / Đường"
                name="street"
                rules={[
                  { required: true, message: "Vui lòng nhập số nhà / đường!" },
                ]}
              >
                <Input.TextArea
                  placeholder="Nhập số nhà / đường"
                  style={{ textTransform: "capitalize" }}
                />
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

export default CinemaCreate;
