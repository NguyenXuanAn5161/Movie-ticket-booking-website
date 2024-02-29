import { Button, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";

const { Option } = Select;

const PromotionModalCreate = ({
  openModalCreate,
  setOpenModalCreate,
  addPromotion,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setOpenModalCreate(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // Gửi dữ liệu đi
      console.log(">>> Submitted values:", values);
      setLoading(false);
      form.resetFields();
      setOpenModalCreate(false);
      // Thêm mới chương trình khuyến mãi vào mảng
      addPromotion(values);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  return (
    <Modal
      title="Tạo Mới Chương Trình Khuyến Mãi"
      visible={openModalCreate}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Tạo Mới
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên Khuyến Mãi"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khuyến mãi!",
            },
          ]}
        >
          <Input placeholder="Nhập tên khuyến mãi" />
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã Khuyến Mãi"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã khuyến mãi!",
            },
          ]}
        >
          <Input placeholder="Nhập mã khuyến mãi" />
        </Form.Item>
        <Form.Item
          name="start_date"
          label="Ngày Bắt Đầu"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngày bắt đầu!",
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          name="end_date"
          label="Ngày Kết Thúc"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ngày kết thúc!",
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả!",
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập mô tả" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng Thái"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn trạng thái!",
            },
          ]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="available">Hoạt động</Option>
            <Option value="unavailable">Không hoạt động</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PromotionModalCreate;
