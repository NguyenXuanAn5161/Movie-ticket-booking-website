import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GroupedBarChart from "../../components/Charts/BarChart";
import StatisticCountUp from "../../components/Counter/StatisticCountUp";
import useTheme from "../../core/useTheme";
import {
  callGetRevenueByYear,
  callGetRevenueGrowthByMonth,
  callGetTicketGrowthByMonth,
  callGetTopRevenueCinemaByMonth,
  callGetTopRevenueMovieByMonth,
  callGetTopRevenueStaffByMonth,
  callGetTopRevenueUserByMonth,
} from "../../services/Statistical";
import { callFetchListCinema } from "../../services/apiCinema";
import { callFetchListUser } from "../../services/apiUser";
import { getCurrentMonth, getCurrentYear } from "../../utils/date";
import { formatCurrency } from "../../utils/formatData";

const testData = [
  { name: "Thủ Đức", totalRevenue: 2000000, quantity: 70 },
  { name: "Bình Thạnh", totalRevenue: 1500000, quantity: 60 },
  { name: "Tân Bình", totalRevenue: 1200000, quantity: 55 },
  { name: "Gò Vấp", totalRevenue: 1000000, quantity: 50 },
  { name: "Nguyễn Trãi", totalRevenue: 800000, quantity: 45 },
];

const topMovie = [
  {
    name: "Hào Quang Đẫm Máu",
    totalRevenue: 2000000,
    quantity: 70,
  },
  {
    name: "Thanh Xuân 18x2: Lữ Trình Hướng Về Em",
    totalRevenue: 1500000,
    quantity: 60,
  },
  {
    name: "Kung Fu Panda 4",
    totalRevenue: 1200000,
    quantity: 55,
  },
  {
    name: "Godzilla x Kong: Đế Chế Mới",
    totalRevenue: 1000000,
    quantity: 50,
  },
  {
    name: "Điềm Báo Của Quỷ",
    totalRevenue: 800000,
    quantity: 45,
  },
];

const topStaff = [
  { name: "Nguyễn Thị Hằng", totalRevenue: 5000000 },
  { name: "Trần Văn Đức", totalRevenue: 4800000 },
  { name: "Lê Thị Mai", totalRevenue: 4500000 },
  { name: "Phạm Minh Tuấn", totalRevenue: 4200000 },
  { name: "Hoàng Anh Tuấn", totalRevenue: 4000000 },
];

