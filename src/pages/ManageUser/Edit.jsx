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
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callUpdateUser } from "../../services/apiMovie";
import { getErrorMessageUser } from "../../utils/errorHandling";

const UserEdit = () => {
  const user = useSelector((state) => state.user.user);
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...user,
      birthday: user?.birthday ? moment(user.birthday, "YYYY-MM-DD") : null,
    });
  }, [user, form]);

  const onFinish = async (values) => {
    const { id, username, gender, birthday, email, phone, enabled } = values;
    const bd = birthday.format("YYYY-MM-DD");
    setIsSubmit(true);
    const res = await callUpdateUser(
      id,
      username,
      gender,
      bd,
      email,
      phone,
      enabled
    );
    console.log("res", res);
    if (res && res.data) {
      message.success("Cập nhật người dùng thành công!");
      navigate("/admin/user");
    } else {
      const error = getErrorMessageUser(res.response.data.message, id);
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
        title="Cập nhật thông tin người dùng"
        numberBack={-1}
        type="edit"
      />
      <Card bordered={false}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            hidden
            labelCol={{ span: 24 }}
            label="Id"
            name="id"
            rules={[
              {
                required: true,
                message: "Id không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Họ và tên"
            name="username"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giới tính"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
                initialValue={user?.gender === true ? "true" : "false"}
              >
                <Radio.Group>
                  <Radio value={true}>Nam</Radio>
                  <Radio value={false}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="birthday"
                label="Ngày sinh"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <DatePicker
                  picker="date"
                  format="DD-MM-YYYY"
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            labelCol={{ span: 24 }}
            name="enabled"
            label="Trạng thái"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
            initialValue={user?.enabled === true ? "true" : "false"}
          >
            <Radio.Group>
              <Radio value={true}>Hoạt động</Radio>
              <Radio value={false}>Không hoạt động</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button loading={isSubmit} type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default UserEdit;
