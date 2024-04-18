import { Descriptions, Divider, Form, Modal } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { HH_MM_SS_FORMAT_DATE } from "../../../utils/constant";

const PriceDetailModalView = (props) => {
  const { openViewDetail, setOpenViewDetail, dataViewDetail } = props;

  useEffect(() => {
    console.log("dataViewDetail", dataViewDetail);
  }, [dataViewDetail]);

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

  const items = [
    {
      key: dataViewDetail?.code,
      label: <span style={{ fontWeight: 700 }}>Mã giá</span>,
      children: dataViewDetail?.code,
    },
    {
      key: dataViewDetail?.name,
      label: <span style={{ fontWeight: 700 }}>Tên</span>,
      children:
        dataViewDetail?.name === "STANDARD"
          ? "Ghế thường"
          : dataViewDetail?.name === "VIP"
          ? "Ghế vip"
          : dataViewDetail?.name === "SWEETBOX"
          ? "Ghế đôi"
          : dataViewDetail?.name,
    },
    {
      key: dataViewDetail?.price,
      label: <span style={{ fontWeight: 700 }}>Giá</span>,
      children: (
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(dataViewDetail?.price)}
        </span>
      ),
    },
    {
      key: dataViewDetail?.createdDate,
      label: <span style={{ fontWeight: 700 }}>Ngày cập nhật</span>,
      span: 2,
      children: moment(dataViewDetail?.createdDate).format(
        HH_MM_SS_FORMAT_DATE
      ),
    },
  ];

  return (
    <>
      <Modal
        width={750}
        title="Xem chi tiết giá"
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

export default PriceDetailModalView;
