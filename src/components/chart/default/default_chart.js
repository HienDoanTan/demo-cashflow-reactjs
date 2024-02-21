import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import highcharts3d from "highcharts/highcharts-3d";
import darkgreen from "../../../themes/highcharts/darkgreen";
import gridlight from "../../../themes/highcharts/gridlight";
import {translate} from 'react-switch-lang';
import {colorOptions} from "../../../config/colors_config.json";

highcharts3d(Highcharts);
const DefaultChart = (props) => {
    const {t, data, type_chart, id_name} = props;
    const {year} = data;
    const chartRef = React.createRef();
    let [loading, isLoading] = useState(true);
    const [series, setSeries] = useState([
        {
            name: t('income.name'),
            data: [null, null, null, null, null, null, null, null, null, null, null, null],
            stack: "income"
        },
        {
            name: t('expense.name'),
            data: [null, null, null, null, null, null, null, null, null, null, null, null],
            stack: "expense_saving"
        },
        {
            name: t('saving.name'),
            data: [null, null, null, null, null, null, null, null, null, null, null, null],
            stack: "expense_saving"
        }
    ]);

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: type_chart,
            borderColor: colorOptions.saving,
            //borderRadius: 20,
            //borderWidth: 1,
            options3d: {
                enabled: false,
                alpha: 0,
                beta: 0,
                viewDistance: 25,
                depth: 40
            },
            style: {
                fontFamily: 'Open Sans, Arial, Helvetica, sans-serif',
            },
        },
        title: {
            text: t('chart.year') + ' ' + year,
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                depth: 0,
                stacking: "normal",
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                borderRadiusTopLeft: 8,
                borderRadiusTopRight: 8
            }
        },
        colors: [colorOptions.income, colorOptions.expense, colorOptions.saving],
        xAxis: {
            labels: {
                style: {
                   // font: '12px Arial, sans-serif',
                }
            },
            gridLineWidth: 0.3,
            categories: [
                t('month.Jan'),
                t('month.Feb'),
                t('month.Mar'),
                t('month.Apr'),
                t('month.May'),
                t('month.Jun'),
                t('month.Jul'),
                t('month.Aug'),
                t('month.Sep'),
                t('month.Oct'),
                t('month.Nov'),
                t('month.Dec')]
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
                    // fontSize: '12px',
                    // fontWeight: 'bold'
                }
            },
        },
        tooltip: {
            formatter: fn_formatter
        },
        series: series,
    })

    function fn_formatter(tooltip, x = this.x, y = this.y, series = this.series, point = this.point) {
        const total = t('home.total');
        let stackTotal = point.stackTotal;
        if (stackTotal) {
            stackTotal = stackTotal.toLocaleString()
        }
        if (y) {
            y = this.y.toLocaleString();
        }
        if (type_chart === "column") {
            return (
                "<b>" +
                x.replace("<br/>", "") +
                "</b><br/>" +
                series.name +
                ": " +
                y +
                "<br/>" +
                "<b> " + total + " :</b> " + stackTotal
            );
        } else {
            return (
                "<b>" +
                x.replace("<br/>", "") +
                "</b><br/>" +
                series.name +
                ": " +
                y
            );
        }
    }

    function fn_update_chart_data(data_income, data_expense, data_saving, year, chart) {
        let i,
            array_income = [],
            array_expense = [],
            array_saving = [];
        for (i = 1; i <= 12; i++) {
            // --- check data income
            if (data_income) {
                let val;
                data_income.map((data, index) => {
                    if (data.period === i) {
                        val = parseInt(data.totalMoney);
                    }
                });

                if (val) {
                    array_income.push(val);
                } else {
                    array_income.push(null);
                }
            }

            if (data_expense) {
                let val;
                data_expense.map((data, index) => {
                    if (data.period === i) {
                        val = parseInt(data.totalMoney);
                    }
                });

                if (val) {
                    array_expense.push(val);
                } else {
                    array_expense.push(null);
                }
            }

            if (data_saving) {
                let val;
                data_saving.map((data, index) => {
                    if (data.period === i) {
                        val = parseInt(data.totalMoney);
                    }
                });

                if (val) {
                    array_saving.push(val);
                } else {
                    array_saving.push(null);
                }
            }
        }

        if (chart.renderTo.id === `${id_name}-${year}`) {
            if (array_income.length > 0) {
                if (chart.series) {
                    chart.series[0].setData(array_income);
                }
            }
            if (array_expense.length > 0) {
                if (chart.series) {
                    chart.series[1].setData(array_expense);
                }
            }
            if (array_saving.length > 0) {
                if (chart.series) {
                    chart.series[2].setData(array_saving);
                }
            }

            if (array_income.length === 0 && array_expense.length === 0 && array_saving.length === 0) {
                chart.destroy();
            }
        }

    }

    //------------- Update language
    useEffect(() => {
        const chart = chartRef.current.chart;
        if (chart) {
            chart.title.update({text: t('chart.year') + ' ' + year});
            chart.series[0].update({name: t('income.name')});
            chart.series[1].update({name: t('expense.name')});
            chart.series[2].update({name: t('saving.name')});
            chart.xAxis[0].setCategories([t('month.Jan'), t('month.Feb'), t('month.Mar'), t('month.Apr'), t('month.May'),
                t('month.Jun'), t('month.Jul'), t('month.Aug'), t('month.Sep'), t('month.Oct'), t('month.Nov'), t('month.Dec')]);
        }
    }, [props.valueLanguage]);

    //------------ Update theme
    useEffect(() => {
        const chart = chartRef.current.chart;
        if (chart) {
            if (!props.isDarkMode) {
                setChartOptions(gridlight);
            } else {
                setChartOptions(darkgreen);
            }
        }
    }, [props.isDarkMode]);

    useEffect(() => {
        const chart = chartRef.current.chart;
        if (chart) {
            if (props.data) {
                isLoading(loading = true);
                const {year, incomeDto, expenseDto, savingDto} = props.data;
                fn_update_chart_data(incomeDto, expenseDto, savingDto, year, chart);
                isLoading(loading = false);
            }
        }
    }, [props.data]);

    useEffect(() => {
        const chart = chartRef.current.chart;
        if (chart) {
            chart.series[0].update({type: props.type_chart});
            chart.series[1].update({type: props.type_chart});
            chart.series[2].update({type: props.type_chart});
        }
    }, [props.type_chart]);

    return (
        <div style={{width: '100%'}}>
            <br/>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartRef}
                containerProps={{className: `${id_name}-${year}`, id: `${id_name}-${year}`}}
            />
        </div>
    )
}

DefaultChart.propTypes = {
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
)(translate(DefaultChart));
