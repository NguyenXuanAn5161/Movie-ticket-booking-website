import { Button, Form, Modal, Steps, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { callUploadImage } from "../../../services/apiMovie";
import { callUpdatePromotionLine } from "../../../services/apiPromotion";
import PromotionBasicInfo from "./StepsCreate/BasicInfor";
import PromotionDetailsDiscount from "./StepsCreate/DetailsDiscount";
import PromotionDetailsGiftFood from "./StepsCreate/DetailsGiftFood";
import PromotionDetailsGiftTicket from "./StepsCreate/DetailsGiftTicket";
import ImageDetail from "./StepsCreate/ImageDetail";
import PromotionUsageConditions from "./StepsCreate/UsageConditions";

const PromotionLineModalUpdate = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate, type } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("dataUpdate: ", dataUpdate);
  }, [dataUpdate]);

  const [current, setCurrent] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const steps = [
    {
      title: "Ảnh",
      formComponent: (
        <ImageDetail
          form={form}
          setImageFile={setImageFile}
          dataUpdate={dataUpdate}
        />
      ),
    },
    {
      title: "Thông tin cơ bản",
      formComponent: (
        <PromotionBasicInfo form={form} dataUpdate={dataUpdate} type={type} />
      ),
    },
    {
      title: "Thời gian áp dụng",
      formComponent: (
        <PromotionUsageConditions
          form={form}
          dataUpdate={dataUpdate}
          type={type}
        />
      ),
    },
    {
      title: "Chi tiết khuyến mãi",
      formComponent:
        formData?.typePromotion === "DISCOUNT" ? (
          <PromotionDetailsDiscount
            form={form}
            type={type}
            promotionDiscountDetailDto={dataUpdate?.promotionDiscountDetailDto}
          />
        ) : formData?.typePromotion === "FOOD" ? (
          <PromotionDetailsGiftFood
            form={form}
            type={type}
            promotionFoodDetailDto={dataUpdate?.promotionFoodDetailDto}
          />
        ) : (
          <PromotionDetailsGiftTicket
            form={form}
            type={type}
            promotionTicketDetailDto={dataUpdate?.promotionTicketDetailDto}
          />
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
    setOpenModalUpdate(false);
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

        let resPromotion;

        if (imageFile === null) {
          resPromotion = await callUpdatePromotionLine(
            { ...formData, ...values },
            null
          );
        } else {
          const resImage = await callUploadImage(imageFile);
          if (resImage?.data?.status === 200) {
            resPromotion = await callUpdatePromotionLine(
              { ...formData, ...values },
              resImage.data.message
            );
          }
        }

        if (resPromotion) {
          console.log("resPromotion", resPromotion);
          if (resPromotion?.status === 200) {
            props.getPromotionLines();
            setIsSubmit(false);
            setOpenModalUpdate(false);
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
      title="Cập nhật chương trình khuyến mãi"
      open={openModalUpdate}
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
              Cập nhật
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

export default PromotionLineModalUpdate;
