import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callUpdateUser } from "../../services/api";

const CinemaEdit = () => {
  // thay đổi #1
  const cinema = useSelector((state) => state.cinema.cinema);
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const [addressData, setAddressData] = useState({
    nation: cinema?.address?.nation || "",
    city: cinema?.address?.city || "",
    district: cinema?.address?.district || "",
    streetAddress: cinema?.address?.streetAddress || "",
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

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(cinema); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [cinema, form]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

  const onFinish = async (values) => {
    console.log("value check: ", values);
    // thay đổi #1
    const { _id, fullName, phone } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callUpdateUser(_id, fullName, phone);
    // if (res && res.data) {
    if (true) {
      // thay đổi #1 message và url
      message.success("Cập nhật rạp phim thành công!");
      navigate("/admin/cinema");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <PageHeader
        title="Cập nhật thông tin rạp phim"
        numberBack={-1}
        type="edit"
      />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16]}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên rạp phim"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên rạp phim!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên rạp phim" />
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
                <Radio.Group value={cinema?.status}>
                  <Radio.Button value="available">Hoạt động</Radio.Button>
                  <Radio.Button value="unavailable">
                    Ngưng hoạt động
                  </Radio.Button>
                </Radio.Group>
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
                initialValue={addressData.nation}
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
                initialValue={addressData.city}
              >
                <Select
                  disabled={!addressData.nation}
                  placeholder="Chọn thành phố"
                  onChange={handleCityChange}
                >
                  {addressData.nation && (
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
                initialValue={addressData.district}
              >
                <Select
                  disabled={!addressData.city}
                  placeholder="Chọn quận / huyện"
                  onChange={handleDistrictChange}
                >
                  {addressData.city === "Thành phố Hồ Chí Minh" ? (
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
                initialValue={addressData.streetAddress}
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

export default CinemaEdit;
