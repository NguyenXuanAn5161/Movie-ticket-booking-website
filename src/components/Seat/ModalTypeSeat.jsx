import { Divider, Form, Modal, Radio, message, notification } from "antd";
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
  const [typeSeat, setTypeSeat] = useState(null);

  // fetch type seat để so sánh loại ghế
  useEffect(() => {
    getTypeSeat();
  }, []);

  const getTypeSeat = async () => {
    const resTypeSeat = await callFetchListTypeSeat();
    setTypeSeat(resTypeSeat);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await callFetchListTypeSeat();
    if (res) {
      // sắp xếp ghế theo thứ tự: thường, vip, đôi theo tên ghế
      res.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      const data = res.map((item) => {
        let label;
        if (item?.name === "STANDARD") {
          label = "Ghế thường";
        } else if (item?.name === "VIP") {
          label = "Ghế vip";
        } else {
          label = "Ghế đôi";
        }

        return {
          label,
          value: item.id,
        };
      });

      setListData(data);
    }
    setIsLoading(false);
  };
  const [form] = Form.useForm();

  const isSweetBoxSeat = (seatTypeId) => {
    return (
      typeSeat &&
      typeSeat.find((type) => type.id === seatTypeId)?.name === "SWEETBOX"
    );
  };

  const handleNotificationError = (errorMessage, isSubmit) => {
    notification.error({
      message: "Đã có lỗi xảy ra!",
      description: errorMessage,
    });
    setIsSubmit(isSubmit);
  };

  // Hàm kiểm tra xem hai ghế trước hoặc hai ghế sau đã là ghế đôi
  // sửa loại ghế đôi
  const checkAdjacentSeats = (startIndex) => {
    const adjacentIndexes = [startIndex - 1, startIndex + 1, startIndex + 2];
    for (const seatIndex of adjacentIndexes) {
      const seat = selectedSeats.find((seat) => seat.index === seatIndex);
      if (seat && isSweetBoxSeat(seat.seatTypeId)) {
        return true;
      }
    }
    return false;
  };

  const onFinish = async (values) => {
    console.log("values", values);
    console.log("values.seatTypeId", values.seatTypeId);
    const { seatTypeId } = values;
    const checkedSweetBox = isSweetBoxSeat(seatTypeId);
    // kiểm tra xem có ghế được chọn hay không
    if (selectedItems.length === 0) {
      handleNotificationError("Vui lòng chọn ghế cần cập nhật loại!", false);
      return;
    }

    setIsSubmit(true);

    // Kiểm tra nếu loại ghế là "sweet" và số lượng ghế đã chọn lớn hơn 2
    // sửa loại ghế đôi
    if (checkedSweetBox && selectedItems.length > 2) {
      handleNotificationError(
        "Chỉ được chọn tối đa 2 ghế để chuyển đổi sang loại ghế đôi!",
        false
      );
      return;
    }

    // kiểm tra nếu loại ghế là sweet và số lượng ghế đã chọn nhỏ hơn 2
    if (checkedSweetBox && selectedItems.length < 2) {
      handleNotificationError(
        "Vui lòng chọn đúng 2 ghế để chuyển đổi sang loại ghế đôi!",
        false
      );
      return;
    }

    // sửa loại ghế đôi
    if (checkedSweetBox) {
      // Kiểm tra xem hai ghế có liền kề không
      const seatError = "Chỉ được chọn hai ghế liền kề cùng 1 hàng!";
      if (
        (selectedItems[0] > selectedItems[1] &&
          selectedItems[0] - 1 !== selectedItems[1]) ||
        (selectedItems[0] < selectedItems[1] &&
          selectedItems[1] - 1 !== selectedItems[0])
      ) {
        handleNotificationError(seatError, false);
        return;
      }
    }

    // Kiểm tra xem hai ghế trước hoặc hai ghế sau đã là ghế đôi
    const currentSeatIndex = selectedItems[0];
    // sửa loại ghế đôi
    if (checkedSweetBox && checkAdjacentSeats(currentSeatIndex)) {
      handleNotificationError("Ghế kế bên đã là ghế đôi!", false);
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

  // Find the ID of "Ghế thường" based on its label
  const defaultSeatTypeId = listData.find(
    (item) => item.label === "Ghế thường"
  )?.value;

  return (
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
          initialValue={defaultSeatTypeId}
        >
          <Radio.Group>
            {listData.map((item) => (
              <Radio key={item.value} value={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalTypeSeat;
