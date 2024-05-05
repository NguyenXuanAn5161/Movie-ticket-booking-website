import { Card, Col, Row, Statistic, Tabs } from "antd";
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
  const [user, setUser] = useState([]);
  const [cinema, setCinema] = useState([]);
  const [revenueByYear, setRevenueByYear] = useState(0);
  const [currentRevenueGrowth, setCurrentRevenueGrowth] = useState(0);
  const [currentTicketGrowth, setCurrentTicketGrowth] = useState(0);
  const [topRevenueCinema, setTopRevenueCinema] = useState([]);
  const [topRevenueMovie, setTopRevenueMovie] = useState([]);

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
  }, []);

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
    <>
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
          <Card bordered={false} title="Top 5 rạp có doanh thu cao nhất">
            <GroupedBarChart data={topRevenueCinema} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} title="Top 5 phim có doanh thu cao nhất">
            <GroupedBarChart data={topRevenueMovie} />
          </Card>
        </Col>

        {/* --------------- */}
        <Col span={12}>
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
        </Col>
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
    </>
  );
};

export default DashBoardShow;