const DashBoardShow = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingCinema, setIsLoadingCinema] = useState(false);
  const [isLoadingCurrentRevenueGrowth, setIsLoadingCurrentRevenueGrowth] =
    useState(false);
  const [isLoadingCurrentTicketGrowth, setIsLoadingCurrentTicketGrowth] =
    useState(false);
  const [isLoadingTopRevenueCinema, setIsLoadingTopRevenueCinema] =
    useState(false);
  const [isLoadingTopRevenueMovie, setIsLoadingTopRevenueMovie] =
    useState(false);
  const [isLoadingTopRevenueUser, setIsLoadingTopRevenueUser] = useState(false);
  const [isLoadingStaffByMonth, setIsLoadingStaffByMonth] = useState(false);
  const [user, setUser] = useState([]);
  const [cinema, setCinema] = useState([]);
  const [revenueByYear, setRevenueByYear] = useState(0);
  const [currentRevenueGrowth, setCurrentRevenueGrowth] = useState(0);
  const [currentTicketGrowth, setCurrentTicketGrowth] = useState(0);
  const [topRevenueCinema, setTopRevenueCinema] = useState([]);
  const [topRevenueMovie, setTopRevenueMovie] = useState([]);
  const [topRevenueUser, setTopRevenueUser] = useState([]);
  const [topRevenueStaff, setTopRevenueStaff] = useState([]);

  useEffect(() => {
    console.log("cinema: ", cinema);
  }, [cinema]);

  useEffect(() => {
    fetchUser();
    fetchCinema();
    fetchRevenueByYear();
    fetchCurrentRevenueGrowth();
    fetchCurrentTicketGrowth();
    fetchTopRevenueCinemaByMonth();
    fetchTopRevenueMovieByMonth();
    fetchTopRevenueUserByMonth();
    fetchTopRevenueStaffByMonth();
  }, []);

  const fetchTopRevenueUserByMonth = async () => {
    setIsLoadingTopRevenueUser(true);
    const response = await callGetTopRevenueUserByMonth();
    if (response.length > 0) {
      setTopRevenueUser(response);
    }
    setIsLoadingTopRevenueUser(false);
  };

  const fetchTopRevenueStaffByMonth = async () => {
    setIsLoadingStaffByMonth(true);
    const response = await callGetTopRevenueStaffByMonth();
    if (response.length > 0) {
      setTopRevenueStaff(response);
    }
    setIsLoadingStaffByMonth(false);
  };

  const fetchTopRevenueMovieByMonth = async () => {
    setIsLoadingTopRevenueMovie(true);
    const response = await callGetTopRevenueMovieByMonth();
    if (response.length > 0) {
      setTopRevenueMovie(response);
    }
    setIsLoadingTopRevenueMovie(false);
  };

  const fetchTopRevenueCinemaByMonth = async () => {
    setIsLoadingTopRevenueCinema(true);
    const response = await callGetTopRevenueCinemaByMonth();
    if (response.length > 0) {
      setTopRevenueCinema(response);
    }
    setIsLoadingTopRevenueCinema(false);
  };

  const fetchCurrentTicketGrowth = async () => {
    setIsLoadingCurrentTicketGrowth(true);
    const response = await callGetTicketGrowthByMonth();
    if (response) {
      setCurrentTicketGrowth(response);
    }
    setIsLoadingCurrentTicketGrowth(false);
  };

  const fetchCurrentRevenueGrowth = async () => {
    setIsLoadingCurrentRevenueGrowth(true);
    const response = await callGetRevenueGrowthByMonth();
    if (response) {
      setCurrentRevenueGrowth(response);
    }
    setIsLoadingCurrentRevenueGrowth(false);
  };

  const fetchCinema = async () => {
    setIsLoadingCinema(true);
    const response = await callFetchListCinema(0, 1000);
    if (response?.content) {
      setCinema(response.content);
    }
    setIsLoadingCinema(false);
  };

  const fetchUser = async () => {
    let query = `page=${0}&size=${1000}`;
    setIsLoadingUser(true);
    const response = await callFetchListUser(query);
    if (response?.content) {
      setUser(response.content);
    }
    setIsLoadingUser(false);
  };

  // tổng doanh thu năm @year
  const fetchRevenueByYear = async (year) => {
    setIsLoadingRevenue(true);
    const response = await callGetRevenueByYear();
    if (response) {
      console.log("response: ", response);
      setRevenueByYear(response);
    }
    setIsLoadingRevenue(false);
  };

  const handleDetailStatistical = (type) => {
    switch (type) {
      case "cinema":
        navigate("/statisticalCinema");
        break;
      case "movie":
        navigate("/statisticalMovie");
        break;
      case "user":
        navigate("/statisticalUser");
        break;
      case "staff":
        navigate("/statisticalStaff");
        break;
      default:
        break;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={4}>
        <Card bordered={false} style={{}}>
          <StatisticCountUp
            loading={isLoadingUser}
            title="Tổng số người dùng"
            value={user.length}
            suffix="người"
          />
        </Card>
      </Col>
      <Col span={3}>
        <Card bordered={false} style={{}}>
          <StatisticCountUp
            loading={isLoadingCinema}
            title="Tổng số rạp"
            value={cinema.length}
            suffix="rạp"
          />
        </Card>
      </Col>
      <Col span={5}>
        <Card bordered={false} style={{}}>
          <StatisticCountUp
            loading={isLoadingRevenue}
            title={`Tổng doanh thu ${getCurrentYear()}`}
            value={revenueByYear}
            // value={99999999999}
            formatFn={formatCurrency}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false} style={{}}>
          <StatisticCountUp
            loading={isLoadingCurrentRevenueGrowth}
            title={`Tăng trưởng doanh thu tháng ${getCurrentMonth()}`}
            value={currentRevenueGrowth}
            valueStyle={{
              color: theme.colors.success,
            }}
            decimals={2}
            prefix={<FaArrowUp />}
            suffix={"%"}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false} style={{}}>
          <StatisticCountUp
            loading={isLoadingCurrentTicketGrowth}
            title={`Tăng trưởng số vé tháng ${getCurrentMonth()}`}
            value={currentTicketGrowth}
            valueStyle={{
              color: theme.colors.success,
            }}
            prefix={<FaArrowUp />}
            decimals={2}
            suffix={"%"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          style={{ cursor: "pointer" }}
          onClick={() => handleDetailStatistical("cinema")}
          bordered={false}
        >
          <GroupedBarChart
            // data={testData}
            data={topRevenueCinema}
            title={"Top 5 rạp có doanh thu cao nhất"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card onClick={() => handleDetailStatistical("movie")} bordered={false}>
          <GroupedBarChart
            // data={topMovie}
            data={topRevenueMovie}
            title={"Top 5 phim có doanh thu cao nhất"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card onClick={() => handleDetailStatistical("user")} bordered={false}>
          <GroupedBarChart
            data={topRevenueUser}
            title={"Top 5 khách hàng có mức chi tiêu cao nhất"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card onClick={() => handleDetailStatistical("staff")} bordered={false}>
          <GroupedBarChart
            // data={topStaff}
            data={topRevenueStaff}
            title={"Top 5 nhân viên có doanh số bán cao nhất"}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashBoardShow;
