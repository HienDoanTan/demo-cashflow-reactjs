import React, {useEffect, useState} from "react";
import {Col, Row, Card, Layout, Avatar, Typography, Space} from 'antd';
import PropTypes, {bool} from "prop-types";
import {connect} from "react-redux";
import {translate} from "react-switch-lang";
import {calculateSum} from "../../helpers/calculateSum";
import {colorOptions, flatColors} from "../../config/colors_config.json";
import {ClockCircleFilled, ClockCircleOutlined} from '@ant-design/icons';

const {Title} = Typography;
const {Meta} = Card;

const CountTotals = (props) => {
    const {data_all_year, t} = props;
    const [loading, setLoading] = useState(true);
    const [txt_income, set_txt_income] = useState(0);
    const [txt_expense, set_txt_expense] = useState(0);
    const [txt_saving, set_txt_saving] = useState(0);
    const [txt_remain, set_txt_remain] = useState(0);

    useEffect(() => {
        if (props.data_all_year.data) {
            fn_render_data_multi(
                props.data_all_year.data.incomeDto,
                props.data_all_year.data.expenseDto,
                props.data_all_year.data.savingDto
            );
        }
    }, [props.data_all_year]);

    function fn_render_data_multi(dataIncome, dataExpense, dataSaving) {
        let total_incomes = 0,
            total_expense = 0,
            total_saving = 0,
            total_remain = 0;
        if (dataIncome.length > 0) {
            total_incomes = calculateSum(dataIncome, 'totalMoney');
            if (total_incomes != null) {
                set_txt_income(total_incomes);
            }

        }
        if (dataExpense.length > 0) {
            total_expense = calculateSum(dataExpense, 'totalMoney');
            if (total_expense != null) {
                set_txt_expense(total_expense);
            }
        }
        if (dataSaving.length > 0) {
            total_saving = calculateSum(dataSaving, 'totalMoney');
            if (total_saving != null) {
                set_txt_saving(total_saving);
            }
        }

        total_remain = total_incomes - (total_expense + total_saving);
        set_txt_remain(total_remain);

        setLoading(false);
    }

    return (
        <Card title="Thống kê toàn bộ thu nhập, chi phí, tiết kiệm đã nhập">
            <Space
                direction="vertical"
                size="middle"
                style={{
                    display: 'flex',
                }}
            >
                <Col lg={24} md={12} sm={12} xs={12} span={6}>
                    <Card loading={loading} size="default">
                        <Meta
                            avatar={<Avatar style={{width: 40, height: 40, margin: 15}}
                                            src={require('../../images/icons/income.jpg').default}/>}
                            title={t('text.txt_total_income')}
                            description={
                                <Title style={{color: flatColors.EMERALD, marginTop: 0}} level={4}>
                                    {`${txt_income}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                            }
                        />
                    </Card>
                </Col>
                <Col lg={24} md={12} sm={12} xs={12} span={6}>
                    <Card loading={loading}>
                        <Meta
                            avatar={<Avatar style={{width: 40, height: 40, margin: 15}}
                                            src={require('../../images/icons/expense.jpg').default}/>}
                            title={t('text.txt_total_expense')}
                            description={
                                <Title style={{color: flatColors.ALIZARIN, marginTop: 0}} level={4}>
                                    {`${txt_expense}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                            }
                        />
                    </Card>
                </Col>
                <Col lg={24} md={12} sm={12} xs={12} span={6}>
                    <Card loading={loading}>
                        <Meta
                            avatar={<Avatar style={{width: 40, height: 40, margin: 15}}
                                            src={require('../../images/icons/saving.png').default}/>}
                            title={t('text.txt_total_saving')}
                            description={
                                <Title style={{color: colorOptions.saving, marginTop: 0}} level={4}>
                                    {`${txt_saving}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                            }
                        />
                    </Card>
                </Col>
                <Col lg={24} md={12} sm={12} xs={12} span={6}>
                    <Card loading={loading}>
                        <Meta
                            avatar={
                                <div style={{margin: 15}}>
                                    <ClockCircleOutlined style={{fontSize: 40}}/>
                                </div>
                            }
                            title={t('text.txt_remaining')}
                            description={
                                <Title style={{color: colorOptions.remaining, marginTop: 0}} level={4}>
                                    {`${txt_remain}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                            }
                        />
                    </Card>
                </Col>
            </Space>
        </Card>
    )
}
CountTotals.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {authentication} = state;
    return {
        authentication
    };
}

export default connect(
    mapStateToProps,
    null,
    null,
    {forwardRef: true}
)(translate(CountTotals));
