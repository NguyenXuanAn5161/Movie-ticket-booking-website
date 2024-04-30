import { ArrowDownOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Tabs } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import SimpleBarChart from "../../components/Charts/BarChart";
import SimpleLineChart from "../../components/Charts/LineChart";
import SimplePieChart from "../../components/Charts/PieChart";
import { callFetchListCinema } from "../../services/apiCinema";
import { callFetchListUser } from "../../services/apiUser";
import RevenueDbByCinema from "./RevenueDbByCinema";
import RevenueDbByMovie from "./RevenueDbByMovie";
import RevenueDbByStaff from "./RevenueDbByStaff";
import RevenueDbByUser from "./RevenueDbByUser";
import InvoiceDb from "./invoiceDb";

const formatter = (value) => <CountUp end={value} separator="," />;

const items = [
  {
    key: "1",
    label: "Thống kê hóa đơn",
    children: <InvoiceDb />,
  },
  {
    key: "2",
    label: "Doanh thu theo rạp",
    children: <RevenueDbByCinema />,
  },
  {
    key: "3",
    label: "Doanh thu theo phim",
    children: <RevenueDbByMovie />,
  },
  {
    key: "4",
    label: "Doanh thu theo khách hàng",
    children: <RevenueDbByUser />,
  },
  {
    key: "5",
    label: "Doanh thu theo nhân viên",
    children: <RevenueDbByStaff />,
  },
];

const DashBoardShow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [cinema, setCinema] = useState([]);

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    console.log("cinema: ", cinema);
  }, [cinema]);

  useEffect(() => {
    fetchUser();
    fetchCinema();
  }, []);

  const fetchCinema = async () => {
    setIsLoading(true);
    const response = await callFetchListCinema(0, 1000);
    if (response?.content) {
      setCinema(response.content);
    }
    setIsLoading(false);
  };

  const fetchUser = async () => {
    setIsLoading(true);
    const response = await callFetchListUser(0, 1000, "", "", "");
    if (response?.content) {
      setUser(response.content);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card bordered={false} style={{}}>
            <Statistic
              loading={isLoading}
              title="Tổng số người dùng"
              value={user.length}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} style={{}}>
            <Statistic
              loading={isLoading}
              title="Tổng doanh thu"
              value={cinema.length}
              formatter={formatter}
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
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{
                color: "#cf1322",
              }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
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
        </Col>
      </Row>
    </>
  );
};

export default DashBoardShow;
