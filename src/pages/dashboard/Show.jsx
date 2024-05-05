import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import GroupedBarChart from "../../components/Charts/BarChart";
import StatisticCountUp from "../../components/Counter/StatisticCountUp";
import useTheme from "../../core/useTheme";
import {
  callGetRevenueByYear,
  callGetRevenueGrowthByMonth,
  callGetTicketGrowthByMonth,
  callGetTopRevenueCinemaByMonth,
  callGetTopRevenueStaffByMonth,
  callGetTopRevenueUserByMonth,
} from "../../services/Statistical";
import { callFetchListCinema } from "../../services/apiCinema";
import { callFetchListUser } from "../../services/apiUser";
import { getCurrentMonth, getCurrentYear } from "../../utils/date";
import { formatCurrency } from "../../utils/formatData";
import RevenueDbByCinema from "./RevenueDbByCinema";
import RevenueDbByInvoiceCancel from "./RevenueDbByInvoiceCancel";
import RevenueDbByMovie from "./RevenueDbByMovie";
import RevenueDbByStaff from "./RevenueDbByStaff";
import RevenueDbByUser from "./RevenueDbByUser";

const items = [
  {
    key: "1",
    label: "Doanh thu theo rạp",
    children: <RevenueDbByCinema />,
  },
  {
    key: "2",
    label: "Doanh thu theo phim",
    children: <RevenueDbByMovie />,
  },
  {
    key: "3",
    label: "Doanh thu theo khách hàng",
    children: <RevenueDbByUser />,
  },
  {
    key: "4",
    label: "Doanh thu theo nhân viên",
    children: <RevenueDbByStaff />,
  },
  {
    key: "5",
    label: "Thống kê trả vé",
    children: <RevenueDbByInvoiceCancel />,
  },
];

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

  const onChange = (key) => {
    console.log("key: ", key);
  };

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
    const response = await callGetTopRevenueCinemaByMonth();
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
    setIsLoadingUser(true);
    const response = await callFetchListUser(0, 1000, "", "", "");
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
          bordered={false}
          // title={renderHeader("Top 5 rạp có doanh thu cao nhất")}
        >
          {/* <GroupedBarChart data={topRevenueCinema} /> */}
          <GroupedBarChart
            data={testData}
            title={"Top 5 rạp có doanh thu cao nhất"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          bordered={false}
          // title={renderHeader("Top 5 phim có doanh thu cao nhất")}
        >
          {/* <GroupedBarChart data={topRevenueMovie} /> */}
          <GroupedBarChart
            data={topMovie}
            title={"Top 5 phim có doanh thu cao nhất"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          bordered={false}
          // title={renderHeader("Top 5 phim có doanh thu cao nhất")}
        >
          {/* <GroupedBarChart data={topRevenueMovie} /> */}
          <GroupedBarChart
            data={topRevenueUser}
            title={"Top 5 khách hàng có mức chi tiêu cao nhất"}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          bordered={false}
          // title={renderHeader("Top 5 phim có doanh thu cao nhất")}
        >
          {/* <GroupedBarChart data={topRevenueMovie} /> */}
          <GroupedBarChart
            // data={topRevenueStaff}
            data={topStaff}
            title={"Top 5 nhân viên có doanh số bán cao nhất"}
          />
        </Card>
      </Col>

      {/* --------------- */}
      {/* <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="Idle"
            value={9.3}
            precision={2}
            valueStyle={{
              color: "#cf1322",
            }}
            prefix={<FaArrowUp />}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={24}>
        <Card bordered={false}>
          <Tabs
            style={{ minHeight: 400 }}
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
            indicator={{
              size: (origin) => origin - 20,
              align: "center",
            }}
          />
        </Card>
      </Col> */}
      {/* <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Account Balance (CNY)"
              value={112893}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card bordered={false}>
            <SimpleBarChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ flex: 1 }} bordered={false}>
            <SimpleLineChart />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <SimplePieChart />
          </Card>
        </Col> */}
    </Row>
  );
};

export default DashBoardShow;
