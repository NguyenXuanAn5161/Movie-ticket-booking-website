import { Button, Col, Form, Select } from "antd"; // Import Input và Button từ Ant Design
import React, { useState } from "react";
import UserModalCreate from "./UserModalCreate";
import UserModalFind from "./UserModalFind";

const options = [
  { value: 1, label: "Đã có tài khoản" },
  { value: 2, label: "Tạo tài khoản mới" },
  { value: 3, label: "Khách hàng vãng lai" },
];

const InforUser = (props) => {
  const [selected, setSelected] = useState(null);
  const [openModalFind, setOpenModalFind] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);

  return (
    <>
      <Form.Item
        style={{ textAlign: "start" }}
        labelCol={{ span: 24 }}
        label="Thông tin khách hàng"
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Col span={12}>
            <Select
              showSearch
              allowClear
              options={options}
              onChange={(e) => setSelected(e)}
            />
          </Col>
          <Col span={12} style={{ marginLeft: 10 }}>
            {selected === 1 && (
              <Button type="primary" onClick={() => setOpenModalFind(true)}>
                Tìm
              </Button>
            )}
            {selected === 2 && (
              <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                Tìm
              </Button>
            )}
          </Col>
        </div>
      </Form.Item>

      <UserModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
      />

      <UserModalFind
        openModalFind={openModalFind}
        setOpenModalFind={setOpenModalFind}
      />
    </>
  );
};

export default InforUser;
