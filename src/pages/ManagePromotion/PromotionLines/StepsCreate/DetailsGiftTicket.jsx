import { Col, Form, InputNumber, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { callFetchListTypeSeat } from "../../../../services/apiMovie";

const PromotionDetailsGiftTicket = ({ form }) => {
  const [typeSeat, setTypeSeat] = useState(null);
  useEffect(() => {
    fetchTypeSeat();
  }, []);

  const fetchTypeSeat = async () => {
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
  };

  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Loại ghế cần mua"
            name="typeSeatRequired"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              options={typeSeat}
              placeholder="Chọn loại ghế"
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
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lượng mua tối thiểu"
            name="quantityRequired"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "100%",
              }}
              min={1}
              max={99}
              addonAfter="món"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Loại ghế được tặng"
            name="typeSeatPromotion"
            rules={[
              {
                required: true,
                message: "Không được để trống!",
              },
            ]}
          >
            <Select
              // defaultValue={null}
              showSearch
              allowClear
              // onChange={handleChange}
              options={typeSeat}
              placeholder="Chọn loại ghế"
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
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số lượng tặng cho 1 hóa đơn"
            name="quantityPromotion"
            rules={[{ required: true, message: "Không để trống!" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} addonAfter={"món"} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default PromotionDetailsGiftTicket;
