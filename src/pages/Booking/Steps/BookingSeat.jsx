import { Card } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpinLoading from "../../../components/Loading/Spin";
import NotificationPromotion from "../../../components/Notification/NotificationPromotion";
import SeatGrid from "../../../components/Seat/SeatGrid";
import { doSetSelectedPromotionSeat } from "../../../redux/booking/bookingSlice";
import { fetchPromotionByTicket } from "../../../services/apiPromotion";
import { callGetSeatForUserByShowtimeId } from "../../../services/apiShowTime";

const BookingSeat = () => {
  const dispatch = useDispatch();

  const selectedShowTime = useSelector(
    (state) => state.booking.selectedShowTime
  );
  const selectedSeats = useSelector((state) => state.booking.selectedSeats);
  const selectedPromotionSeat = useSelector(
    (state) => state.booking.selectedPromotionSeat
  );

  const [seatData, setSeatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (selectedShowTime) {
      fetchSeatForUser();
    }
  }, [selectedShowTime]);

  const fetchSeatForUser = async () => {
    setLoading(true);
    try {
      const res = await callGetSeatForUserByShowtimeId(selectedShowTime.id);
      console.log("res", res);
      if (res) {
        setSeatData(res);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("error fetch seat for user: ", error);
    }
  };

  // fetch promotion seats
  useEffect(() => {
    if (selectedSeats.length > 0 && selectedShowTime?.id) {
      getPromotionByTicket(selectedSeats, selectedShowTime.id);
    } else {
      dispatch(doSetSelectedPromotionSeat({}));
    }
  }, [selectedSeats]);

  const getPromotionByTicket = async (seats, showTimeId) => {
    const resPromotion = await fetchPromotionByTicket(seats, showTimeId);
    if (resPromotion) {
      if (resPromotion?.id !== selectedPromotionSeat?.id) {
        dispatch(doSetSelectedPromotionSeat(resPromotion));
        handleOpenModal(); // Hiển thị NotificationPromotion
      }
    }
  };

  return (
    <Card>
      <h5>Chọn ghế</h5>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {loading ? <SpinLoading /> : <SeatGrid seatData={seatData} />}
      </div>
      <NotificationPromotion
        promotion={selectedPromotionSeat}
        modalVisible={modalVisible}
        handleClose={handleCloseModal}
      />
    </Card>
  );
};

export default BookingSeat;
