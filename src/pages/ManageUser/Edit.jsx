import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Tag,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { callUpdateUser } from "../../services/api";

const UserEdit = () => {
  const user = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState(user);
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(user); // Cập nhật dữ liệu vào form khi userData thay đổi
  }, [user, form]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

  const onFinish = async (values) => {
    const { _id, fullName, phone } = values;
    setIsSubmit(true);
    const res = await callUpdateUser(_id, fullName, phone);
    if (res && res.data) {
      message.success("Cập nhật người dùng thành công!");
      navigate("/admin/user");
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
            name="_id"
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
            name="fullName"
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
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giới tính"
                name="gender"
                // rules={[
                //   {
                //     required: true,
                //     message: "Không được để trống!",
                //   },
                // ]}
              >
                {/* onChange={handleChange} */}
                <Radio.Group name="gender" defaultValue={"male"}>
                  <Radio value={"male"}>Nam</Radio>
                  <Radio value={"female"}>Nữ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                labelCol={{ span: 24 }}
                name="birthday"
                label="Ngày sinh"
                // rules={[
                //   {
                //     required: true,
                //     message: "Không được để trống!",
                //   },
                // ]}
              >
                <Input type="date" />
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
            name="status"
            label="Trạng thái"
            // rules={[
            //   {
            //     required: true,
            //     message: "Không được để trống!",
            //   },
            // ]}
          >
            {user?.status === "active" ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                {user.status}
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">
                {user.status || "Không hoạt động"}
              </Tag>
            )}
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
