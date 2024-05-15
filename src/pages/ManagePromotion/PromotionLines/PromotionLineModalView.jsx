import { Descriptions, Divider, Form, Image, Modal } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { callGetFoodById } from "../../../services/apiFood";
import { callFetchTypeSeatById } from "../../../services/apiMovie";
import {
  FORMAT_DATE_HHmm,
  HH_MM_SS_FORMAT_DATE,
} from "../../../utils/constant";

const PromotionLineModalView = (props) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail } = props;

  const [typeSeatRequired, setTypeSeatRequired] = useState(null);
  const [typeSeatPromotion, setTypeSeatPromotion] = useState(null);
  const [foodRequired, setFoodRequired] = useState(null);
  const [foodPromotion, setFoodPromotion] = useState(null);

  useEffect(() => {
    if (dataViewDetail?.typePromotion === "TICKET") {
      fetchTypeSeatById(
        dataViewDetail?.promotionTicketDetailDto?.typeSeatRequired
      );
      fetchTypeSeatByIdPromotion(
        dataViewDetail?.promotionTicketDetailDto?.typeSeatPromotion
      );
    }
  }, [dataViewDetail]);

  const fetchTypeSeatById = async (id) => {
    const res = await callFetchTypeSeatById(id);
    if (res) {
      setTypeSeatRequired(res);
    }
  };
  const fetchTypeSeatByIdPromotion = async (id) => {
    const res = await callFetchTypeSeatById(id);
    if (res) {
      setTypeSeatPromotion(res);
    }
  };

  useEffect(() => {
    if (dataViewDetail?.typePromotion === "FOOD") {
      getFoodById(dataViewDetail?.promotionFoodDetailDto?.foodRequired);
      getFoodByIdPromotion(
        dataViewDetail?.promotionFoodDetailDto?.foodPromotion
      );
    }
  }, [dataViewDetail]);

  const getFoodById = async (id) => {
    const res = await callGetFoodById(id);
    if (res) {
      setFoodRequired(res);
    }
  };

  const getFoodByIdPromotion = async (id) => {
    const res = await callGetFoodById(id);
    if (res) {
      setFoodPromotion(res);
    }
  };

  useEffect(() => {
    console.log("dataViewDetail", dataViewDetail);
  }, [dataViewDetail]);

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

  const items = [
    {
      key: "code",
      label: (
        <span style={{ fontWeight: 700 }}>Mã chương trình khuyến mãi</span>
      ),
      children: dataViewDetail?.code,
    },
    {
      key: "name",
      label: <span style={{ fontWeight: 700 }}>Tên</span>,
      children: dataViewDetail?.name,
    },
    {
      key: "description",
      label: <span style={{ fontWeight: 700 }}>Mô tả</span>,
      children: dataViewDetail?.description,
    },
    {
      key: "startDate",
      label: <span style={{ fontWeight: 700 }}>Ngày bắt đầu</span>,
      children: moment(dataViewDetail?.startDate).format(FORMAT_DATE_HHmm),
    },
    {
      key: "endDate",
      label: <span style={{ fontWeight: 700 }}>Ngày kết thúc</span>,
      children: moment(dataViewDetail?.endDate).format(FORMAT_DATE_HHmm),
    },
    {
      key: "typePromotion",
      label: <span style={{ fontWeight: 700 }}>Loại chương trình</span>,
      children:
        dataViewDetail?.typePromotion === "DISCOUNT"
          ? "Giảm giá"
          : dataViewDetail?.typePromotion === "FOOD"
          ? "Tặng đồ ăn"
          : "Tặng vé",
    },
    {
      key: "status",
      label: <span style={{ fontWeight: 700 }}>Trạng thái</span>,
      children: dataViewDetail?.status ? "Hoạt động" : "Không hoạt động",
    },
    {
      key: "createdAt",
      label: <span style={{ fontWeight: 700 }}>Ngày tạo</span>,
      children: moment(dataViewDetail?.createdAt).format(HH_MM_SS_FORMAT_DATE),
    },
    // Added promotionDiscountDetailDto section
    dataViewDetail?.typePromotion === "DISCOUNT" && {
      key: "discountType",
      label: <span style={{ fontWeight: 700 }}>Loại giảm giá</span>,
      children:
        dataViewDetail?.promotionDiscountDetailDto?.typeDiscount === "PERCENT"
          ? "Chiết khấu"
          : "Giảm trực tiếp",
    },
    dataViewDetail?.typePromotion === "DISCOUNT" && {
      key: "discountValue",
      label: <span style={{ fontWeight: 700 }}>Giá trị giảm giá</span>,
      children: (
        <span>
          {dataViewDetail?.promotionDiscountDetailDto?.typeDiscount ===
          "PERCENT"
            ? dataViewDetail?.promotionDiscountDetailDto?.discountValue + "%"
            : new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                dataViewDetail?.promotionDiscountDetailDto?.discountValue
              )}
        </span>
      ),
    },
    dataViewDetail?.typePromotion === "DISCOUNT" && {
      key: "maxValue",
      label: <span style={{ fontWeight: 700 }}>Giảm tối đa</span>,
      children: (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(dataViewDetail?.promotionDiscountDetailDto?.maxValue)}
        </span>
      ),
    },
    dataViewDetail?.typePromotion === "DISCOUNT" && {
      key: "minBillValue",
      label: <span style={{ fontWeight: 700 }}>Hóa đơn tối thiểu</span>,
      children: (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(dataViewDetail?.promotionDiscountDetailDto?.minBillValue)}
        </span>
      ),
    },
    // Added promotionFoodDetailDto section
    dataViewDetail?.typePromotion === "FOOD" && {
      key: "foodRequired",
      label: <span style={{ fontWeight: 700 }}>Món ăn yêu cầu</span>,
      children: foodRequired?.name,
    },
    dataViewDetail?.typePromotion === "FOOD" && {
      key: "quantityRequired",
      label: <span style={{ fontWeight: 700 }}>Số lượng yêu cầu</span>,
      children: dataViewDetail?.promotionFoodDetailDto?.quantityRequired,
    },
    dataViewDetail?.typePromotion === "FOOD" && {
      key: "foodPromotion",
      label: <span style={{ fontWeight: 700 }}>Món ăn khuyến mãi</span>,
      children: foodPromotion?.name,
    },
    dataViewDetail?.typePromotion === "FOOD" && {
      key: "quantityPromotion",
      label: <span style={{ fontWeight: 700 }}>Số lượng khuyến mãi</span>,
      children: dataViewDetail?.promotionFoodDetailDto?.quantityPromotion,
    },
    // Added promotionTicketDetailDto section
    dataViewDetail?.typePromotion === "TICKET" && {
      key: "ticketType",
      label: <span style={{ fontWeight: 700 }}>Loại ghế cần mua</span>,
      children:
        typeSeatRequired?.name === "STANDARD"
          ? "Ghế thường"
          : typeSeatRequired?.name === "VIP"
          ? "Ghế vip"
          : "Ghế đôi",
    },
    dataViewDetail?.typePromotion === "TICKET" && {
      key: "quantityTicket",
      label: <span style={{ fontWeight: 700 }}>Số lượng ghế cần mua</span>,
      children: dataViewDetail?.promotionTicketDetailDto?.quantityRequired,
    },
    dataViewDetail?.typePromotion === "TICKET" && {
      key: "ticketPromotion",
      label: <span style={{ fontWeight: 700 }}>Loại ghế được tặng</span>,
      children:
        typeSeatPromotion?.name === "STANDARD"
          ? "Ghế thường"
          : typeSeatRequired?.name === "VIP"
          ? "Ghế vip"
          : "Ghế đôi",
    },
    dataViewDetail?.typePromotion === "TICKET" && {
      key: "quantityTicketPromotion",
      label: <span style={{ fontWeight: 700 }}>Số lượng ghế được tặng</span>,
      children: dataViewDetail?.promotionTicketDetailDto?.quantityPromotion,
    },
    {
      key: "image",
      label: <span style={{ fontWeight: 700 }}>Ảnh</span>,
      children: (
        <Image
          src={dataViewDetail?.image}
          alt="Promotion"
          style={{ maxWidth: "100%", maxHeight: "100px" }}
        />
      ),
    },
  ].filter(Boolean); // Filter out falsy values;

  return (
    <>
      <Modal
        width={900}
        title="Xem chi tiết chương trình khuyến mãi"
        open={openViewDetail}
        onOk={() => {
          setOpenViewDetail(false);
        }}
        onCancel={() => {
          setOpenViewDetail(false);
        }}
        okText={"Đóng"}
        cancelText={"Hủy"}
        maskClosable={false}
      >
        <Divider />
        <Descriptions layout="vertical" items={items} />
      </Modal>
    </>
  );
};

export default PromotionLineModalView;
