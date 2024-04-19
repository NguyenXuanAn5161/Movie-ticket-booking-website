import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { callFetchListTypeSeat } from "../../../services/apiMovie";
import { callUpdateSalePriceDetail } from "../../../services/apiPrice";

const options = [
  { value: "TYPE_SEAT", label: "Loại ghế" },
  { value: "ROOM", label: "Phòng" },
  { value: "FOOD", label: "Đồ ăn" },
];

const PriceDetailModalUpdate = (props) => {
  const { openModalUpdate, setOpenModalUpdate, dataUpdate } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [typeSeat, setTypeSeat] = useState([]);
  const [type, setType] = useState("TYPE_SEAT");

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("dataUpdate: ", dataUpdate);
    form.setFieldsValue(dataUpdate);
    setType(dataUpdate?.type);
  }, [dataUpdate]);

  useEffect(() => {
    fetchTypeSeat();
  }, []);

  const fetchTypeSeat = async () => {
    const res = await callFetchListTypeSeat();
    console.log("res type seat: ", res);
    if (res) {
      const data = res.map((item) => ({
        label:
          item.name === "VIP"
            ? "Ghế vip"
            : item.name === "STANDARD"
            ? "Ghế thường"
            : "Ghế đôi",
        value: item.id,
      }));
      setTypeSeat(data);
    }
  };

  const onFinish = async (values) => {
    setIsSubmit(true);
    const res = await callUpdateSalePriceDetail(values);
    console.log("update price detail: ", res);
    if (res?.status === 200) {
      message.success("Cập nhật chi tiết giá thành công!");
      form.resetFields();
      setOpenModalUpdate(false);
      await props.fetchData();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.response.data.message,
      });
    }
    setIsSubmit(false);
  };

  const handleSelectedType = (e) => {
    setType(e);
  };

  return (
    <>
      <Modal
        width={750}
        title="Cập nhật chi tiết giá"
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalUpdate(false);
          form.resetFields();
        }}
        okText={"Cập nhật"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
        maskClosable={false}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          style={{
            maxWidth: 750,
            margin: "0 auto",
          }}
          onFinish={onFinish}
          autoComplete="true"
        >
          <Row gutter={15}>
            <Form.Item hidden name="id">
              <InputNumber />
            </Form.Item>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá cho"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại giá!",
                  },
                ]}
                initialValue={"TYPE_SEAT"}
              >
                <Select
                  disabled={true}
                  showSearch
                  allowClear
                  options={options}
                  onChange={(e) => handleSelectedType(e)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {type === "ROOM" ? (
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Chọn phòng chiếu"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phòng chiếu!",
                    },
                  ]}
                >
                  <Input disabled={true} />
                </Form.Item>
              ) : type === "FOOD" ? (
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Đồ ăn"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn đồ ăn!",
                    },
                  ]}
                >
                  <Input disabled={true} />
                </Form.Item>
              ) : (
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Loại ghế"
                  name="typeSeatId"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại ghế!",
                    },
                  ]}
                >
                  <Select
                    disabled={true}
                    showSearch
                    allowClear
                    options={typeSeat}
                  />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Giá tiền không được để trống!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  min={1000}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Trạng thái"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Hoạt động</Radio>
                  <Radio value={false}>Không hoạt động</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default PriceDetailModalUpdate;
