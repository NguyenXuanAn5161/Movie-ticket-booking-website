import { Button, Form, Modal, Steps, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { callUploadImage } from "../../../services/apiMovie";
import { callCreatePromotionLine } from "../../../services/apiPromotion";
import PromotionBasicInfo from "./StepsCreate/BasicInfor";
import PromotionDetailsDiscount from "./StepsCreate/DetailsDiscount";
import PromotionDetailsGiftFood from "./StepsCreate/DetailsGiftFood";
import PromotionDetailsGiftTicket from "./StepsCreate/DetailsGiftTicket";
import ImageDetail from "./StepsCreate/ImageDetail";
import PromotionUsageConditions from "./StepsCreate/UsageConditions";

const PromotionLineModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, promotionId } = props;
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const steps = [
    {
      title: "Ảnh",
      formComponent: <ImageDetail form={form} setImageFile={setImageFile} />,
    },
    {
      title: "Thông tin cơ bản",
      formComponent: (
        <PromotionBasicInfo form={form} promotionId={promotionId} />
      ),
    },
    {
      title: "Thời gian áp dụng",
      formComponent: <PromotionUsageConditions form={form} />,
    },
    {
      title: "Chi tiết khuyến mãi",
      formComponent:
        formData?.typePromotion === "DISCOUNT" ? (
          <PromotionDetailsDiscount form={form} />
        ) : formData?.typePromotion === "FOOD" ? (
          <PromotionDetailsGiftFood form={form} />
        ) : (
          <PromotionDetailsGiftTicket form={form} />
        ),
    },
  ];

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

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

  const onFinish = async (values) => {
    form
      .validateFields()
      .then(async (values) => {
        setIsSubmit(true);
        // api
        console.log("formData trong then: ", { ...formData, ...values });
        const resImage = await callUploadImage(imageFile);
        console.log("resImage", resImage);
        if (resImage?.data?.status === 200) {
          // setIsSubmit(false);
          // return;
          const resPromotion = await callCreatePromotionLine(
            {
              ...formData,
              ...values,
            },
            resImage.data.message
          );
          console.log("resPromotion", resPromotion);
          if (resPromotion?.status === 200) {
            props.getPromotionLines();
            setIsSubmit(false);
            setOpenModalCreate(false);
            setCurrent(0);
            form.resetFields();
            message.success("Tạo mới chương trình khuyến mãi thành công");
          } else {
            setIsSubmit(false);
            notification.error({
              message: "Đã có lỗi xảy ra!",
              description: resPromotion.response.data.message,
            });
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
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
