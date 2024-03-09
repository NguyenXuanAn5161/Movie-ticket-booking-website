import { Button, Form, Modal, Steps } from "antd";
import React, { useState } from "react";
import PromotionBasicInfo from "./Steps/BasicInfor";
import PromotionDetails from "./Steps/Details";
import PromotionUsageConditions from "./Steps/UsageConditions";

const steps = [
  { title: "Thông tin cơ bản", formComponent: <PromotionBasicInfo /> },
  { title: "Điều kiện sử dụng", formComponent: <PromotionUsageConditions /> },
  { title: "Chi tiết khuyến mãi", formComponent: <PromotionDetails /> },
];

const PromotionLineModalCreate = (props) => {
  const [current, setCurrent] = useState(0);
  const { openModalCreate, setOpenModalCreate } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [form] = Form.useForm();

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleCancel = () => {
    setOpenModalCreate(false);
    // form.resetFields();
    // setCurrent(0);
  };

  const onFinish = (values) => {
    setIsSubmit(true);
    setTimeout(() => {
      setIsSubmit(false);
      setOpenModalCreate(false);
      setCurrent(0);
    }, 2000);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Modal
      title="Tạo chương trình khuyến mãi"
      open={openModalCreate}
      width={"50vw"}
      onCancel={handleCancel}
      footer={[
        <>
          {current > 0 && (
            <Button key="prev" onClick={prev}>
              Quay lại
            </Button>
          )}
          {current <= 0 && (
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button key="next" type="primary" onClick={next}>
              Tiếp tục
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              key="submit"
              type="primary"
              loading={isSubmit}
              onClick={onFinish}
            >
              Tạo mới
            </Button>
          )}
        </>,
      ]}
      maskClosable={false}
    >
      <Steps current={current} items={items} />
      <div style={{ marginTop: 24, textAlign: "center" }}>
        {steps[current].formComponent}
      </div>
    </Modal>
  );
};

export default PromotionLineModalCreate;
