import {
  Badge,
  Card,
  Col,
  Descriptions,
  Divider,
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

  const item = [
    { label: "Code", children: user?.code },
    {
      label: "Họ và tên",
      children: user?.username ? user?.username : "Chưa có thông tin",
    },
    {
      label: "Giới tính",
      children:
        user?.gender === true
          ? "Nam"
          : user?.gender === false
          ? "Nữ"
          : "Chưa có thông tin",
    },
    {
      label: "Ngày sinh",
      children: user?.birthday
        ? moment(user?.birthday).format("DD-MM-YYYY")
        : "Chưa có thông tin",
    },
    {
      label: "Role",
      children: (
        <Badge
          status="processing"
          text={
            user?.roles && user?.roles.length > 0
              ? user.roles[0].name
              : "Chưa có thông tin"
          }
        />
      ),
    },
    {
      label: "Email",
      children: user?.email ? user?.email : "Chưa có thông tin",
    },
    {
      label: "Số điện thoại",
      children: user?.phone ? user?.phone : "Chưa có thông tin",
    },
    {
      label: "Tạo ngày",
      children: moment(user?.createdDate).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      label: "Trạng thái",
      children: (
        <Tag color={user?.enabled === true ? "success" : "error"}>
          {user?.enabled === true ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Xem chi tiết người dùng"
        numberBack={-1}
        type="show"
        hiddenEdit
      />
      <Divider />
      <div style={{ padding: "0 20px" }}>
        <Card title="Thông tin người dùng" bordered={false}>
          <Row gutter={16}>
            <Col span={24}>
              <Descriptions
                labelStyle={{ color: "#333", fontWeight: "700" }}
                layout="vertical"
                bordered
                size="small"
                column={{
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 4,
                  xl: 4,
                  xxl: 4,
                }}
                items={item}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default UserShow;
