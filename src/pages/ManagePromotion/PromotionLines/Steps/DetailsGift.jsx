import { Col, Form, InputNumber, Row, Select, Space } from "antd";
import React, { useEffect, useState } from "react";

const PromotionDetailsGift = ({ form }) => {
  const data = [
    {
      id: "1",
      code: "item_001",
      image: "path/to/image1.jpg",
      foodName: "Popcorn",
      category_id: "1",
      size: "Medium",
      price: 20000,
      status: "unavailable",
    },
    {
      id: "2",
      code: "item_002",
      image: "path/to/image2.jpg",
      foodName: "Nước ngọt",
      category_id: "1",
      size: "Small",
      price: 45000,
      status: "available",
    },
    {
      id: "3",
      code: "item_003",
      image: "path/to/image3.jpg",
      foodName: "Bánh quy",
      category_id: "2",
      size: "Small",
      price: 30000,
      status: "available",
    },
    {
      id: "4",
      code: "item_004",
      image: "path/to/image4.jpg",
      foodName: "Kẹo cao su",
      category_id: "2",
      size: "Small",
      price: 1.99,
      status: "unavailable",
    },
    {
      id: "5",
      code: "item_005",
      image: "path/to/image5.jpg",
      foodName: "Bắp rang",
      category_id: "3",
      size: "Large",
      price: 6.99,
      status: "available",
    },
    {
      id: "6",
      code: "item_006",
      image: "path/to/image6.jpg",
      foodName: "Kem",
      category_id: "3",
      size: "Small",
      price: 3.99,
      status: "available",
    },
    {
      id: "7",
      code: "item_007",
      image: "path/to/image7.jpg",
      foodName: "Bánh hamburger",
      category_id: "3",
      size: "Small",
      price: 5.99,
      status: "available",
    },
    {
      id: "8",
      code: "item_008",
      image: "path/to/image8.jpg",
      foodName: "Nacho",
      category_id: "3",
      size: "Large",
      price: 7.99,
      status: "available",
    },
    {
      id: "9",
      code: "item_009",
      image: "path/to/image9.jpg",
      foodName: "Nước trái cây",
      category_id: "4",
      size: "Small",
      price: 3.49,
      status: "available",
    },
    {
      id: "10",
      code: "item_010",
      image: "path/to/image10.jpg",
      foodName: "Cốc nước lạnh",
      category_id: "4",
      size: "Large",
      price: 2.99,
      status: "unavailable",
    },
  ];

  const [selectedGifts, setSelectedGifts] = useState([]);

  const options = data.map((item) => ({
    label: item.foodName, // Hiển thị tên món ăn trong dropdown
    value: item.id, // Giá trị của mỗi mục trong dropdown
  }));

  // Hàm xử lý sự kiện khi chọn danh sách quà tặng
  const handleGiftChange = (value) => {
    setSelectedGifts(value);
  };

  useEffect(() => {
    form.setFieldsValue({
      listGift: selectedGifts, // Đặt giá trị ban đầu cho listGift tại đây
    });
  }, [selectedGifts]);

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Chọn danh sách quà tặng"
            name="listGift"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất 1 quà tặng!",
              },
            ]}
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
                value={selectedGifts}
                placeholder="Chọn danh sách quà tặng"
                options={options}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                optionFilterProp="children"
                filterOption={(input, option) =>
                  // Tìm kiếm không phân biệt hoa thường
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleGiftChange}
              />
            </Space>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chi tiêu tối thiếu"
            name="minSpend"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} addonAfter={"VND"} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chi tiêu tối đa"
            name="maxSpend"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} addonAfter={"VND"} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionDetailsGift;
