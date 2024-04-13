import { Divider, Form, Modal, Select, message, notification } from "antd";
import { useEffect, useState } from "react";
import { callFetchListTypeSeat } from "../../services/apiMovie";
import { calculateSeatPosition } from "../../utils/seatCalculations";

const ModalTypeSeat = (props) => {
  const {
    openModal,
    setOpenModal,
    selectedSeats,
    setSelectedSeats,
    selectedItems,
    setSelectedIndexes,
  } = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await callFetchListTypeSeat();
    if (res) {
      const data = res.map((item) => {
        return {
          label:
            item?.name === "STANDARD"
              ? "Ghế thường"
              : item?.name === "VIP"
              ? "Ghế vip"
              : "Ghế đôi",
          value: item.id,
        };
      });
      setListData(data);
    }
    setIsLoading(false);
  };
  const [form] = Form.useForm();

  // Hàm kiểm tra xem hai ghế trước hoặc hai ghế sau đã là ghế đôi
  const checkAdjacentSeats = (startIndex) => {
    const adjacentIndexes = [startIndex - 1, startIndex + 1, startIndex + 2];
    for (let i = 0; i < adjacentIndexes.length; i++) {
      const seatIndex = adjacentIndexes[i]; // 8 10 11
      const seat = selectedSeats.find((seat) => seat.index === seatIndex);
      // sửa loại ghế đôi
      if (seat && seat.seatTypeId === 2) {
        return true; // Nếu có một ghế đôi trong hai ghế trước hoặc sau, trả về true
      }
    }
    return false;
  };

  const onFinish = async (values) => {
    console.log("values", values);
    console.log("values.seatTypeId", values.seatTypeId);
    const { seatTypeId } = values;
    // kiểm tra xem có ghế được chọn hay không
    if (selectedItems.length === 0) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: "Vui lòng chọn ghế cần cập nhật loại!",
      });
      setIsSubmit(false);
      return;
    }

    setIsSubmit(true);

    // Kiểm tra nếu loại ghế là "sweet" và số lượng ghế đã chọn lớn hơn 2
    // sửa loại ghế đôi
    if (seatTypeId === 2 && selectedItems.length > 2) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description:
          "Chỉ được chọn tối đa 2 ghế để chuyển đổi sang loại ghế đôi!",
      });
      setIsSubmit(false);
      return;
    }

    // sửa loại ghế đôi
    if (seatTypeId === 2) {
      if (
        selectedItems[0] > selectedItems[1] &&
        selectedItems[0] - 1 !== selectedItems[1]
      ) {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: "Chỉ được chọn hai ghế liền kề cùng 1 hàng!",
        });
        setIsSubmit(false);
        return;
      } else if (
        selectedItems[0] < selectedItems[1] &&
        selectedItems[1] - 1 !== selectedItems[0]
      ) {
        notification.error({
          message: "Đã có lỗi xảy ra!",
          description: "Chỉ được chọn hai ghế liền kề cùng 1 hàng!",
        });
        setIsSubmit(false);
        return;
      }
    }

    // Kiểm tra xem hai ghế trước hoặc hai ghế sau đã là ghế đôi
    const currentSeatIndex = selectedItems[0];
    // sửa loại ghế đôi
    if (seatTypeId === 2 && checkAdjacentSeats(currentSeatIndex)) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description:
          "Hai ghế trước hoặc hai ghế sau đã là ghế đôi, không thể chọn thêm ghế đôi!",
      });
      setIsSubmit(false);
      return;
    }

    if (seatTypeId) {
      const seatList = selectedItems.map((index) => {
        const { seatRow, seatColumn } = calculateSeatPosition(index);
        return { index, seatRow, seatColumn, seatTypeId };
      });

      setSelectedSeats((prevSelectedSeats) => {
        // Tạo một bản sao của selectedSeats ban đầu để không làm thay đổi trực tiếp vào selectedSeats
        const updatedSelectedSeats = [...prevSelectedSeats];

        // Lặp qua từng phần tử trong seatList để kiểm tra và cập nhật hoặc thêm mới
        seatList.forEach((newSeat) => {
          const updateSeatIndex = prevSelectedSeats.findIndex(
            (seat) =>
              seat.seatRow === newSeat.seatRow &&
              seat.seatColumn === newSeat.seatColumn
          );

          if (updateSeatIndex !== -1) {
            // Nếu tìm thấy ghế trùng, cập nhật loại ghế mới
            updatedSelectedSeats[updateSeatIndex] = {
              ...updatedSelectedSeats[updateSeatIndex],
              seatTypeId: newSeat.seatTypeId,
            };
          } else {
            // Nếu không tìm thấy ghế trùng, thêm ghế mới vào mảng
            updatedSelectedSeats.push(newSeat);
          }
        });

        return updatedSelectedSeats;
      });

      setSelectedIndexes([]);
      message.success("Cập nhật loại ghế thành công!");
      form.resetFields();
      setOpenModal(false);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Cập nhật loại ghế"
        open={openModal}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModal(false);
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
            maxWidth: 450,
            margin: "0 auto",
          }}
          onFinish={onFinish}
          autoComplete="true"
        >
          <Form.Item
            labelCol={{ span: 24 }}
            label="Chọn loại ghế"
            name="seatTypeId"
            rules={[
              {
                required: true,
                message: "Loại ghế không được để trống!",
              },
            ]}
            initialValue={null}
          >
            <Select
              // defaultValue={null}
              showSearch
              allowClear
              // onChange={handleChange}
              options={listData}
              placeholder="Chọn loại ghế"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalTypeSeat;
