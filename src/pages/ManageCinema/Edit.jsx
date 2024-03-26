import {
  Button,
  Card,
  Cascader,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
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

  // const [addressData, setAddressData] = useState({
  //   nation: cinema?.address?.nation || "",
  //   city: cinema?.address?.city || "",
  //   district: cinema?.address?.district || "",
  //   streetAddress: cinema?.address?.streetAddress || "",
  // });

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    console.log("cinema: ", cinema);
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
                  <Radio value={true}>Hoạt động</Radio>
                  <Radio value={false}>Ngưng hoạt động</Radio>
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
                  disabled
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng số phòng"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã"
                name="addressaa"
                rules={[
                  {
                    required: true,
                    message: "Chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã!",
                  },
                ]}
                // initialValue={addressData.nation}
              >
                <Cascader
                  options={null}
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
                <Input.TextArea placeholder="Nhập số nhà / đường" />
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
