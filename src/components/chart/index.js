import React, {useEffect, useState} from "react";
import {Col, Row, List, Card, Segmented, Space, Dropdown, Button, Spin, Empty} from "antd";
import DefaultChart from "./default/default_chart";
import moment from 'moment';
import {DownOutlined, EllipsisOutlined, LineChartOutlined, BarChartOutlined} from "@ant-design/icons";
import YearsChart from "./default/years_chart";
import {split_long_array_with_size} from "../../helpers/helpers";
import {func} from "prop-types";
import PieChartComponent from "./default/pie_chart";

const ChartComponent = (props) => {
    const {array_data} = props;
    const {t} = props;
    let [default_page, set_default_page] = useState(1);
    const current_year = moment().year();
    const [defaultChart, set_defaultChart] = useState('column');
    const [isLoading, setIsLoading] = useState(true);
    const [array_data_year_chart, set_array_data_year_chart] = useState([]);
    const [default_segmented_options, set_default_segmented_options] = useState(1);

    function onClick(e) {
        set_defaultChart(e.key);
    }

    function fn_onChange_Segmented(value) {
        set_default_segmented_options(value);
    }

    useEffect(() => {
        setIsLoading(false);
        if (props.array_data) {
            const data = split_long_array_with_size(props.array_data, 5);
            if (data.length > 0) {
                set_array_data_year_chart(data);
            }
        }
    }, [props.array_data]);

    const items = [
        {
            label: t('chart.column_chart'),
            key: 'column',
            icon: <BarChartOutlined />
        },
        {
            label: t('chart.spine_chart'),
            key: 'spline',
            icon: <LineChartOutlined />
        },
    ];

    return (
        <Row gutter={12}>
            <Col lg={24} md={24} xs={24}>
                <Card>
                    <Row gutter={24}>
                        <Col span={12} style={{textAlign: 'left'}}>
                            <Segmented defaultValue={default_segmented_options} onChange={fn_onChange_Segmented}
                                       options={[{
                                           label: t('chart.txt_monthly'),
                                           value: 1,
                                       }, {
                                           label: t('chart.txt_yearly'),
                                           value: 2,
                                       }]}/>
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                            <Dropdown menu={{
                                items,
                                onClick,
                            }}>
                                <Button onClick={(e) => e.preventDefault()}>
                                    {defaultChart === 'column' ? t('chart.column_chart') : t('chart.spine_chart')}
                                    <DownOutlined/>
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                    <br/>
                    {(() => {
                        if (default_segmented_options === 1) {
                            if (array_data.length === 0) {
                                return (
                                    <Empty/>
                                )
                            } else {
                                return (
                                    <List
                                        dataSource={array_data}
                                        itemLayout={"vertical"}
                                        size="large"
                                        loading={isLoading}
                                        pagination={{
                                            onChange: page => {

                                            },
                                            pageSize: 1,
                                            total: array_data.length,
                                            defaultCurrent: array_data.length
                                        }}
                                        renderItem={item => (
                                            <List.Item key={item.year} style={{padding: 0}}>
                                                <DefaultChart type_chart={defaultChart}
                                                              id_name={`${defaultChart}` + "-chart"}
                                                              data={item} {...props}/>
                                            </List.Item>
                                        )}
                                    />
                                )
                            }
                        } else if (default_segmented_options === 2) {
                            if (array_data.length === 0) {
                                return (
                                    <Empty/>
                                )
                            } else {
                                return (
                                    <Spin spinning={isLoading}>
                                        <List
                                            dataSource={array_data_year_chart}
                                            itemLayout={"vertical"}
                                            size="large"
                                            loading={isLoading}
                                            pagination={{
                                                onChange: page => {

                                                },
                                                pageSize: 1
                                            }}
                                            renderItem={(item, i) => (
                                                <List.Item key={i} style={{padding: 0}}>
                                                    <YearsChart type_chart={defaultChart}
                                                                id_name={`${defaultChart}` + "-year-chart" + i}
                                                                data={item} {...props}/>
                                                </List.Item>
                                            )}
                                        />
                                    </Spin>
                                )
                            }
                        }
                    })()}
                </Card>
            </Col>
            <Col lg={8} md={24} xs={24}>

            </Col>
        </Row>
    )
}
export default ChartComponent;
