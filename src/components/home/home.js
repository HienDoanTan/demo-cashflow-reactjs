import React, {useEffect, useState} from "react";
import {Breadcrumb, Avatar, Space, Col, Dropdown, Layout, Image, Menu, Row, Switch, Card, Empty} from "antd";
import {setDefaultLanguage, setLanguage, setTranslations, translate, setLanguageCookie} from "react-switch-lang";
import en from "../../language/en.json";
import vi from "../../language/vi.json";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import NestedTable from "../multiple/multiple";
import IncomePage from "../incomes/index";
import ChartComponent from "../chart";
import {dataConstants} from "../../constants/data.contants";
import {dataActions} from "../../actions/index";

import {history} from '../../helpers/index';
import CountTotals from "../count_totals/count_totals";
import FooterComponent from "./footer";
import PieChartComponent from "../chart/default/pie_chart";
import 'handsontable/dist/handsontable.full.min.css';
import MultipleComponent from "../multiple/multiple";
import CountMonthComponent from "../count_month/count_month";

setTranslations({vi, en});
const {Header, Content, Footer} = Layout;

// If you want to remember selected language
setLanguageCookie();

function HomeComponent(props) {
    const {t} = props;
    const [array_data, set_array_data] = useState([]);
    const [data_all_year, set_data_all_year] = useState([]);

    useEffect(() => {
        prepare_callback();
    }, []);

    //------- Lấy list year
    async function fn_load_all_year() {
        return await props.dispatch(dataActions.getYearNumber());
    }

    //------- Lấy data theo year
    async function fn_get_data_by_year(year) {
        return await props.dispatch(dataActions.fn_get_data_by_year(year));
    }

    function prepare_callback() {
        fn_load_all_year().then(response => {
            if (response.type === dataConstants.DATA_YEAR_SUCCESS) {
                let objectX = [];
                if (response.data) {
                    (async function fnc() {
                        const promises = response.data.map((num) => fn_get_data_by_year(num.year));
                        const data_return = await Promise.all(promises);
                        if (data_return) {
                            data_return.map(value => {
                                if (value.type === dataConstants.DATA_BY_YEAR_SUCCESS) {
                                    objectX.push(value.data);
                                }
                            })
                        }
                        if (objectX.length > 0) {
                            objectX = objectX.sort((a, b) => {
                                return a.year - b.year;
                            })
                        }
                        set_array_data(objectX);
                    })();
                }
            }
        });

        fn_get_data_all_year().then(response => {
            if (response.type === dataConstants.DATA_ALL_YEAR_SUCCESS) {
                set_data_all_year(response);
            }
        });

    }

    async function fn_get_data_all_year() {
        return await props.dispatch(dataActions.fn_get_data_all_year());
    }


    return (
        <div>

            <Breadcrumb style={{margin: '16px 0'}}
                        items={[
                            {title: 'Home'},
                            {title: 'App'}
                        ]}
            />
            <div className="site-layout-background">
                <Row gutter={12}>
                    <Col lg={7} md={24} xs={24}>
                        <Card style={{borderRadius: 10}}>
                            {array_data.length === 0 ? (
                                <Empty/>
                            ) : (
                                <PieChartComponent {...props} array_data={array_data}/>
                            )}
                            {/*<CountMonthComponent/>*/}
                        </Card>
                    </Col>
                    <Col lg={17} md={24} xs={24}>
                        <Card style={{borderRadius: 10}}>
                            <IncomePage {...props} prepare_callback={prepare_callback}/>
                        </Card>
                    </Col>
                </Row>
                <br/>
                <Row gutter={12}>
                    <Col lg={16} md={24} xs={24}>
                        <ChartComponent {...props} array_data={array_data}/>
                    </Col>
                    <Col lg={8} md={24} xs={24}>
                        <CountTotals data_all_year={data_all_year} {...props} />
                    </Col>
                </Row>

                <br/>
                <Row gutter={12}>
                    <Col lg={24} md={24} xs={24}>
                        <MultipleComponent data_all_year={data_all_year}/>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

HomeComponent.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {alert, users, authentication} = state;
    const {user} = authentication;
    return {
        alert,
        users,
        user
    };
}

export default connect(mapStateToProps,
    null,
    null,
    {forwardRef: true}
)(translate(HomeComponent));
