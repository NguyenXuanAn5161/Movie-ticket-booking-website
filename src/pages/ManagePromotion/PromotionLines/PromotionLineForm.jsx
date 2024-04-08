import { Button, Form, Modal, Steps, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { callCreatePromotionLine } from "../../../services/apiMovie";
import PromotionBasicInfo from "./StepsCreate/BasicInfor";
import PromotionDetailsDiscount from "./StepsCreate/DetailsDiscount";
import PromotionDetailsGift from "./StepsCreate/DetailsGift";
import PromotionUsageConditions from "./StepsCreate/UsageConditions";

const PromotionLineModalForm = (props) => {
  const [form] = Form.useForm();
  const { formType, data, setData, openModal, setOpenModal } = props;
  const [current, setCurrent] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState([]);

  const steps = [
    {
      title: "Thông tin cơ bản",
      formComponent: (
        <PromotionBasicInfo
          form={form}
          formType={formType === "view" ? formType : null}
        />
      ),
    },
    {
      title: "Điều kiện sử dụng",
      formComponent: (
        <PromotionUsageConditions
          form={form}
          formType={formType === "view" ? formType : null}
        />
      ),
    },
    {
      title: "Chi tiết khuyến mãi",
      formComponent:
        formData?.typePromotion === "DISCOUNT" ? (
          <PromotionDetailsDiscount
            form={form}
            promotionDetails={data?.promotionDetails}
            formType={formType === "view" ? formType : null}
          />
        ) : (
          <PromotionDetailsGift
            form={form}
            promotionDetails={data?.promotionDetails}
            formType={formType === "view" ? formType : null}
          />
        ),
    },
  ];

  // Thiết lập giá trị mặc định cho form nếu có dữ liệu được truyền vào
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [form, data, formType]);

  const next = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("values basic: ", values);
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

  // Xử lý khi đóng modal
  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
    if (!(formType === "create")) {
      setData(null);
    }
    setCurrent(0);
  };

  const onFinish = (values) => {
    // form
    //   .validateFields()
    //   .then((values) => {
    //     setIsSubmit(true);
    //     // api
    //     // Lấy giá trị của type_promotion từ values
    //     const dataPromotionLine = {
    //       ...formData,
    //       PromotionDetailDto: values,
    //     };
    //     console.log("dataPromotionLine: ", dataPromotionLine);
    //     const res = callCreatePromotionLine(dataPromotionLine, data);
    //     console.log("res: ", res);
    //     if (res?.status === 200) {
    //       message.success("Tạo mới chương trình khuyến mãi thành công");
    //       form.resetFields();
    //       setIsSubmit(false);
    //       setOpenModal(false);
    //       setCurrent(0);
    //     } else {
    //       notification.error({
    //         message: "Đã có lỗi xảy ra!",
    //         description: res.response.data.message,
    //       });
    //       setIsSubmit(false);
    //     }
    //   })
    //   .catch((error) => {
    //     notification.error({
    //       message: "Có lỗi xảy ra!",
    //       description: "Vui lòng nhập đầy đủ thông tin",
    //     });
    //     setIsSubmit(false);
    //   });

    form.validateFields().then((values) => {
      setIsSubmit(true);
      // Lấy giá trị của type_promotion từ values
      const dataPromotionLine = {
        ...formData,
        PromotionDetailDto: values,
      };
      console.log("dataPromotionLine: ", dataPromotionLine);

      // Gửi yêu cầu tạo mới chương trình khuyến mãi
      callCreatePromotionLine(dataPromotionLine, data).then((res) => {
        console.log("res: ", res);
        if (res && res.status === 200) {
          message.success("Tạo mới chương trình khuyến mãi thành công");
          form.resetFields();
          setIsSubmit(false);
          setOpenModal(false);
          setCurrent(0);
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra!",
            description: res.response.data.message,
          });
          setIsSubmit(false);
        }
      });
    });
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  useEffect(() => {
    if (formType === "create") {
      console.log("data create: ", data);
    } else if (formType === "update") {
      console.log("data update: ", data);
    } else {
      console.log("data detail: ", data);
    }
  }, [data, formType]);

  return (
    <Modal
      title={
        formType === "create"
          ? "Thêm mới chương trình khuyến mãi"
          : formType === "update"
          ? "Cập nhật chương trình khuyến mãi"
          : "Xem chi tiết chương trình khuyến mãi"
      }
      open={openModal}
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
          {current === steps.length - 1 &&
            (formType !== "view" ? (
              <Button
                key="submit"
                type="primary"
                loading={isSubmit}
                onClick={onFinish}
              >
                Tạo mới
              </Button>
            ) : (
              <Button key="cancel" onClick={handleCancel}>
                Kết thúc
              </Button>
            ))}
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

export default PromotionLineModalForm;
