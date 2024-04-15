import { Badge, Col, Image } from "antd";
import moment from "moment";
import { FORMAT_DATE } from "../../utils/constant";
import { imageError } from "../../utils/imageError";

const User = ({ user }) => (
  <div>
    <div>
      <span style={{ fontWeight: 700 }}>Họ và tên:</span>{" "}
      {user?.username || "Trống"}
    </div>
    <div>
      <span style={{ fontWeight: 700 }}>Email:</span> {user?.email || "Trống"}
    </div>
    <div>
      <span style={{ fontWeight: 700 }}>Số điện thoại:</span>{" "}
      {user?.phone || "Trống"}
    </div>
    <div>
      <span style={{ fontWeight: 700 }}>Giới tính:</span>{" "}
      {user?.gender ? "Nam" : "Nữ"}
    </div>
    <div>
      <span style={{ fontWeight: 700 }}>Trạng thái:</span>{" "}
      <Badge
        status={user?.enabled ? "processing" : "default"}
        text={user?.enabled ? "Hoạt động" : "Ngưng hoạt động"}
      />
    </div>
  </div>
);

const Movie = ({ item }) => (
  <div style={{ display: "flex", flexDirection: "row" }}>
    <Col span={10}>
      <Image
        width={150}
        height={"auto"}
        src={item?.movieDto?.imageLink}
        fallback={imageError}
        alt="Lỗi tải hình ảnh"
      />
    </Col>
    <Col span={14} style={{ marginLeft: 5 }}>
      <div>
        <span style={{ fontWeight: 700 }}>Tên phim:</span>{" "}
        {item?.movieDto?.name || "Trống"}
      </div>
      <div>
        <span style={{ fontWeight: 700 }}>Thời gian:</span>{" "}
        {item?.movieDto?.durationMinutes || "Trống"}
      </div>
      <div>
        <span style={{ fontWeight: 700 }}>Diễn viên:</span>{" "}
        {item?.movieDto?.cast || "Trống"}
      </div>
      <div>
        <span style={{ fontWeight: 700 }}>Nhà sản xuất:</span>{" "}
        {item?.movieDto?.producer || "Trống"}
      </div>
      <div>
        <span style={{ fontWeight: 700 }}>Thể loại:</span>{" "}
        {item?.movieDto?.genres?.map((genre) => genre.name) || "Trống"}
      </div>
      <div>
        <span style={{ fontWeight: 700 }}>Lịch chiếu:</span>{" "}
        {`${item?.showTimeDto?.showTime} ${moment(
          item?.showTimeDto?.showDate
        ).format(FORMAT_DATE)}` || "Trống"}
      </div>
    </Col>
  </div>
);

const CinemaRoom = ({ item }) => (
  <div>
    <div>
      <span style={{ fontWeight: 700 }}>Tên rạp:</span>{" "}
      {item?.cinemaDto?.name || "Trống"}
    </div>
    <div>
      <span style={{ fontWeight: 700 }}>Tên phòng:</span>{" "}
      {item?.roomDto?.name || "Trống"}
    </div>
    <div>
      <span style={{ fontWeight: 700 }}>Loại phòng:</span>{" "}
      {item?.roomDto?.type || "Trống"}
    </div>
    <div>
      <span style={{ fontWeight: 700 }}>Địa chỉ:</span>{" "}
      {`${item?.cinemaDto?.address.city}, ${item?.cinemaDto?.address.district}, ${item?.cinemaDto?.address.ward}, ${item?.cinemaDto?.address.street}.` ||
        "Trống"}
    </div>
  </div>
);

const Content = ({ type, item }) => {
  switch (type) {
    case "cinemaRoom":
      return <CinemaRoom item={item} />;
    case "user":
      return <User user={item?.userDto} />;
    default:
      return <Movie item={item} />;
  }
};

export default Content;
