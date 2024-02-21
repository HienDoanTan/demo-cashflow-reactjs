import {Col, Row, Card, Statistic} from 'antd';
import React from 'react';
import CountUp from 'react-countup';

const formatter = (value) => <CountUp end={value} separator=","/>;
const CountMonthComponent = () => (
    <Row gutter={16}>
        <Col span={24}>
            <Card bordered={true}>
                <Statistic title="Active Users" value={112893} formatter={formatter}/>
            </Card>
        </Col>
        <Col span={24}>
            <Card bordered={true}>
                <Statistic title="Account Balance (CNY)" value={112893} precision={2} formatter={formatter}/>
            </Card>
        </Col>
    </Row>
);
export default CountMonthComponent;