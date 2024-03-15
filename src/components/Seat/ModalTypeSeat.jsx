import { Divider, Form, Modal, Radio, message, notification } from "antd";
import { useState } from "react";
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

  const [form] = Form.useForm();

  // Hàm kiểm tra xem hai ghế trước hoặc hai ghế sau đã là ghế đôi
  const checkAdjacentSeats = (startIndex) => {
    const adjacentIndexes = [startIndex - 1, startIndex + 1, startIndex + 2];
    for (let i = 0; i < adjacentIndexes.length; i++) {
      const seatIndex = adjacentIndexes[i]; // 8 10 11
      const seat = selectedSeats.find((seat) => seat.index === seatIndex);
      if (seat && seat.typeSeat === "sweet") {
        return true; // Nếu có một ghế đôi trong hai ghế trước hoặc sau, trả về true
      }
    }
    return false;
  };

  const onFinish = async (values) => {
    const { typeSeat } = values;
    setIsSubmit(true);

    // Kiểm tra nếu loại ghế là "sweet" và số lượng ghế đã chọn lớn hơn 2
    if (typeSeat === "sweet" && selectedItems.length > 2) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description:
          "Chỉ được chọn tối đa 2 ghế để chuyển đổi sang loại ghế đôi!",
      });
      setIsSubmit(false);
      return;
    }

    if (typeSeat === "sweet") {
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
    if (typeSeat === "sweet" && checkAdjacentSeats(currentSeatIndex)) {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description:
          "Hai ghế trước hoặc hai ghế sau đã là ghế đôi, không thể chọn thêm ghế đôi!",
      });
      setIsSubmit(false);
      return;
    }

    if (typeSeat) {
      const seatList = selectedItems.map((index) => {
        const { seatRow, seatColumn } = calculateSeatPosition(index);
        return { index, seatRow, seatColumn, typeSeat };
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
              typeSeat: newSeat.typeSeat,
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
            name="typeSeat"
            rules={[
              {
                required: true,
                message: "Loại ghế không được để trống!",
              },
            ]}
            initialValue={"standard"}
          >
            <Radio.Group>
              <Radio.Button value="standard">Ghế thường</Radio.Button>
              <Radio.Button value="vip">Ghế vip</Radio.Button>
              <Radio.Button value="sweet">Ghế đôi</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalTypeSeat;
