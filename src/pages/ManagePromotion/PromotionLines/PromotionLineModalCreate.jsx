import { Button, Form, Modal, Steps, message, notification } from "antd";
import React, { useState } from "react";
import PromotionBasicInfo from "./StepsCreate/BasicInfor";
import PromotionDetailsDiscount from "./StepsCreate/DetailsDiscount";
import PromotionDetailsGift from "./StepsCreate/DetailsGift";
import PromotionUsageConditions from "./StepsCreate/UsageConditions";

const PromotionLineModalCreate = (props) => {
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const { openModalCreate, setOpenModalCreate } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState({});

  const steps = [
    {
      title: "Thông tin cơ bản",
      formComponent: <PromotionBasicInfo form={form} />,
    },
    {
      title: "Điều kiện sử dụng",
      formComponent: <PromotionUsageConditions form={form} />,
    },
    {
      title: "Chi tiết khuyến mãi",
      formComponent:
        formData?.type === "discount" ? (
          <PromotionDetailsDiscount form={form} />
        ) : (
          <PromotionDetailsGift form={form} />
        ),
    },
  ];

  const next = () => {
    form
      .validateFields()
      .then((values) => {
        setCurrent(current + 1);
        // Update formData
        setFormData({ ...formData, ...values });
      })
      .catch((error) => {
        notification.error({
          message: "Có lỗi xảy ra!",
          description: "Vui lòng nhập đầy đủ thông tin",
        });
      });
  };

  const prev = () => setCurrent(current - 1);

  const handleCancel = () => {
    setOpenModalCreate(false);
    form.resetFields();
    setCurrent(0);
  };

  const onFinish = (values) => {
    form
      .validateFields()
      .then((values) => {
        setIsSubmit(true);
        // api
        console.log("formData trong then: ", { ...formData, ...values });
        setTimeout(() => {
          setIsSubmit(false);
          setOpenModalCreate(false);
          setCurrent(0);
          form.resetFields();
          message.success("Tạo mới chương trình khuyến mãi thành công");
        }, 2000);
      })
      .catch((error) => {
        notification.error({
          message: "Có lỗi xảy ra!",
          description: "Vui lòng nhập đầy đủ thông tin",
        });
      });
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
