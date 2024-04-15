import { Divider, Form, Modal, Typography, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doSetUser } from "../../redux/booking/bookingSlice";
import { callFetchListUser, callFetchUserById } from "../../services/apiUser";
import DebounceSelect from "../DebounceSelect/DebounceSelect";

const UserModalFind = (props) => {
  const { openModalFind, setOpenModalFind } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.booking.user);

  useEffect(() => {
    fetchUserById();
  }, [user]);

  const fetchUserById = async () => {
    const res = await callFetchUserById(user.value);
    console.log("res user: ", res);
    if (res?.data) {
      dispatch(doSetUser(res.data));
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
  };

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    form.setFieldsValue([]);
    setOpenModalFind(false);
  };

  return (
    <>
      <Modal
        title="Tìm kiếm người dùng"
        open={openModalFind}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalFind(false);
          form.resetFields();
        }}
        okText={"Kết thúc"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
        maskClosable={false}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          style={{
            maxWidth: 450,
            margin: "0 auto",
          }}
          onFinish={onFinish}
          autoComplete="true"
        >
          <Form.Item
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Nhập địa chỉ email để tìm kiếm!",
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
          <Form.Item noStyle shouldUpdate>
            {selectedUser && (
              <Typography>
                <p>
                  <strong>Tên người dùng:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {selectedUser.phone}
                </p>
              </Typography>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModalFind;

async function fetchUserList(email) {
  try {
    const res = await callFetchListUser(null, 1, null, null, email);
    const food = res.content.map((data) => ({
      label: data.email,
      value: data.id,
    }));

    return food;
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
    console.error("Error fetching movies:", error);
    // Trả về một mảng trống nếu xảy ra lỗi
    return [];
  }
}
