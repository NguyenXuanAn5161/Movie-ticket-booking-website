import { Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotPermistted = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không được phép truy cập trang này."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>
      }
    />
  );
};
