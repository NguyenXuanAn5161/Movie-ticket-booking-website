import { Col, Form, Input, Radio, Row, notification } from "antd"; // Import Input và Button từ Ant Design
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  doSetSelectedMethodInfoUser,
  doSetUser,
} from "../../redux/booking/bookingSlice";
import { callFetchListUser, callFetchUserById } from "../../services/apiUser";
import DebounceSelect from "../DebounceSelect/DebounceSelect";

const InfoUser = (props) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.booking.user);

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        selectedUsername: selectedUser.username,
        selectedEmail: selectedUser.email,
        selectedPhone: selectedUser.phone,
      });
    }
  }, [selectedUser]);

  const [form] = Form.useForm();
  const [value, setValue] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    dispatch(doSetSelectedMethodInfoUser(value));
    if (value !== 1) {
      setUser(null);
      dispatch(doSetUser(null));
      form.resetFields();
    }
  }, [value]);

  useEffect(() => {
    console.log("selectedUser: ", selectedUser);
    if (selectedUser && selectedUser.enabled === false) {
      notification.error({
        message: "Tài khoản đã bị khóa!",
        description: "Vui lòng chọn tài khoản khác",
      });
      dispatch(doSetUser(null));
    }
  }, [selectedUser]);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const onFinish = (values) => {
    console.log("values: ", values);
  };

  const onChangeName = (e) => {
    const name = e.target.value;
    if (!/^[a-zA-Z]{2,}(\s+[a-zA-Z]+)*$/.test(name)) {
      // Hiển thị thông báo lỗi hoặc xử lý theo ý muốn của bạn
      return;
    }
    console.log("name: ", name);
    dispatch(
      doSetUser({
        selectedUser: name,
      })
    );
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    if (!/^([a-zA-Z0-9._-]+)@(gmail|yahoo|outlook)\.com$/.test(email)) {
      // Hiển thị thông báo lỗi hoặc xử lý theo ý muốn của bạn
      return;
    }
    console.log("email: ", email);
    dispatch(
      doSetUser({
        ...selectedUser,
        selectedEmail: email,
      })
    );
  };

  const fetchUserList = async (email) => {
    let query = `size=1&email=${email}`;
    try {
      const res = await callFetchListUser(query);
      const user = res.content.map((data) => ({
        label: data.email,
        value: data.id,
      }));
      return user;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching user:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserById(user.value);
    }
  }, [user]);

  const fetchUserById = async (id) => {
    try {
      const res = await callFetchUserById(id);
      if (res?.data) {
        dispatch(doSetUser(res.data));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <Form
      form={form}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="true"
      style={{ margin: "0 auto" }}
    >
      <Col span={24}>
        <Form.Item
          labelCol={{ span: 24 }}
          label="Loại khách hàng"
          name="typeCustomer"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn loại khách hàng!",
            },
          ]}
          initialValue={value}
        >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>Đã có tài khoản</Radio>
            {/* <Radio value={2}>Tạo tài khoản mới</Radio> */}
            <Radio value={3}>Khách hàng vãng lai</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      <Row gutter={16}>
        {
          // Nếu value === 1 thì hiển thị ô input email
          value === 1 && (
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                ]}
              >
                <DebounceSelect
                  style={{ textAlign: "start" }}
                  value={user}
                  onChange={(newValue) => {
                    setUser(newValue);
                  }}
                  placeholder="Tìm kiếm người dùng"
                  fetchOptions={fetchUserList}
                />
              </Form.Item>
            </Col>
          )
        }
        {
          // Nếu value === 2 thì hiển thị ô input name
          value === 2 && (
            <>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Họ tên"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên!",
                    },
                    {
                      pattern: /^[a-zA-Z]{2,}(\s+[a-zA-Z]+)*$/,
                      message:
                        "Họ tên phải có ít nhất 2 chữ cái và không chứa ký tự đặc biệt",
                    },
                  ]}
                >
                  <Input placeholder="Nhập họ tên" onChange={onChangeName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                    {
                      pattern: /^(.+)@(gmail|yahoo|outlook)\.com$/,
                      message:
                        "Email phải có định dạng @gmail.com, @yahoo.com hoặc @outlook.com",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" onChange={onChangeEmail} />
                </Form.Item>
              </Col>
            </>
          )
        }
        {selectedUser?.id && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Họ tên: "
                name="selectedUsername"
                initialValue={selectedUser.username}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Email: "
                name="selectedEmail"
                initialValue={selectedUser.email}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số điện thoại: "
                name="selectedPhone"
                initialValue={selectedUser.phone}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Row>
    </Form>
  );
};

export default InfoUser;
