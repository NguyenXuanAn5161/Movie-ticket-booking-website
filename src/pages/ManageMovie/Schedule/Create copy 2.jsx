import { Button, Card, Divider, Form, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Schedule from "../../../components/Schedule/Schedule";

// thay đổi #1
const ScheduleCreate = () => {
  // mặc định #2
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    console.log("Check values of form: ", values);
    // thay đổi #1
    // setIsSubmit(true);
    // // Gọi API để tạo mới hoặc cập nhật dữ liệu với dữ liệu từ Form
    // try {
    //   // if (res && res.data) {
    //   if (true) {
    //     // thay đổi #1 message
    //     message.success("Tạo mới lịch chiếu phim thành công!");
    //     // setIsSubmit(false);
    //   } else {
    //     notification.error({
    //       message: "Đã có lỗi xảy ra!",
    //       description: res.message,
    //     });
    //     setIsSubmit(false);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   notification.error({
    //     message: "Đã có lỗi xảy ra!",
    //     description: "Xin vui lòng thử lại sau.",
    //   });
    // } finally {
    //   setIsSubmit(false);
    // }
  };

  return (
    <>
      {/* // thay đổi #1 title */}
      <PageHeader
        title="Tạo mới lịch chiếu phim"
        numberBack={-1}
        type="create"
      />
      <Divider />
      {/* // thay đổi #1 title */}
      <Card title="Tạo mới lịch chiếu phim" bordered={false}>
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="true"
          style={{ margin: "0 auto" }}
        >
          <Schedule form={form} />
          <Row
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmit}>
                Tạo mới
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default ScheduleCreate;

// Hàm fetch danh sách phim
// async function fetchMovieList(value) {
//   try {
//     // Thực hiện gọi API hoặc tìm kiếm dữ liệu từ nguồn dữ liệu có sẵn
//     // Ví dụ: Gửi yêu cầu tới API để lấy danh sách phim dựa trên giá trị tìm kiếm `value`
//     const response = await fetch(
//       `https://example.com/api/movies?search=${value}`
//     );

//     // Kiểm tra xem kết quả trả về từ API có thành công không
//     if (!response.ok) {
//       // Xử lý lỗi nếu cần thiết, ví dụ: throw new Error("Failed to fetch movies");
//     }

//     // Chuyển đổi dữ liệu nhận được từ API sang định dạng phù hợp để hiển thị trong ô chọn phim
//     const data = await response.json();
//     const movies = data.results.map((movie) => ({
//       label: movie.title, // Label của mỗi phim, có thể là tiêu đề của phim
//       value: movie.id, // Giá trị của mỗi phim, có thể là ID của phim
//     }));

//     // Trả về một mảng các đối tượng { label: string, value: any } đại diện cho danh sách phim tìm kiếm được
//     return movies;
//   } catch (error) {
//     // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình tìm kiếm
//     console.error("Error fetching movies:", error);
//     // Trả về một mảng trống nếu xảy ra lỗi
//     return [];
//   }
// }

async function fetchMovieList(username) {
  return fetch("https://randomuser.me/api/?results=5")
    .then((response) => response.json())
    .then((body) =>
      body.results.map((user) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }))
    );
}
