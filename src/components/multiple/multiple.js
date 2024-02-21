import {Image, Table, Space, Tag, Dropdown, Menu, Button} from 'antd';
import React, {useEffect, useState} from "react";
import {groupBy} from "../../helpers/helpers";
import PropTypes, {bool} from "prop-types";
import {connect} from "react-redux";
import {translate} from "react-switch-lang";
import {DownOutlined, UserOutlined} from '@ant-design/icons';
import {colorOptions} from "../../config/colors_config.json";

function MultipleComponent(props) {
    const {t} = props;
    const [dataObject, set_dataObject] = useState([]);
    const [loading, isLoading] = useState(true);
    let numberAttr = 3;

    const sharedOnCell = (_, index) => {
        const indexValue = index + 1;
        if (indexValue % 5 === 0) {
            return {
                colSpan: 0,
            };
        }
        return {};
    }

    const YearOnCell = (_, index) => {
        const indexValue = index + 1;
        const number = 5;
        let isAfter = false;
        if (indexValue === 1 || ((indexValue - 1) % number === 0)) {
            isAfter = true;
            return {
                rowSpan: 4,
            };
        }
        if (indexValue % number === 0) {
            isAfter = true;
            return {
                colSpan: 15,
            }
        }

        if (!isAfter) {
            return {
                rowSpan: 0,
            };

        }

        return {};
    }

    const renderContent = (value, row, index) => {
        const indexValue = index + 1;
        const money = value === null ? 0 : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let colorMoney;
        if ((index + 2) % 5 === 0) {
            if (parseInt(money) > 0) {
                colorMoney = <Tag color="rgb(11, 130, 53)">{money}</Tag>;
            } else if (parseInt(money) < 0) {
                colorMoney = <Tag color="#f81d22">{money}</Tag>;
            } else {
                colorMoney = money;
            }
            numberAttr = index;

        } else {
            colorMoney = money;
        }

        const obj = {
            children: colorMoney,
            props: {
                style: {color: row.color},
            },
        };
        return obj;
    };

    const columns = [
        {
            title: t('chart.year'),
            //responsive: ['md'],
            dataIndex: 'year',
            align: 'center',
            width: 100,
            fixed: 'left',
            sorter: (a, b) => a.year - b.year,
            render: (value, row, index) => {
                const indexValue = index + 1;
                const number = 5;
                let isAfter = false;
                const obj = {
                    children: <Tag color={"geekblue"} key={value}>
                        {value}
                    </Tag>,
                    props: {
                        style: {},
                    },
                };

                if (indexValue === 1 || ((indexValue - 1) % number === 0)) {
                    isAfter = true;
                }

                if (indexValue % number === 0) {
                    obj.children = null;
                    obj.props.style.height = 46;
                    isAfter = true;
                }

                return obj;

            },
            onCell: YearOnCell
        },
        {
            title: t('text.txt_type'),
            //responsive: ['md'],
            width: 100,
            fixed: 'left',
            dataIndex: 'type',
            align: 'center',
            render: (value, row, index) => {
                let val = null;
                switch (row.type) {
                    case "income":
                        val = (<Space direction="horizontal">
                            {t("income.name")}
                        </Space>);
                        break;
                    case "expense":
                        val = (<Space direction="horizontal">
                            {t("expense.name")}
                        </Space>);
                        break;
                    case "saving":
                        val = (<Space direction="horizontal">
                            {t("saving.name")}
                        </Space>);
                        break;
                    case "after":
                        val = <Tag color={row.color}>{t("text.txt_remaining")}</Tag>;
                        break;
                    default:
                        break;
                }
                const obj = {
                    children: val,
                    props: {
                        style: {background: row.backgroundColor, color: row.color},
                    }
                }
                const indexValue = index + 1;
                if (indexValue % 5 === 0) {
                    obj.children = null;
                }
                return obj;
            },

            onCell: sharedOnCell
        },
        {
            title: t('month.January'),
            //responsive: ['md'],
            dataIndex: 'month_1',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.February'),
            //responsive: ['md'],
            dataIndex: 'month_2',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.March'),
            //responsive: ['md'],
            dataIndex: 'month_3',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.April'),
            // responsive: ['md'],
            dataIndex: 'month_4',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.May_'),
            //responsive: ['lg'],
            dataIndex: 'month_5',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.June'),
            //responsive: ['md'],
            dataIndex: 'month_6',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.July'),
            //responsive: ['md'],
            dataIndex: 'month_7',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.August'),
            //responsive: ['md'],
            dataIndex: 'month_8',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.September'),
            //responsive: ['md'],
            dataIndex: 'month_9',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.October'),
            //responsive: ['lg'],
            dataIndex: 'month_10',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.November'),
            //responsive: ['md'],
            dataIndex: 'month_11',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell
        },
        {
            title: t('month.December'),
            //responsive: ['md'],
            dataIndex: 'month_12',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell,
            width: 120
        },
        {
            title: t('home.total'),
            //responsive: ['md'],
            dataIndex: 'total',
            render: renderContent,
            align: 'center',
            onCell: sharedOnCell,
            fixed: 'right',
            width: 150,
        },
    ];

    function fn_render_data_multi(dataIncome, dataExpense, dataSaving, listYear) {
        let myArr = [];
        listYear.map((data_value, index) => {
            let i,
                arrayIncome = {total: 0, color: ''},
                arrayExpense = {total: 0, color: ''},
                arraySaving = {total: 0, color: ''},
                arrayCountMoney = {total: 0};

            arrayCountMoney.year = data_value.year;
            arrayIncome.year = data_value.year;
            arrayExpense.year = data_value.year;
            arraySaving.year = data_value.year;

            for (i = 1; i <= 12; i++) {
                let countMoney = 0;
                // --- check data income
                if (dataIncome) {
                    let val;
                    dataIncome.map((data, index) => {
                        if (data.period === i && data_value.year === data.year) {
                            val = parseInt(data.totalMoney);
                        }
                    });

                    if (val) {
                        arrayIncome['month_' + i] = val;
                        arrayIncome.total += val;
                        countMoney += val;
                    } else {
                        arrayIncome['month_' + i] = 0;
                    }

                    arrayIncome.type = "income";
                    arrayIncome.color = colorOptions.income;
                }

                if (dataExpense) {
                    let val;
                    dataExpense.map((data, index) => {
                        if (data.period === i && data_value.year === data.year) {
                            val = parseInt(data.totalMoney);
                        }
                    });

                    if (val) {
                        arrayExpense['month_' + i] = val;
                        arrayExpense.total += val;
                        countMoney -= val;

                    } else {
                        arrayExpense['month_' + i] = 0;
                    }

                    arrayExpense.type = "expense";
                    arrayExpense.color = colorOptions.expense;
                }

                if (dataSaving) {
                    let val;
                    dataSaving.map((data, index) => {
                        if (data.period === i && data_value.year === data.year) {
                            val = parseInt(data.totalMoney);
                        }
                    });

                    if (val) {
                        arraySaving['month_' + i] = val;
                        arraySaving.total += val;
                        countMoney -= val;
                    } else {
                        arraySaving['month_' + i] = 0;
                    }

                    arraySaving.type = "saving";
                    arraySaving.color = colorOptions.saving;
                }

                arrayCountMoney.type = "after";
                arrayCountMoney['month_' + i] = countMoney;
                arrayCountMoney.total += countMoney;
            }

            myArr.push(arrayIncome)
            myArr.push(arrayExpense)
            myArr.push(arraySaving)
            myArr.push(arrayCountMoney)

            let pushtu = {
                year: data_value.year,
                type: null,
                month_1: null,
                month_2: null,
                month_3: null,
                month_4: null,
                month_5: null,
                month_6: null,
                month_7: null,
                month_8: null,
                month_9: null,
                month_10: null,
                month_11: null,
                month_12: null,
                total: null,
                color: null,
                backgroundColor: null
            }
            myArr.push(pushtu);
        });

        let ii = 0, array = [], numIndex = 0;
        groupBy(myArr, function (car) {
            return car.year;
        }).then(() => {
            let xObject = [];
            myArr = myArr.sort((a, b) => {
                return b.year - a.year;
            });
            myArr.map((value, i) => {
                xObject.push({
                    key: i,
                    year: value.year,
                    type: value.type,
                    month_1: value.month_1,
                    month_2: value.month_2,
                    month_3: value.month_3,
                    month_4: value.month_4,
                    month_5: value.month_5,
                    month_6: value.month_6,
                    month_7: value.month_7,
                    month_8: value.month_8,
                    month_9: value.month_9,
                    month_10: value.month_10,
                    month_11: value.month_11,
                    month_12: value.month_12,
                    total: value.total,
                    color: value.color,
                    backgroundColor: value.backgroundColor
                })
            })
            isLoading(false);
            set_dataObject(xObject);

        });
    }

    useEffect(() => {
        if (props.data_all_year.data) {
            fn_render_data_multi(
                props.data_all_year.data.incomeDto,
                props.data_all_year.data.expenseDto,
                props.data_all_year.data.savingDto,
                props.data_all_year.data.listYear
            );
        }
    }, [props.data_all_year]);


    return (
        <div>
            <Table
                size={"middle"}
                columns={columns}
                loading={loading}
                dataSource={dataObject}
                 pagination={{
                //     total: dataObject.length,
                //     pageSize: defaultPageSize
                     size: 'default'
                 }}
                scroll={{
                    x: window.innerWidth
                }}
                bordered={true}
            />
        </div>

    )
}

MultipleComponent.propTypes = {
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
)(translate(MultipleComponent));
