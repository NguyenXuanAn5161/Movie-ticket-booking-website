import { Form, Input, Modal, message, notification } from "antd";
import { useState } from "react";
import { callReturnInvoice } from "../../services/apiOder";

const ModalCancel = ({ fetchData, openModal, setOpenModal, invoiceId }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    const response = await callReturnInvoice(invoiceId, values.reason);
    console.log("response", response);
    if (response?.status === 200) {
      setOpenModal(false);
      message.success(response.message);
      fetchData();
      form.resetFields();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: response.response.data.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title="Hủy đơn hàng"
      open={openModal}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setOpenModal(false);
        form.resetFields();
      }}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={isLoading}
    >
      <Form
        form={form}
        name="basic"
        style={{
          maxWidth: 750,
          margin: "0 auto",
        }}
        onFinish={onFinish}
        autoComplete="true"
      >
        <Form.Item
          labelCol={{ span: 24 }}
          label="Lý do hủy"
          name="reason"
          rules={[
            {
              required: true,
              message: "Không được để trống!",
            },
          ]}
        >
          <Input placeholder="Lý do hủy" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCancel;
