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
import { callUpdateCinema } from "../../services/apiMovie";
import addressOptions from "../../utils/data";
import { getErrorMessageCinema } from "../../utils/errorHandling";

const CinemaEdit = () => {
  // thay đổi #1
  const cinema = useSelector((state) => state.cinema.cinema);
  // mặc định #2
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    // thay đổi #1 [], setfields
    form.setFieldsValue(cinema); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [cinema, form]);

  const onFinish = async (values) => {
    // thay đổi #1
    const { id, name, status, address, street, totalRoom } = values;
    setIsSubmit(true);
    // thay đổi #1 api call
    const res = await callUpdateCinema(
      id,
      name,
      status,
      address[0],
      address[1],
      address[2],
      street,
      totalRoom
    );
    console.log("res: ", res);
    if (res?.status === 200) {
      // thay đổi #1 message và url
      message.success("Cập nhật rạp phim thành công!");
      navigate("/admin/cinema");
    } else {
      const error = getErrorMessageCinema(res.message, {
        id: id,
        name: name,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
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
            <Form.Item labelCol={{ span: 24 }} hidden label="id" name="id">
              <Input />
            </Form.Item>
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
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Chọn Tỉnh/Thành phố, Quận/Huyện và Phường/Xã!",
                  },
                ]}
                initialValue={
                  cinema?.address
                    ? [
                        cinema?.address.city,
                        cinema?.address.district,
                        "Phường Tân Định",
                      ]
                    : []
                }
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
                initialValue={cinema?.address?.street}
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
