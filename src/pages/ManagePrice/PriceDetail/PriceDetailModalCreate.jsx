import {
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import DebounceSelect from "../../../components/DebounceSelect/DebounceSelect";
import { callFetchListCinema } from "../../../services/apiCinema";
import { callFetchListFood } from "../../../services/apiFood";
import { callFetchListTypeSeat } from "../../../services/apiMovie";
import { callCreateSalePriceDetail } from "../../../services/apiPrice";
import { callFetchListRoom } from "../../../services/apiRoom";

const options = [
  { value: "TYPE_SEAT", label: "Loại ghế" },
  { value: "ROOM", label: "Phòng" },
  { value: "FOOD", label: "Đồ ăn" },
];

const PriceDetailModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, priceHeaderId } = props;
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [cinema, setCinema] = useState(null);
  const [typeSeat, setTypeSeat] = useState([]);
  const [room, setRoom] = useState(null);
  const [type, setType] = useState("TYPE_SEAT");
  const [food, setFood] = useState(null);

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

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

  const fetchRoomList = async (roomName) => {
    try {
      let query = `size=5&name=${roomName}&cinemaId=${cinema.value}`;
      const res = await callFetchListRoom(query);
      const room = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return room;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching room:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  const fetchFoodList = async (foodName) => {
    try {
      let query = `size=5&name=${foodName}&cinemaId=${cinema.value}`;
      const res = await callFetchListFood(query);
      const food = res.content.map((data) => ({
        label: data.name,
        value: data.id,
      }));

      return food;
    } catch (error) {
      // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
      console.error("Error fetching movies:", error);
      // Trả về một mảng trống nếu xảy ra lỗi
      return [];
    }
  };

  const onFinish = async (values) => {
    // setIsSubmit(true);
    console.log("values: ", values);
    const res = await callCreateSalePriceDetail(values, priceHeaderId);
    console.log("res price detail: ", res);
    if (res?.status === 200) {
      message.success("Tạo mới chi tiết giá thành công!");
      form.resetFields();
      setOpenModalCreate(false);
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
    <Modal
      width={750}
      title="Thêm mới chi tiết giá"
      open={openModalCreate}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText={"Tạo mới"}
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
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Chọn rạp"
              name="cinemaId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn rạp!",
                },
              ]}
            >
              <DebounceSelect
                value={cinema}
                onChange={(newValue) => {
                  setCinema(newValue);
                }}
                placeholder="Chọn rạp"
                fetchOptions={fetchCinemaList}
              />
            </Form.Item>
          </Col>
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
                name="roomId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng chiếu!",
                  },
                ]}
              >
                <DebounceSelect
                  value={room}
                  onChange={(newValue) => {
                    setRoom(newValue);
                  }}
                  placeholder="Chọn phòng chiếu"
                  fetchOptions={fetchRoomList}
                />
              </Form.Item>
            ) : type === "FOOD" ? (
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đồ ăn"
                name="foodId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn đồ ăn!",
                  },
                ]}
              >
                <DebounceSelect
                  value={food}
                  onChange={(newValue) => {
                    setFood(newValue);
                  }}
                  placeholder="Chọn đồ ăn"
                  fetchOptions={fetchFoodList}
                />
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
                <Select showSearch allowClear options={typeSeat} />
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
                max={99999999}
                addonAfter="VND"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PriceDetailModalCreate;

async function fetchCinemaList(cinemaName) {
  try {
    let query = `size=5&name=${cinemaName}`;
    const res = await callFetchListCinema(query);
    const food = res.content.map((data) => ({
      label: data.name,
      value: data.id,
    }));

    return food;
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
    console.error("Error fetching movies:", error);
    // Trả về một mảng trống nếu xảy ra lỗi
    return [];
  }
}
