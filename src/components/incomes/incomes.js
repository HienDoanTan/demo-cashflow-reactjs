import React, {createRef, useEffect, useRef, useState} from "react";
import {Button, Row, message, Spin, Col, Space, Badge, Card, Typography} from 'antd';
import Handsontable from "handsontable";
import {isMobile} from "react-device-detect";
import Moment from "moment";
import {HotTable} from "@handsontable/react";
import PropTypes, {func} from "prop-types";
import {connect} from "react-redux";
import {translate} from "react-switch-lang";
import {incomeActions} from "../../actions";
import {incomeConstants} from "../../constants";
import {SaveFilled} from '@ant-design/icons';
import {colorOptions} from "../../config/colors_config.json";

const {Title} = Typography;

const IncomeComponent = (props) => {
    const {t} = props;
    const [dataHandsome, setDataHandsome] = useState([{day: null, actions: null, money: null, notes: null}]);
    const [loading, setLoading] = useState(false);
    const ref_income = useRef(null);
    let [count_total, set_count_total] = useState(0);

    function fnColHeaders(col) {
        switch (col) {
            case 0:
                return t('text.txt_day');
            case 1:
                return t('text.txt_Todo');
            case 2:
                return t('text.txt_Money');
            case 3:
                return t('text.txt_notes');
        }
    }

    const hotSetting = {
        ref: ref_income,
        data: dataHandsome,
        rowHeaders: true,
        rowHeights: 34,
        height: 370,
        minRows: 10,
        //maxCols: 3,
        minSpareRows: 1,
        stretchH: "all",
        manualRowResize: false,
        manualColumnResize: false,
        licenseKey: 'non-commercial-and-evaluation',
        contextMenu: true,
        fixedRowsBottom: 0,
        column: [
            {data: 'day'},
            {data: 'actions'},
            {data: 'money'},
            {data: 'notes'}
        ],
        cells: function (row, col, prop) {
            const cellProperties = {};
            if (prop === 'day') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    cellProperties.type = "date";
                    cellProperties.dateFormat = 'DD/MM/YYYY';
                    cellProperties.className = "htCenter htMiddle";
                    cellProperties.readOnly = false;
                    Handsontable.renderers.DateRenderer.apply(this, arguments);
                }
            } else if (prop === 'actions') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    cellProperties.className = 'htLeft htMiddle';
                    cellProperties.readOnly = false;
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                };
            } else if (prop === 'money') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    if (value >= 100000) {
                    }
                    if (value >= 1000000) {
                        td.style.fontWeight = "bold";
                    }
                    td.style.color = colorOptions.income;
                    cellProperties.type = "numeric";
                    cellProperties.numericFormat = {
                        pattern: "0,0 VNĐ"
                    }
                    cellProperties.readOnly = false;
                    cellProperties.className = 'htRight htMiddle';
                    Handsontable.renderers.NumericRenderer.apply(this, arguments);
                }
            } else if (prop === 'notes') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    cellProperties.className = 'htLeft';
                    cellProperties.readOnly = false;
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                };
            }
            return cellProperties;
        },
        beforeChange: (source, changes) => {
            if (source === "loadData") {
                return;
            }
            let row = source[0][0], columns = source[0][1], newValues = source[0][3];
            switch (columns) {
                case 'money':
                    if (!Number(newValues)) {
                        if (newValues !== null) {
                            return false;
                        }
                    }
                    const actions = ref_income.current.hotInstance.getDataAtRowProp(row, 'actions');
                    if (actions === null) {
                        return false;
                    }
                    break;
                case 'actions':
                    if (newValues){
                        if (newValues.length > 50) {
                            message.error('dữ liệu không được quá 50 ký tự');
                            return false;
                        }
                    }
                    break;
                case 'notes':
                    if (newValues){
                        if (newValues.length > 50) {
                            message.error('ghi chú không được quá 50 ký tự');
                            return false;
                        }
                    }
                    break;
                default:
            }
        },
        afterChange: (source, changes) => {
            fnAfterChange(changes, source)
        },
        afterInit: function () {
            if (ref_income) {
                if (ref_income.current !== null) {
                    setTimeout(() => {
                        ref_income.current.hotInstance.render();
                    }, 200);

                }
            }
        },
        afterSelectionEnd: function (r, c, r2, c2) {
            if (isMobile) {
                if (this.getActiveEditor()) {
                    this.getActiveEditor().enableFullEditMode();
                    this.getActiveEditor().beginEditing();
                }
            }
        }
    }

    function fnAfterChange(changes, source) {
        if (!source) {
            return;
        }
        source.forEach(function (change) {
            const toDay = Moment().format('DD/MM/YYYY');
            const row = change[0], col = change[1], newVal = change[3];
            const days = ref_income.current.hotInstance.getDataAtRowProp(row, 'day');
            switch (col) {
                case "actions":
                    if (newVal) {
                        if (!days) {
                            ref_income.current.hotInstance.setDataAtRowProp(row, 'day', toDay, "source");
                        }
                    } else {
                        ref_income.current.hotInstance.setDataAtRowProp(row, 'day', null, "source");
                    }
                    break;
                case 'day':
                    if (!Moment(new Date(newVal)).isValid()) {
                        return false;
                    }
                    break;
                case 'money':
                    const object_income = ref_income.current.hotInstance.getSourceData();
                    let total_money = 0;
                    if (object_income.length > 0) {
                        object_income.map((value, i) => {
                            if (Number(value.money)) {
                                total_money += parseInt(value.money);
                            }
                        });
                    }
                    set_count_total(total_money);
                    break;
                default:
            }
        });
    }

    useEffect(() => {
        console.log(ref_income, 'ref_income')
        if (ref_income) {
            if (ref_income.current !== null) {
                setTimeout(() => {
                    ref_income.current.hotInstance.render();
                }, 100);

            }
        }
    }, [props.activeKey]);

    async function fnSaveIncomes() {
        setLoading(true);
        let DataObject = [];
        dataHandsome.map((value, i) => {
            if (value.money > 0 && value.day && value.actions) {
                value.money = value.money.toString();
                DataObject.push(value);
            }
        });
        if (DataObject.length > 0) {
            return await props
                .dispatch(incomeActions.insertIncome(DataObject))
                .then(response => {
                    setLoading(false);
                    if (response.type === incomeConstants.INCOME_INSERT_FAIL) {
                        message.error(response.error);
                    } else {
                        message.success(t('notification.notification_success'));
                        const dataEmpty = [{day: null, actions: null, money: null, notes: null}]
                        setDataHandsome(dataEmpty);
                        set_count_total(0);
                    }
                    return response;
                });
        } else {
            message.error(t('notification.notification_empty'));
            setLoading(false);
            return null;
        }
    }

    async function functionPassed() {
        fnSaveIncomes().then(response => {
            if (response) {
                (async function fnc() {
                    await props.prepare_callback();
                })();
            }
        });

    }

    return (
        <div className={props.classNameHot}>
            <Spin size="default" tip={"Running"} spinning={loading} delay={500}>
                <HotTable colHeaders={fnColHeaders} style={{zIndex: 0}} ref={ref_income} settings={hotSetting}/>
            </Spin>
            <br/>
            <Row>
                <Col span={12} style={{textAlign: 'center'}}>
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{
                            width: '100%',
                        }}
                    >
                        <Badge.Ribbon text={t('income.name')} color={colorOptions.income}>
                            <Card headStyle={{fontWeight: '700'}} title={t('text.txt_total')} size="small">
                                <Title style={{color: colorOptions.income}} level={2}>
                                    {`${count_total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                            </Card>
                        </Badge.Ribbon>
                    </Space>
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    <Space direction="vertical">
                        <Space wrap>
                            <Button type="primary"
                                    style={{backgroundColor: 'rgb(11, 130, 53)', border: 'none'}}
                                    loading={loading}
                                    icon={<SaveFilled/>}
                                    onClick={() => functionPassed()}>
                                {t('button.btn_Save')}
                            </Button>
                        </Space>
                    </Space>
                </Col>
            </Row>

        </div>
    )
}


IncomeComponent.propTypes = {
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
)(translate(IncomeComponent));

