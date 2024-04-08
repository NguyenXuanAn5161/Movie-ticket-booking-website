import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Form, Row, Upload } from "antd";
import React, { useState } from "react";

const ImageDetail = ({ form, formType, setImageFile }) => {
  const isDisabled = formType ? true : false;
  const radioStyle = {
    pointerEvents: isDisabled ? "none" : "auto", // Tắt hoặc bật sự kiện click
    opacity: isDisabled ? 0.5 : 1, // Làm mờ hoặc không làm mờ nút radio
  };

  const [loading, setLoading] = useState(false);

  // xử lý ảnh
  const handleRemoveFile = (file) => {
    setImageFile([]);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setImageFile(e.file);
    return e && e.fileList;
  };

  return (
    <Form form={form} layout="vertical" disabled={isDisabled}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Hình ảnh"
            name="image"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập chọn hình ảnh!",
              },
            ]}
          >
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={() => false}
              onRemove={(file) => handleRemoveFile(file)}
              onChange={(info) => normFile(info)}
              listType="picture-card"
            >
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ImageDetail;
