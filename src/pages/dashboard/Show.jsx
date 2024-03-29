import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { Statistic } from "antd";
import CountUp from "react-countup";
import SimpleBarChart from "../../components/Charts/BarChart";
import SimpleLineChart from "../../components/Charts/LineChart";
import SimplePieChart from "../../components/Charts/PieChart";

const formatter = (value) => <CountUp end={value} separator="," />;

const DashBoardShow = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{
                color: "#3f8600",
              }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
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
              title="Active Users"
              value={112893}
              formatter={formatter}
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
        <Col span={12}>
          <Card bordered={false}>
            <SimpleBarChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
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
