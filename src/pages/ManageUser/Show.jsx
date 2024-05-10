import {
  Badge,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Tag,
  notification,
} from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader/PageHeader";
import { doSetUser } from "../../redux/account/userSlice";
import { callFetchUserById } from "../../services/apiUser";
import { getErrorMessageUser } from "../../utils/errorHandling";

const UserShow = () => {
  const { userId } = useParams();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      getUserById();
    }
  }, [user]);

  const getUserById = async () => {
    const res = await callFetchUserById(userId);
    if (res?.data) {
      dispatch(doSetUser(res.data));
    } else {
      const error = getErrorMessageUser(res.response.data.message, {
        id: userId,
      });
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: error,
      });
    }
  };

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
