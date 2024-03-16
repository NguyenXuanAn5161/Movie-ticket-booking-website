import {
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";

const PriceDetailModalForm = (props) => {
  const [form] = Form.useForm();
  const { formType, data, setData, openModal, setOpenModal } = props;
  const [current, setCurrent] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [priceType, setPriceType] = useState("");

  const isDisabled = formType === "view" ? true : false;
  const radioStyle = {
    pointerEvents: isDisabled ? "none" : "auto", // Tắt hoặc bật sự kiện click
    opacity: isDisabled ? 0.5 : 1, // Làm mờ hoặc không làm mờ nút radio
  };

  // Hàm xử lý khi người dùng thay đổi loại giá
  const handlePriceTypeChange = (e) => {
    setPriceType(e.target.value);
    setSelectedItems([]); // Reset danh sách ghế hoặc đồ ăn đã chọn khi chuyển loại giá
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [form, data, formType]);

  useEffect(() => {
    form.setFieldsValue({
      listItems: selectedItems,
    });
  }, [selectedItems]);

  const options = [
    {
      label: "Ghế thường",
      value: "standard",
    },
    {
      label: "Ghế vip",
      value: "vip",
    },
    {
      label: "Ghế đôi",
      value: "sweet",
    },
  ];

  const foodOptions = [
    {
      label: "Thức ăn 1",
      value: "food1",
    },
    {
      label: "Thức ăn 2",
      value: "food2",
    },
    {
      label: "Thức ăn 3",
      value: "food3",
    },
  ];

  useEffect(() => {
    if (formType === "update" || formType === "view") {
      const ids =
        data?.list_seat_type_id?.length > 0
          ? data.list_seat_type_id
          : data?.list_food_id?.length > 0
          ? data.list_food_id
          : [];
      setSelectedItems(ids);
      setPriceType(data?.type_sale);
    } else {
      setPriceType("seat");
    }
  }, [data, formType]);

  const onFinish = async (values) => {
    console.log("check value: ", values);

    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    // const res = await callCreateUser(fullName, email, password, phone);
    // if (res && res.data) {
    if (true) {
      message.success("Tạo mới giá sản phẩm thành công!");
      form.resetFields();
      setOpenModal(false);
      setPriceType("seat");
      // await props.fetchUser();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  // Xử lý khi đóng modal
  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
    if (!(formType === "create")) {
      setData(null);
    }
    setPriceType("seat");
    setCurrent(0);
  };

  return (
    <Modal
      title={
        formType === "create"
          ? "Thêm mới chi tiết giá"
          : formType === "update"
          ? "Cập nhật chi tiết giá"
          : "Xem chi tiết giá"
      }
      open={openModal}
      width={"40vw"}
      onOk={() => {
        form.submit();
      }}
      onCancel={handleCancel}
      okText={"Tạo mới"}
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
        disabled={isDisabled}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Giá cho"
              name="type_sale"
              rules={[
                {
                  required: true,
                  message: "Không được để trống!",
                },
              ]}
              initialValue={"seat"}
            >
              <Radio.Group onChange={handlePriceTypeChange}>
                <Radio.Button value="seat" style={radioStyle}>
                  Ghế
                </Radio.Button>
                <Radio.Button value="food" style={radioStyle}>
                  Đồ ăn
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Giá tiền"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Giá tiền không được để trống!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={0}
                addonAfter="VND"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          labelCol={{ span: 24 }}
          label={`Áp dụng cho ${priceType === "seat" ? "loại ghế" : "đồ ăn"}`}
          name="listItems"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn ít nhất 1 ${
                priceType === "seat" ? "loại ghế" : "đồ ăn"
              }!`,
            },
          ]}
          initialValue={selectedItems}
        >
          <Space
            style={{
              width: "100%",
            }}
            direction="vertical"
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              style={{
                width: "100%",
              }}
              placeholder={`Chọn danh sách ${
                priceType === "seat" ? "loại ghế" : "đồ ăn"
              }`}
              options={priceType === "seat" ? options : foodOptions}
              value={selectedItems}
              onChange={(value) => setSelectedItems(value)}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              // optionFilterProp="children"
              filterOption={(input, option) =>
                // Tìm kiếm không phân biệt hoa thường
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PriceDetailModalForm;
