import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import highcharts3d from "highcharts/highcharts-3d";
import {translate} from 'react-switch-lang';
import {colorOptions} from "../../../config/colors_config.json";
import moment from "moment";
import dark_theme from "../../../themes/highcharts/dark_theme_column_chart";
import light_theme from "../../../themes/highcharts/light_theme_column_chart";

highcharts3d(Highcharts);

const PieChartComponent = (props) => {
    const {t, array_data} = props;
    const chartColumnRef = React.createRef();
    let [loading, isLoading] = useState(true);
    const [this_year, set_this_year] = useState(moment().year());
    const [this_month, set_this_month] = useState(moment().month() + 1);
    const [object_data, set_object_data] = useState([
        {
            name: t('income.name'),
            data: [null],
            month: null
        },
        {
            name: t('expense.name'),
            data: [null],
            month: null
        },
        {
            name: t('saving.name'),
            data: [null],
            month: null
        }
    ]);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'column',
            //borderRadius: 20,
            //borderWidth: 1,
            options3d: {
                enabled: false,
                alpha: 0,
                beta: 20,
                viewDistance: 25,
                depth: 40
            },
            style: {
                fontFamily: 'Open Sans, Arial, Helvetica, sans-serif',
            },
            borderColor: colorOptions.saving
        },
        title: {
            text: t('chart.txt_chart_income_expensive_month_by_month')
        },
        subtitle: {
            text: this_month + ' / ' + this_year
        },
        xAxis: {
            categories: [],
        },
        credits: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Đơn vị (VNĐ)',
            },
            gridLineWidth: 0.3,
            labels: {
                formatter: function () {
                    if (this.value > 0) {
                        if (this.value >= 1E6) {
                            if (this.value >= 1E9) {
                                let num = (this.value / 1E9).toFixed(2);
                                return Number(num) + t("number.billion");
                            } else {
                                let num = (this.value / 1E6).toFixed(2);
                                return Number(num) + t('number.million');
                            }
                        }
                        let num = this.value / 1E3;
                        return Number(num) + t("number.thousand");
                    } else if (this.value === 0) {
                        return this.value;
                    } else {
                        if (this.value <= -1E6) {
                            let num = (this.value / 1E6).toFixed(2);
                            return Number(num) + t('number.million');
                        }
                        let num = this.value / 1E3;
                        return Number(num) + t("number.thousand");
                    }
                },
                style: {
                    font: '13px Arial, sans-serif'
                }
            },
        },
        tooltip: {formatter: fn_formatter},
        plotOptions: {
            column: {
                depth: 0,
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: object_data,
        colors: [colorOptions.income, colorOptions.expense, colorOptions.saving],
    });

    function fn_formatter(tooltip, x = this.x, y = this.y, series = this.series, point = this.point) {
        const total = t('home.total');
        let stackTotal = point.stackTotal;
        if (stackTotal) {
            stackTotal = stackTotal.toLocaleString()
        }
        if (y) {
            y = this.y.toLocaleString();
        }
        return (
            "<b>" + x + "</b><br/>" + series.name + ": " + y
        );
    }

    useEffect(() => {
        const chart = chartColumnRef.current.chart;
        if (chart) {
            if (props.array_data) {
                isLoading(loading = true);
                fn_update_chart_data(props.array_data, chart);
                isLoading(loading = false);
            }
        }
    }, [props.array_data]);


    function fn_update_chart_data(dataObject, chart) {
        dataObject.map((value, i) => {
            if (value.year === this_year) {
                let i,
                    array_income = [],
                    array_expense = [],
                    array_saving = [];
                // --- check data income
                if (value.incomeDto) {
                    let val;
                    value.incomeDto.map((data, index) => {
                        if (data.period === this_month) {
                            val = parseInt(data.totalMoney);
                        }
                    });

                    if (val) {
                        array_income.push(val);
                    } else {
                        array_income.push(0);
                    }
                }

                if (value.expenseDto) {
                    let val;
                    value.expenseDto.map((data, index) => {
                        if (data.period === this_month) {
                            val = parseInt(data.totalMoney);
                        }
                    });

                    if (val) {
                        array_expense.push(val);
                    } else {
                        array_expense.push(0);
                    }
                }

                if (value.savingDto) {
                    let val;
                    value.savingDto.map((data, index) => {
                        if (data.period === this_month) {
                            val = parseInt(data.totalMoney);
                        }
                    });

                    if (val) {
                        array_saving.push(val);
                    } else {
                        array_saving.push(0);
                    }
                }

                //if (array_income.length > 0) {
                if (chart.series) {
                    chart.series[0].setData(array_income);
                }
                //}
                //if (array_expense.length > 0) {
                if (chart.series) {
                    chart.series[1].setData(array_expense);
                }
                //}
                //if (array_saving.length > 0) {
                if (chart.series) {
                    chart.series[2].setData(array_saving);
                }
                //}

            }
        });

        const temp_month = [];
        switch (this_month) {
            case 1:
                temp_month.push(t('month.January'));
                break;
            case 2:
                temp_month.push(t('month.February'));
                break;
            case 3:
                temp_month.push(t('month.March'));
                break;
            case 4:
                temp_month.push(t('month.April'));
                break;
            case 5:
                temp_month.push(t('month.May_'));
                break;
            case 6:
                temp_month.push(t('month.June'));
                break;
            case 7:
                temp_month.push(t('month.July'));
                break;
            case 8:
                temp_month.push(t('month.August'));
                break;
            case 9:
                temp_month.push(t('month.September'));
                break;
            case 10:
                temp_month.push(t('month.October'));
                break;
            case 11:
                temp_month.push(t('month.November'));
                break;
            case 12:
                temp_month.push(t('month.December'));
                break;
        }

        chart.xAxis[0].update({categories: temp_month});
    }

//------------- Update language
    useEffect(() => {
        const chart = chartColumnRef.current.chart;
        if (chart) {
            chart.title.update({text: t('chart.txt_chart_income_expensive_month_by_month')});
            chart.series[0].update({name: t('income.name')});
            chart.series[1].update({name: t('expense.name')});
            chart.series[2].update({name: t('saving.name')});
        }
    }, [props.valueLanguage]);

//------------ Update theme
    useEffect(() => {
        const chart = chartColumnRef.current.chart;
        if (chart) {
            if (!props.isDarkMode) {
                setChartOptions(light_theme);
            } else {
                setChartOptions(dark_theme);
            }
        }
    }, [props.isDarkMode]);

    return (
        <div style={{width: '100%'}}>
            <br/>
            <br/>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartColumnRef}
            />
            <br/>
        </div>
    )
}


PieChartComponent.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {users, authentication} = state;
    const {user} = authentication;
    return {
        user,
        users
    };
}

export default connect(
    mapStateToProps,
    null,
    null,
    {forwardRef: true}
)(translate(PieChartComponent));