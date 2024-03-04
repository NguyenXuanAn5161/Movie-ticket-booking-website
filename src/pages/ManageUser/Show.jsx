import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Card,
  Col,
  Divider,
  List,
  Row,
  Tag,
  Typography,
} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader/PageHeader";

const { Text } = Typography;

const UserShow = () => {
  const user = useSelector((state) => state.user.user);

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  const infor = [
    { label: "Code", value: user?._id },
    {
      label: "Họ và tên",
      value: user?.fullName ? user?.fullName : "Chưa có thông tin",
    },
    {
      label: "Giới tính",
      value: user?.gender ? user?.gender : "Chưa có thông tin",
    },
    { label: "Tuổi", value: user?.age ? user?.age : "Chưa có thông tin" },
    {
      label: "Role",
      value: (
        <Badge
          status="processing"
          text={user?.role ? user?.role : "Chưa có thông tin"}
        />
      ),
    },
  ];

  const contact = [
    { label: "Email", value: user?.email ? user?.email : "Chưa có thông tin" },
    {
      label: "Số điện thoại",
      value: user?.phone ? user?.phone : "Chưa có thông tin",
    },
    {
      label: "Tạo ngày",
      value: moment(user?.createdAt).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      label: "Cập nhật ngày",
      value: moment(user?.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      label: "Trạng thái",
      value:
        user?.status === "active" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {user?.status}
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {user?.status ? user?.status : "Không hoạt động"}
          </Tag>
        ),
    },
  ];

  return (
    <>
      <PageHeader title="Xem chi tiết người dùng" numberBack={-1} type="show" />
      <Divider />
      <div style={{ padding: "0 20px" }}>
        <Card title="Thông tin người dùng" bordered={false}>
          <Row gutter={16}>
            <Col span={8} md={6} style={{ textAlign: "center" }}>
              <Avatar size={120} src={urlAvatar} />
            </Col>
            <Col span={8} md={9}>
              <List
                itemLayout="horizontal"
                dataSource={infor}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Text style={{ color: "#8C8C8C" }} strong>
                          {item.label}:
                        </Text>
                      }
                      description={
                        <span style={{ color: "#000", fontWeight: "400" }}>
                          {item.value}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col span={8} md={9}>
              <List
                itemLayout="horizontal"
                dataSource={contact}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Text style={{ color: "#8C8C8C" }} strong>
                          {item.label}:
                        </Text>
                      }
                      description={
                        <span style={{ color: "#000", fontWeight: "400" }}>
                          {item.value}
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default UserShow;
