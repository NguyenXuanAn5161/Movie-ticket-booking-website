import { Form, Input, InputNumber, Modal, Select, Switch } from "antd";
import React, { useState } from "react";

const { Option } = Select;

const PromotionLineModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, setOpenViewDetail } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionSwitch, setPermissionSwitch] = useState(false);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
    setIsSubmitting(true);
    // Thực hiện gọi API để tạo Promotion Line ở đây
    setTimeout(() => {
      setIsSubmitting(false);
      setOpenModalCreate(false);
    }, 2000); // Giả lập việc gọi API trong 2 giây
  };

  const handleCancel = () => {
    setOpenModalCreate(false);
    setOpenViewDetail(true);
    form.resetFields();
  };

  return (
    <Modal
      title="Tạo chương trình con"
      open={openModalCreate}
      width={"50vw"}
      onCancel={handleCancel}
      okText={"Tạo mới"}
      cancelText={"Hủy"}
      confirmLoading={isSubmitting}
      maskClosable={false}
      // onOk={()=> onFinish()}
    >
      <Form
        name="createPromotionLine"
        onFinish={onFinish}
        labelCol={{ span: 24 }} // Label nằm trên input
        wrapperCol={{ span: 24 }} // Input nằm dưới label
      >
        <Form.Item
          label="Mã"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã ưu đãi!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên ưu đãi!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Loại ưu đãi"
          name="type_promotion"
          rules={[{ required: true, message: "Vui lòng chọn loại ưu đãi!" }]}
        >
          <Select>
            <Option value="%">Phần trăm</Option>
            <Option value="quantity">Số lượng</Option>
          </Select>
        </Form.Item>

        {/* Thêm trường từ "Promotion Detail" */}
        <Form.Item
          label="Chi tiết ưu đãi"
          required
          style={{ marginBottom: "20px" }}
        >
          <Input.Group compact>
            <Form.Item
              name={["promotionDetail", "discount_value"]}
              noStyle
              rules={[
                { required: true, message: "Vui lòng nhập giá trị giảm giá!" },
              ]}
            >
              <InputNumber
                style={{ width: "33%" }}
                placeholder="Giảm giá"
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
            <Form.Item
              name={["promotionDetail", "min_spend"]}
              noStyle
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập chi tiêu tối thiểu!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "33%" }}
                placeholder="Chi tiêu tối thiểu"
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="VND"
              />
            </Form.Item>
            <Form.Item
              name={["promotionDetail", "max_spend"]}
              noStyle
              rules={[
                { required: true, message: "Vui lòng nhập chi tiêu tối đa!" },
              ]}
            >
              <InputNumber
                style={{ width: "34%" }}
                placeholder="Chi tiêu tối đa"
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter="VND"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          valuePropName="checked"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Switch
            autoFocus={true}
            defaultChecked="Không hoạt động"
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PromotionLineModalCreate;
