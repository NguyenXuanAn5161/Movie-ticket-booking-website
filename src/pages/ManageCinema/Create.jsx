import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callCreateUser } from "../../services/api";

const { Option } = Select;

const CinemaCreate = () => {
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const [addressData, setAddressData] = useState({
    nation: "",
    city: "",
    district: "",
    streetAddress: "",
  });

  useEffect(() => {
    form.setFieldsValue({
      city: addressData.city,
      district: addressData.district,
      streetAddress: addressData.streetAddress,
    });
  }, [addressData]);

  const handleNationChange = (value) => {
    setAddressData({
      ...addressData,
      nation: value,
      city: "",
      district: "",
      streetAddress: "",
    });
  };

  const handleCityChange = (value) => {
    setAddressData({
      ...addressData,
      city: value,
      district: "",
      streetAddress: "",
    });
  };

  const handleDistrictChange = (value) => {
    setAddressData({ ...addressData, district: value, streetAddress: "" });
  };

  const onFinish = async (values) => {
    const { city, district, name, nation, streetAddress, totalRoom } = values;
    console.log(
      "values: ",
      city,
      district,
      name,
      nation,
      streetAddress,
      totalRoom
    );

    const { fullName, email, password, phone } = values;
    setIsSubmit(true);

    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      message.success("Tạo mới rạp phim thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/admin/cinema");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
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
            <Col span={16}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên rạp"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên rạp!" }]}
              >
                <Input placeholder="Nhập tên rạp" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tổng số phòng"
                name="totalRoom"
                rules={[
                  { required: true, message: "Vui lòng nhập tổng số phòng!" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng số phòng"
                  min={5}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Quốc gia"
                name="nation"
                rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
              >
                <Select
                  placeholder="Chọn quốc gia"
                  onChange={handleNationChange}
                >
                  <Option value="Vietnam">Việt Nam</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thành phố"
                name="city"
                rules={[
                  { required: true, message: "Vui lòng nhập thành phố!" },
                ]}
              >
                <Select
                  disabled={!addressData.nation}
                  placeholder="Chọn thành phố"
                  onChange={handleCityChange}
                >
                  {addressData.nation === "Vietnam" && (
                    <>
                      <Option value="HCMC">Thành phố Hồ Chí Minh</Option>
                      <Option value="Hanoi">Thành phố Hà Nội</Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Quận / Huyện"
                name="district"
                rules={[
                  { required: true, message: "Vui lòng nhập quận / huyện!" },
                ]}
              >
                <Select
                  disabled={!addressData.city}
                  placeholder="Chọn quận / huyện"
                  onChange={handleDistrictChange}
                >
                  {addressData.city === "HCMC" ? (
                    <>
                      <Option value="Quan1">Quận 1</Option>
                      <Option value="Quan2">Quận 2</Option>
                    </>
                  ) : (
                    <>
                      <Option value="BaDinh">Ba Đình</Option>
                      <Option value="BacTuLiem">Bắc Từ Liêm</Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số nhà / Đường"
                name="streetAddress"
                rules={[
                  { required: true, message: "Vui lòng nhập số nhà / đường!" },
                ]}
              >
                <Input.TextArea
                  disabled={!addressData.district}
                  placeholder="Nhập số nhà / đường"
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
