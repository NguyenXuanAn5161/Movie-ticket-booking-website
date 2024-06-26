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
  Radio,
  Row,
  Select,
  Tooltip,
  message,
  notification,
} from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoOpenOutline } from "react-icons/io5";
import { MdEventSeat, MdOutlineDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import ModalTypeSeat from "../../../components/Seat/ModalTypeSeat";
import SeatComponent from "../../../components/Seat/SeatComponent";
import SeatLegend from "../../../components/Seat/SeatLegend";
import { callFetchListTypeSeat } from "../../../services/apiMovie";
import { callCreateRoom } from "../../../services/apiRoom";
import { getErrorMessageRoom } from "../../../utils/errorHandling";
import "./index.scss";

const alphabet = "ABCDEFGHIJ";

const RoomCreate = () => {
  const { cinemaId } = useParams();

  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [openModalTypeSeat, setOpenModalTypeSeat] = useState(false);
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
    // f5 lại trang
    window.onbeforeunload = function () {
      return true;
    };
  }, []);

  useEffect(() => {
    console.log("selectedSeats: ", selectedSeats);
  }, [selectedSeats]);

  const onFinish = async (values) => {
    const { name, type, status } = values;
    // Tạo mảng seats từ selectedSeats
    const seats = selectedSeats.map((seat) => ({
      seatRow: seat.seatRow,
      seatColumn: seat.seatColumn,
      status: true,
      seatTypeId: seat.seatTypeId,
    }));
    // tạo cấu trúc data để truyền xuống
    const roomData = {
      name,
      type,
      cinemaId,
      status,
      seats: seats,
    };

    if (selectedSeats.length <= 0) {
      notification.error({
        message: "Vui lòng chọn danh sách ghế!",
        description: "Chọn danh sách ghế và loại ghế cho ghế đã chọn!",
      });
      return;
    }

    setIsSubmit(true);
    const res = await callCreateRoom(roomData);
    if (res?.status === 200) {
      message.success("Tạo mới phòng chiếu thành công!");
      form.resetFields();
      setIsSubmit(false);
      navigate(`/cinema/show/${cinemaId}`);
    } else {
      console.log("res error: ", res);
      const error = getErrorMessageRoom(res.response.data.message, {
        name: name,
        id: cinemaId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
      setIsSubmit(false);
    }
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
  const gridSeats = useMemo(() => {
    let gridSeats = [];
    alphabet.split("").forEach((item, rowIndex) => {
      for (let i = 0; i < 20; i++) {
        gridSeats.push({
          id: `${item}${i + 1}`,
          text: `${item}${i + 1}`,
          seatRow: rowIndex + 1,
          seatColumn: i + 1,
        });
      }
    });
    return gridSeats;
  }, []);

  const { DragSelection } = useSelectionContainer({
    eventsElement: document.getElementById("root"),
    onSelectionChange: useCallback((box) => {
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
    }, []),
    onSelectionStart: useCallback(() => {
      setSelectionStarted(true);
      setSelectedItems([]);
    }, []),
    onSelectionEnd: useCallback(() => {
      setSelectionStarted(false);
    }, []),
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

  const handleClick = () => {
    setOpenModalTypeSeat(true);
  };

  const handleDelete = () => {
    // lấy thông tin ghế từ index trong selectedIndexes
    const selectedSeatsFromGrid = selectedIndexes.map(
      (selectedIndex) => gridSeats[selectedIndex]
    );

    // Lọc ra các ghế trong selectedSeats có seatRow và seatColumn không tồn tại trong selectedSeatsFromGrid
    const remainingSeats = selectedSeats.filter((seat) => {
      return !selectedSeatsFromGrid.some(
        (selectedSeat) =>
          selectedSeat.seatRow === seat.seatRow &&
          selectedSeat.seatColumn === seat.seatColumn
      );
    });

    if (remainingSeats.length === selectedSeats.length) {
      setSelectedIndexes([]);
      return;
    } else {
      // Có ghế được xóa thành công
      setSelectedSeats(remainingSeats);
      setSelectedIndexes([]);
      message.success("Xóa ghế thành công!");
    }
  };

  return (
    <>
      <PageHeader title="Tạo mới phòng chiếu" numberBack={-1} type="create" />
      <Divider />
      <Card title="Tạo mới phòng chiếu" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Row gutter={[16]}>
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
                <Input
                  placeholder="Nhập tên phòng"
                  style={{ textTransform: "capitalize" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Loại phòng"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại phòng!",
                  },
                ]}
                initialValue={"2D"}
              >
                <Select style={{ width: "100%" }}>
                  <Select.Option value="2D">ROOM2D</Select.Option>
                  <Select.Option value="3D">ROOM3D</Select.Option>
                  <Select.Option value="4D">ROOM4D</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={true}>Hoạt động</Radio>
                  <Radio value={false}>Ngưng hoạt động</Radio>
                </Radio.Group>
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
                        seatRow={item.seatRow}
                        seatColumn={item.seatColumn}
                        typeSeat={typeSeat}
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
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{
            right: 50,
            marginBottom: 100,
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

export default RoomCreate;
