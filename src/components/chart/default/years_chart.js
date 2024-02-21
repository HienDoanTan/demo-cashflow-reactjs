import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Highcharts from 'highcharts';
import highcharts3d from "highcharts/highcharts-3d";
import HighchartsReact from 'highcharts-react-official';
import darkgreen from "../../../themes/highcharts/darkgreen_year_chart";
import gridlight from "../../../themes/highcharts/gridlight_year_chart";
import {translate} from 'react-switch-lang';
import {colorOptions} from "../../../config/colors_config.json";

highcharts3d(Highcharts);

const YearsChart = (props) => {
    const {t, data, type_chart, id_name} = props;
    const chartYearRef = React.createRef();
    let [loading, isLoading] = useState(true);
    let [list_year, set_list_year] = useState([]);
    const [data_year, set_data_year] = useState([{
        name: t('income.name'),
        data: []
    }, {
        name: t('expense.name'),
        data: []
    }, {
        name: t('saving.name'),
        data: []
    }]);

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
                fontFamily: 'Open Sans, Arial, Helvetica, sans-serif'
            },
        },
        title: {
            text: t('chart.txt_chart_income_expensive_year_by_year')
        },
        credits: {
            enabled: false
        },

        subtitle: {
            //text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
        },

        yAxis: {
            gridLineWidth: 0.3,
            title: {
                text: 'Đơn vị (VNĐ)',
            },
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

            }
        },

        xAxis: {
            accessibility: {},
            categories: list_year,
            gridLineWidth: 0.3,
            labels: {
                style: {
                    font: '13px Arial, sans-serif',
                    fontWeight: 'bold'
                }
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                //pointStart: 2010
            }
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        },
        series: data_year
    });

    //------------ Update theme
    useEffect(() => {
        const chart = chartYearRef.current.chart;
        if (chart) {
            if (!props.isDarkMode) {
                setChartOptions(gridlight);
            } else {
                setChartOptions(darkgreen);
            }
        }
    }, [props.isDarkMode]);

    useEffect(() => {
        const chart = chartYearRef.current.chart;
        if (chart) {
            let i, array_income = [],
                array_expenseDto = [],
                array_saving = [],
                array_year = [];
            if (props.data.length > 0) {
                props.data.map((data, index) => {

                    // data income
                    if (data.incomeDto.length > 0) {
                        let count = 0;
                        data.incomeDto.map((value, i) => {
                            count += parseInt(value.totalMoney);
                        });
                        array_income.push(count);
                    } else {
                        array_income.push(null);
                    }

                    // data expense
                    if (data.expenseDto.length > 0) {
                        let count = 0;
                        data.expenseDto.map((value, i) => {
                            count += parseInt(value.totalMoney);
                        });
                        array_expenseDto.push(count);
                    } else {
                        array_expenseDto.push(null);
                    }

                    // data saving
                    if (data.savingDto.length > 0) {
                        let count = 0;
                        data.savingDto.map((value, i) => {
                            count += parseInt(value.totalMoney);
                        });
                        array_saving.push(count);
                    } else {
                        array_saving.push(null);
                    }

                    array_year.push(data.year);

                    //-------------- Update charts
                    if (array_income.length > 0) {
                        if (chart.series) {
                            chart.series[0].setData(array_income);
                        }
                    }
                    if (array_expenseDto.length > 0) {
                        if (chart.series) {
                            chart.series[1].setData(array_expenseDto);
                        }
                    }
                    if (array_saving.length > 0) {
                        if (chart.series) {
                            chart.series[2].setData(array_saving);
                        }
                    }

                    if (array_income.length === 0 && array_expenseDto.length === 0 && array_saving.length === 0) {
                        chart.destroy();
                    }
                })

                if (array_year.length > 0) {
                    chart.xAxis[0].setCategories(array_year);
                }
            }
        }
    }, [props.data]);

    useEffect(() => {
        const chart = chartYearRef.current.chart;
        if (chart) {
            chart.series[0].update({type: props.type_chart});
            chart.series[1].update({type: props.type_chart});
            chart.series[2].update({type: props.type_chart});
        }
    }, [props.type_chart]);

    //------------- Update language
    useEffect(() => {
        const chart = chartYearRef.current.chart;
        if (chart) {
            chart.title.update({text: t('chart.txt_chart_income_expensive_year_by_year')});
            chart.series[0].update({name: t('income.name')});
            chart.series[1].update({name: t('expense.name')});
            chart.series[2].update({name: t('saving.name')});
        }
    }, [props.valueLanguage]);

    return (
        <div style={{width: '100%'}}>
            <br/>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                ref={chartYearRef}
                containerProps={{className: `${id_name}`, id: `${id_name}`}}
            />
        </div>
    )
};

YearsChart.propTypes = {
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
)(translate(YearsChart));