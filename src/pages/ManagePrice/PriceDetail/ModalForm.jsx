import {
  Col,
  Divider,
  Form,
  Input,
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
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import {
  callFetchListFood,
  callFetchListTypeSeat,
} from "../../../services/apiMovie";
import {
  callCreateSalePriceDetail,
  callUpdateSalePriceDetail,
} from "../../../services/apiPrice";

const PriceDetailModalForm = (props) => {
  const [form] = Form.useForm();
  const { formType, data, setData, openModal, setOpenModal, fetchData } = props;
  const [current, setCurrent] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [priceType, setPriceType] = useState("");
  const [typeSeat, setTypeSeat] = useState([]);
  const [food, setFood] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTypeSeat();
  }, []);

  const fetchTypeSeat = async () => {
    setIsLoading(true);
    const res = await callFetchListTypeSeat();
    if (res) {
      const data = res.map((item) => {
        return {
          label:
            item?.name === "STANDARD"
              ? "Ghế thường"
              : item?.name === "VIP"
              ? "Ghế vip"
              : "Ghế đôi",
          value: item.id,
        };
      });
      setTypeSeat(data);
    }
    setIsLoading(false);
  };

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

  useEffect(() => {
    if (formType === "update" || formType === "view") {
      if (data?.typeSeat) {
        setSelectedItems(data?.typeSeat);
        setPriceType("seat");
      } else {
        const food = {
          label: data?.food.name,
          value: data?.food.id,
        };
        setFood(food);
        setPriceType("food");
      }
    } else {
      setPriceType("seat");
    }
  }, [data, formType]);

  const onFinish = async (values) => {
    setIsSubmit(true);

    if (formType === "create") {
      const { priceId, price, status, type_sale } = values;
      const itemId = type_sale === "seat" ? selectedItems : food.value;
      console.log("check", type_sale, priceId, price, status, itemId);
      console.log("listItems", values.listItems);
      const res = await callCreateSalePriceDetail(
        type_sale,
        priceId,
        price,
        status,
        itemId
      );

      console.log("res", res);

      if (res?.status === 200) {
        message.success("Tạo mới giá sản phẩm thành công!");
        form.resetFields();
        setFood([]);
        setOpenModal(false);
        setPriceType("seat");
        await props.fetchSalePriceDetail();
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: res.response.data.message,
        });
      }
    } else if (formType === "update") {
      // Xử lý logic cập nhật giá ở đây
      let itemId = null;
      let type_sale = null;
      if (data?.typeSeat) {
        itemId = selectedItems;
        type_sale = "seat";
      } else {
        itemId = food.value;
        type_sale = "food";
      }
      const { priceDetailId, price, status } = values;
      console.log("check", priceDetailId, price, status, itemId, type_sale);

      const res = await callUpdateSalePriceDetail(
        priceDetailId,
        price,
        status,
        itemId,
        type_sale
      );

      console.log("res", res);

      if (res?.status === 200) {
        message.success("Cập nhật giá sản phẩm thành công!");
        setOpenModal(false);
        setPriceType("seat");
        // await props.fetchUser();
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: res.response.data.message,
        });
      }
    }

    setIsSubmit(false);
  };

  // Xử lý khi đóng modal
  const handleCancel = () => {
    setOpenModal(false);
    setFood([]);
    setPriceType("seat");
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
          maxWidth: 550,
          margin: "0 auto",
        }}
        onFinish={onFinish}
        autoComplete="true"
        disabled={isDisabled}
      >
        <Row gutter={16}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="id priceHeader"
            name="priceId"
            hidden
          >
            <Input />
          </Form.Item>
          {formType === "update" && (
            <Form.Item
              labelCol={{ span: 24 }}
              label="id priceDetail"
              name="priceDetailId"
              hidden
              initialValue={data?.id}
            >
              <Input />
            </Form.Item>
          )}
          {!(formType === "update") && (
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
                initialValue={priceType}
              >
                <Radio.Group onChange={handlePriceTypeChange}>
                  <Radio value={"seat"} style={radioStyle}>
                    Ghế
                  </Radio>
                  <Radio value={"food"} style={radioStyle}>
                    Đồ ăn
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          )}
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
          <Col span={12}>
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
              initialValue={true}
            >
              <Radio.Group>
                <Radio value={true}>Hoạt động</Radio>
                <Radio value={false}>Ngưng hoạt động</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              label={`Áp dụng cho ${
                priceType === "seat" ? "loại ghế" : "đồ ăn"
              }`}
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
                {priceType === "seat" ? (
                  <Select
                    // mode="multiple"
                    allowClear
                    showSearch
                    style={{
                      width: "100%",
                    }}
                    placeholder={`Chọn danh sách ${"loại ghế"}`}
                    options={typeSeat}
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
                ) : (
                  <DebounceSelect
                    // mode="multiple"
                    value={food}
                    onChange={(newValue) => {
                      setFood(newValue);
                    }}
                    placeholder="Chọn đồ ăn"
                    fetchOptions={fetchFoodList}
                  />
                )}
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PriceDetailModalForm;

// Hàm fetch danh sách phim
async function fetchFoodList(foodName) {
  try {
    let query = `size=5&name=${foodName}`;
    const res = await callFetchListFood(query);
    const food = res.content.map((data) => ({
      label: data.name,
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
