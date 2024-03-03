import { Avatar, Badge, Card, Descriptions, Divider } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";

const UserShow = () => {
  const user = useSelector((state) => state.user.user);

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  return (
    <>
      <PageHeader title="Xem chi tiết người dùng" numberBack={-1} />
      <Divider />
      <div style={{ padding: "0 20px" }}>
        <Card title="Thông tin người dùng" bordered={false}>
          <div
            style={{
              display: "flex",
              lexWrap: "wrap", // Chia hàng khi không đủ không gian
            }}
          >
            <div
              style={{
                flex: "1 1 50%", // Chia ngang đều ra 2 cột
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20%",
                }}
              >
                <div
                  style={{
                    border: "1px solid #e8e8e8",
                    padding: "5px",
                    borderRadius: "50%",
                  }}
                >
                  <Avatar size={80} src={urlAvatar} />
                </div>
                <div style={{ marginLeft: "20px" }}>
                  <Descriptions column={1} layout="vertical">
                    <Descriptions.Item
                      label={<span style={{ fontWeight: 700 }}>Id</span>}
                    >
                      {user?._id}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<span style={{ fontWeight: 700 }}>Họ và tên</span>}
                    >
                      {user?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={<span style={{ fontWeight: 700 }}>Email</span>}
                    >
                      {user?.email}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <span style={{ fontWeight: 700 }}>Số điện thoại</span>
                      }
                    >
                      {user?.phone}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            </div>
            <div
              style={{
                flex: "1 1 50%", // Chia ngang đều ra 2 cột
                marginLeft: "10%",
              }}
            >
              <Descriptions column={1} layout="vertical">
                <Descriptions.Item
                  label={<span style={{ fontWeight: 700 }}>Role</span>}
                >
                  <Badge status="processing" text={user?.role} />
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span style={{ fontWeight: 700 }}>Tạo ngày</span>}
                >
                  {moment(user?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                </Descriptions.Item>
                <Descriptions.Item
                  label={<span style={{ fontWeight: 700 }}>Cập nhật ngày</span>}
                >
                  {moment(user?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UserShow;
