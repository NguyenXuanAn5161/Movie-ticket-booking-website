import {
  boxesIntersect,
  useSelectionContainer,
} from "@air/react-drag-to-select";
import {
  Button,
  Card,
  Col,
  Divider,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
  message,
  notification,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { IoOpenOutline } from "react-icons/io5";
import { MdEventSeat, MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import ModalTypeSeat from "../../../components/Seat/ModalTypeSeat";
import SeatComponent from "../../../components/Seat/SeatComponent";
import SeatLegend from "../../../components/Seat/SeatLegend";
import { callCreateUser } from "../../../services/api";
import "./index.scss";

const alphabet = "ABCDEFGHIJKLMNOPQR";

const RoomEdit = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [totalSeats, setTotalSeats] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [openModalTypeSeat, setOpenModalTypeSeat] = useState(false);
  const [typeSeat, setTypeSeat] = useState("");

  const onFinish = async (values) => {
    const { name, typeRoom, totalSeat } = values;
    if (selectedSeats.length <= 0) {
      notification.error({
        message: "Vui lòng chọn danh sách ghế!",
        description: "Danh sách ghế không được rỗng!",
      });
      return;
    } else if (selectedSeats.length < totalSeat) {
      notification.error({
        message: "Vui lòng chọn đủ danh sách ghế!",
        description: (
          <>
            Tổng số ghế đã chọn:{" "}
            <span style={{ color: "red", fontWeight: 600, fontSize: 16 }}>
              {selectedSeats.length}
            </span>
            <br />
            Tổng số ghế đã nhập{" "}
            <span style={{ color: "red", fontWeight: 600, fontSize: 16 }}>
              {totalSeat ? totalSeat : 0}
            </span>
          </>
        ),
      });
      return;
    }

    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callCreateUser(fullName, email, password, phone);
    if (res && res.data) {
      message.success("Cập nhật phòng chiếu thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate("/admin/cinema/room");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };

  const handleTotalSeatChange = (value) => {
    setTotalSeats(value);
  };

  // Drag selection
  // State và refs để lưu trữ thông tin về khu vực chọn, các phần tử đã được chọn và tham chiếu đến các phần tử DOM.
  const [selectionBox, setSelectionBox] = useState();
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const selectableItems = useRef([]);
  const elementsContainerRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionStarted, setSelectionStarted] = useState(false);
  const [ctrlPressed, setCtrlPressed] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Control") {
      setCtrlPressed(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Control") {
      setCtrlPressed(false);
    }
  };

  // Render ghế
  let gridSeats = [];
  alphabet.split("").forEach((item, index) => {
    for (let i = 0; i < 20; i++) {
      gridSeats.push({
        id: `${item}${i + 1}`,
        text: `${item}${i + 1}`,
      });
    }
  });

  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById("root"),
    onSelectionChange: (box) => {
      const scrollAwareBox = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX,
      };
      setSelectionBox(scrollAwareBox);
      const indexesToSelect = [];
      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(scrollAwareBox, item)) {
          indexesToSelect.push(index);
        }
      });

      setSelectedIndexes(indexesToSelect);
    },
    onSelectionStart: () => {
      setSelectionStarted(true);
      setSelectedItems([]);
    },
    onSelectionEnd: () => {
      setSelectionStarted(false);
    },
    selectionProps: {
      style: {
        border: "5px dashed aqua",
        borderRadius: 4,
        opacity: 0.5,
      },
    },
    isEnabled: !ctrlPressed,
  });

  useEffect(() => {
    if (elementsContainerRef.current) {
      Array.from(elementsContainerRef.current.children).forEach((item) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        selectableItems.current.push({
          left,
          top,
          width,
          height,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (selectedItems.length > totalSeats) {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: (
          <>
            Tổng số ghế đã chọn:{" "}
            <span style={{ color: "red", fontWeight: 600, fontSize: 16 }}>
              {selectedItems.length}
            </span>{" "}
            không thể lớn hơn tổng số ghế đã nhập{" "}
            <span style={{ color: "red", fontWeight: 600, fontSize: 16 }}>
              {totalSeats ? totalSeats : 0}
            </span>
          </>
        ),
      });
    }
  }, [selectedItems, totalSeats]);

  const handleClick = () => {
    setOpenModalTypeSeat(true);
  };

  const handleDelete = () => {
    const remainingSeats = selectedSeats.filter(
      (seat) => !selectedIndexes.includes(seat.index)
    );
    setSelectedSeats(remainingSeats);
    setSelectedIndexes([]);
    message.success("Xóa ghế thành công!");
  };

  useEffect(() => {
    console.log("Danh sach ghe: ", selectedSeats);
  }, [selectedSeats]);

  return (
    <>
      <PageHeader title="Cập nhật phòng chiếu" numberBack={-1} type="create" />
      <Divider />
      <Card title="Cập nhật phòng chiếu" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[20]}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên phòng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên phòng!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên phòng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Loại phòng"
                name="typeRoom"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại phòng!",
                  },
                ]}
                initialValue={"2D"}
              >
                <Select style={{ width: "100%" }}>
                  <Select.Option value="2D">2D</Select.Option>
                  <Select.Option value="3D">3D</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tổng số ghế"
                name="totalSeat"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tổng số ghế!",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng số ghế"
                  min={120}
                  max={390}
                  addonAfter={"Ghế"}
                  onChange={handleTotalSeatChange}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#ffffff",
                  paddingBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <SeatLegend color="#ffffff" text="Ghế không được chọn" />
                  <SeatLegend color="chocolate" text="Ghế được chọn" />
                  <SeatLegend color="#6959CD" text="Ghế thường" />
                  <SeatLegend color="#FF8247" text="Ghế vip" />
                  <SeatLegend color="#FF1493" text="Ghế đôi" />
                </div>
                <h4
                  style={{
                    textAlign: "center",
                    margin: "15px 0",
                  }}
                >
                  Danh sách ghế trong phòng chiếu
                </h4>
                <div
                  style={{
                    backgroundColor: "#000000",
                    width: "70%",
                    margin: "0 auto",
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 600,
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  Màn hình
                </div>
              </div>
              <DragSelection />
              <div className="container">
                <div
                  id="elements-container"
                  className="elements-container"
                  ref={elementsContainerRef}
                >
                  {gridSeats.map((item, index) => {
                    return (
                      <SeatComponent
                        key={index}
                        index={index}
                        id={item.id}
                        text={item.text}
                        isSelected={selectedIndexes.includes(index)}
                        checkSelection={(e) => {
                          // console.log("checkSelection: ", e);
                        }}
                        selectionOn={selectionStarted}
                        setSelectedItems={setSelectedItems}
                        setSelectedIndexes={setSelectedIndexes}
                        ctrlPressed={ctrlPressed}
                        handleKeyDown={handleKeyDown}
                        handleKeyUp={handleKeyUp}
                        selectedSeats={selectedSeats}
                      />
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{ display: "flex", justifyContent: "flex-end" }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmit}
                style={{ marginTop: 10 }}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Row>
        </Form>
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{
            right: 50,
            marginBottom: 50,
          }}
          icon={<MdEventSeat />}
        >
          <Tooltip
            placement="left"
            title="Mở bảng điều khiển chọn loại ghế"
            overlayStyle={{ fontSize: 16 }}
          >
            <FloatButton icon={<IoOpenOutline />} onClick={handleClick} />
          </Tooltip>
          <Tooltip
            placement="left"
            title="Xóa ghế đã chọn"
            overlayStyle={{ fontSize: 16 }}
          >
            <FloatButton icon={<MdOutlineDelete />} onClick={handleDelete} />
          </Tooltip>
        </FloatButton.Group>
      </Card>

      <ModalTypeSeat
        openModal={openModalTypeSeat}
        setOpenModal={setOpenModalTypeSeat}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        selectedItems={selectedItems}
        setSelectedIndexes={setSelectedIndexes}
      />
    </>
  );
};

export default RoomEdit;
