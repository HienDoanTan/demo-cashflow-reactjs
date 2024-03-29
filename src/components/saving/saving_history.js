import React, {createRef, useEffect, useRef, useState} from "react";
import moment from 'moment';
import Handsontable from "handsontable";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {
    DownloadOutlined,
    LoadingOutlined,
    SearchOutlined
} from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Card,
    Typography,
    Col,
    Row,
    Badge,
    Spin,
    Popconfirm,
    message,
    DatePicker,
    Space, Input
} from "antd";
import {translate} from "react-switch-lang";
import {HotTable} from "@handsontable/react";

import {saving_history_actions} from "../../actions";
import {saving_history_constants} from "../../constants";
import {groupBy, remove_duplicates_es6} from "../../helpers/helpers";
import {colorOptions} from "../../config/colors_config.json";

const {RangePicker} = DatePicker;
const {Title} = Typography;
const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

const SavingHistoryComponent = (props) => {
    const {t} = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [data_saving_history, set_data_saving_history] = useState([{
        day: null,
        actions: null,
        money: null,
        id: null
    }]);
    const [loading, is_loading] = useState(false);
    const [isChecked, set_isChecked] = useState(false);
    const [is_has_data, set_is_has_data] = useState(false);
    let [list_checked_id, set_list_checked_id] = useState([]);
    const [count_total, set_count_total] = useState(0);
    const [firstDay, set_firstDay] = useState(moment().startOf("month"));
    const [lastDay, set_lastDay] = useState(moment().endOf("month"));
    const [data_merge_Cells, set_data_merge_Cells] = useState([]);
    const ref_saving_history = useRef();
    const [input_text, set_input_text] = useState('');

    function fnColHeaders(col) {
        switch (col) {
            case 0:
                return t('text.txt_day');
            case 1:
                return t('text.txt_Todo');
            case 2:
                return t('text.txt_Money');
            case 3:
                return t('text.txt_action');
        }
    }

    const fnOnchangeCheckBoxSelectAll = (e) => {
        set_isChecked(e.target.checked);
        if (!e.target.checked) {
            set_list_checked_id([]);
        }
        let array_id = [];
        const dataObject = data_saving_history.map(item => {
                if (item) {
                    if (item.id !== null) {
                        if (e.target.checked) {
                            array_id.push(item.id);
                        }
                        return {
                            ...item, available: e.target.checked
                        };
                    }
                }
            }
        );
        const arrValue = remove_duplicates_es6(array_id);
        set_list_checked_id(arrValue);
        set_data_saving_history(dataObject);
    };

    const hotSetting_saving_history = {
        ref: ref_saving_history,
        data: data_saving_history,
        rowHeaders: true,
        rowHeights: 34,
        height: 370,
        minRows: 10,
        minSpareRows: 0,
        maxCols: 4,
        stretchH: "all",
        manualRowResize: false,
        manualColumnResize: true,
        contextMenu: false,
        licenseKey: 'non-commercial-and-evaluation',
        mergeCells: data_merge_Cells,
        fixedRowsBottom: 0,
        comments: true,
        column: [
            {
                data: 'day',
                type: "date",
                dateFormat: "DD/MM/YYYY",
                correctFormat: true,
            },
            {
                data: "actions",
                type: "text"
            },
            {
                data: 'money'
            },
            {
                data: "available",
                type: "checkbox",
                checkedTemplate: 1,
                uncheckedTemplate: 0
            }
        ],
        cells: function (row, col, prop) {
            const cellProperties = {};
            const totalRows = this.instance.countRows();

            if (prop === 'day') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    cellProperties.type = "date";
                    cellProperties.dateFormat = 'DD/MM/YYYY';
                    cellProperties.readOnly = true;
                    cellProperties.className = "htCenter htMiddle";
                    Handsontable.renderers.DateRenderer.apply(this, arguments);
                }
            } else if (prop === 'actions') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    const notes = instance.getDataAtRowProp(row, 'notes');
                    if (notes !== null) {
                        cellProperties.comment = {value: notes, readOnly: true};
                    }
                    cellProperties.readOnly = true;
                    cellProperties.className = "htMiddle";
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                };
            } else if (prop === 'money') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    if (value > 100000) {
                        td.style.color = colorOptions.saving;
                    }
                    if (value >= 1000000) {
                        td.style.fontWeight = "bold";
                        td.style.color = colorOptions.saving;
                    }
                    cellProperties.type = "numeric";
                    cellProperties.numericFormat = {
                        pattern: "0,0 VNĐ"
                    }
                    cellProperties.readOnly = true;
                    cellProperties.className = "htRight htMiddle";
                    Handsontable.renderers.NumericRenderer.apply(this, arguments);
                };
            } else if (prop === 'available') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    td.style.textAlign = 'center';
                    cellProperties.className = "htCenter htMiddle";
                    cellProperties.readOnly = true;
                    const id = instance.getDataAtRowProp(row, 'id');
                    if (id !== null) {
                        Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
                    } else {
                        Handsontable.renderers.TextRenderer.apply(this, arguments);
                    }
                };
            }

            return cellProperties;
        },
        afterChange: function (change, source) {
            if (source !== 'loadData' && source !== 'afterChange') {
                change.forEach(function (changes) {
                    const row = changes[0], col = changes[1], newVal = changes[3];
                    const id = ref_saving_history.current.hotInstance.getDataAtRowProp(row, 'id');
                    if (col === "available") {
                        if (newVal) {
                            set_list_checked_id(value => [...value, id]);
                        } else {
                            const array_value = list_checked_id.filter(function (item) {
                                return item !== id;
                            });
                            set_list_checked_id(array_value);
                        }
                    }
                })

            }
        },
        afterInit: function () {
            // if (ref_saving_history) {
            //     if (ref_saving_history.current !== null) {
            //         setTimeout(() => {
            //             ref_saving_history.current.hotInstance.render();
            //         }, 200);
            //
            //     }
            // }
        },
        afterOnCellMouseDown: function (event, coords, TD) {
            // kiểm tra nếu coords === 3 là cột checkbox
            if (coords) {
                if (coords.col === 3) {
                    if (coords.row !== -1) {
                        const id = ref_saving_history.current.hotInstance.getDataAtRowProp(coords.row, 'id');
                        if (id > 0) {
                            const isCheck = ref_saving_history.current.hotInstance.getDataAtCell(coords.row, coords.col);
                            ref_saving_history.current.hotInstance.setDataAtRowProp(coords.row, 'available', !isCheck, "source");
                        }
                    }
                }
            }
        },
        afterSelection: function (row, column, row2, column2, preventScrolling, selectionLayerLevel) {

        }
    }

    function cancel() {

    }

    async function confirm() {
        // kiểm tra list id có dữ liệu không, nếu có thì thực hiện xóa
        if (list_checked_id.length > 0) {
            is_loading(true);
            await props
                .dispatch(saving_history_actions.saving_history_delete(list_checked_id))
                .then(response => {
                    if (response.type === saving_history_constants.SAVING_HISTORY_DELETE_SUCCESS) {
                        messageApi.success(t('notification.notification_remove_success'));
                        set_list_checked_id([]);
                        setTimeout(() => {
                            fn_search_saving_history().then(r => {
                                (async function fnc() {
                                    await props.prepare_callback();
                                })();
                            });
                        }, 1000);
                    } else {
                        messageApi.error(t('notification.notification_remove_failed'));
                    }
                    is_loading(false);
                });
        }
    }

    useEffect(() => {
        setTimeout(() => {
            fn_search_saving_history(firstDay, lastDay).then(r => {
            });
        }, 1000);

    }, []);

    useEffect(() => {
        if (props.activeKey === 6) {
            if (ref_saving_history) {
                if (ref_saving_history.current !== null) {
                    setTimeout(() => {
                        ref_saving_history.current.hotInstance.render();
                    }, 100);

                }
            }
        }
    }, [props.activeKey]);


    useEffect(() => {
        // Kiểm tra nếu có check từ 1 dòng trở lên thì hiển thị nút xóa

        if (list_checked_id.length > 0) {
            set_isChecked(true);
        } else {
            // Ngược lại thì ẩn nút xóa
            set_isChecked(false);
        }
    }, [list_checked_id]);

    async function fn_search_saving_history() {
        is_loading(true);
        let firstDay_ = moment(firstDay);
        let lastDay_ = moment(lastDay);

        if (firstDay_._isValid) {
            firstDay_ = firstDay_.format("DD-MM-YYYY");
        } else {
            firstDay_ = '';
        }

        if (lastDay_._isValid) {
            lastDay_ = lastDay_.format("DD-MM-YYYY");
        } else {
            lastDay_ = '';
        }
        await props.dispatch(saving_history_actions.saving_history_get(firstDay_, lastDay_, input_text)).then(response => {
            if (response.type === saving_history_constants.SAVING_HISTORY_GET_SUCCESS) {
                if (response.data.length > 0) {
                    response.data.map((val, i) => {
                        val.day = moment(new Date(val.day)).format("DD/MM/YYYY");
                        val.money = parseInt(val.money);
                    });

                    groupBy(response.data, function (car) {
                        return car.day;
                    }).then((data, a) => {
                        let ii = 0, array = [], numIndex = 0;
                        Object.keys(data).map(key => {
                                const value = data[key];
                                if (value.length > 1) {
                                    array.push({
                                        row: ii === 0 ? ii : numIndex,
                                        col: 0,
                                        rowspan: value.length,
                                        colspan: 1
                                    });
                                }

                                numIndex += value.length;
                                ii++;
                            }
                        )

                        const dataCallback = [];
                        response.data.map((val, i) => {
                            dataCallback.push({
                                day: val.day,
                                actions: val.actions,
                                money: val.money,
                                available: false,
                                id: val.id,
                                notes: val.notes,
                            })
                        });

                        setTimeout(() => {
                            is_loading(false);
                            set_is_has_data(true);
                            set_data_saving_history(dataCallback);
                            set_data_merge_Cells(array);

                            const countTotals = response.data.reduce((n, {money}) => n + Number(money), 0);
                            if (countTotals > 0) {
                                set_count_total(countTotals);
                            }

                            messageApi.success(t('notification.notification_load_data_success'));
                        }, 1000);

                    });
                } else {
                    setTimeout(() => {
                        is_loading(false);

                        set_is_has_data(false);
                        set_data_saving_history([{
                            day: null,
                            actions: null,
                            money: null,
                            id: null,
                            notes: null,
                        }]);

                        set_count_total(0);
                        messageApi.warning(t('notification.notification_data_empty'));
                    }, 1000);
                }
            } else {
                messageApi.error(response.error);
                setTimeout(() => {
                    is_loading(false);
                }, 1000);
            }
        });
    }

    function fnSelectDatePicker(dates, dateStrings) {
        const fromDays = dateStrings[0], toDays = dateStrings[1];
        set_firstDay(fromDays);
        set_lastDay(toDays);
        // fn_search_saving_history(fromDays, toDays).then(r => {
        // });
    }

    function fnOnChange(dates, dateStrings) {
        const fromDays = dateStrings[0], toDays = dateStrings[1];
        set_firstDay(fromDays);
        set_lastDay(toDays);
    }

    function exports_saving() {
        if(ref_saving_history){
            if(ref_saving_history.current){
                const hot = ref_saving_history.current.hotInstance;
                const exportPlugin = hot.getPlugin('exportFile');
                exportPlugin.downloadFile('csv', {
                    bom: true,
                    columnDelimiter: ',',
                    columnHeaders: true,
                    exportHiddenColumns: true,
                    exportHiddenRows: true,
                    fileExtension: 'csv',
                    filename: 'Handsontable-CSV-file_[YYYY]-[MM]-[DD]',
                    mimeType: 'text/csv;charset=utf-8',
                    rowDelimiter: '\r\n',
                    rowHeaders: true
                });
            }
        }
    }

    function fn_input_onChange(e) {
        set_input_text(e.target.value);
    }


    return (
        <div className={props.classNameHot}>
            <Spin size="default" tip={t('text.txt_loading')} indicator={antIcon} spinning={loading}>
                <Row justify="space-around" align="middle">
                    <Col span={12} offset={3}>
                        <RangePicker />
                        {/*<RangePicker style={{width: '100%'}}*/}
                        {/*             defaultValue={*/}
                        {/*                 [*/}
                        {/*                     moment(lastDay, 'DD-MM-YYYY'),*/}
                        {/*                     moment(firstDay, 'DD-MM-YYYY')*/}
                        {/*                 ]*/}
                        {/*             }*/}
                        {/*             // onChange={fnOnChange}*/}
                        {/*             // onCalendarChange={fnSelectDatePicker}*/}
                        {/*             dateRender={current => {*/}
                        {/*                 return (*/}
                        {/*                     <div className="ant-picker-cell-inner" style={{fontSize: 13}}>*/}
                        {/*                         /!*{current.date()}*!/*/}
                        {/*                     </div>*/}
                        {/*                 );*/}
                        {/*             }}*/}
                        {/*/>*/}
                    </Col>
                    <Col span={8} offset={1}>
                        <Space wrap>
                            {is_has_data && (
                                <Checkbox onChange={fnOnchangeCheckBoxSelectAll}>
                                    {t('text.txt_select_all')}
                                </Checkbox>
                            )}
                            {isChecked && (
                                <Popconfirm
                                    title={t('button.btn_remove_title')}
                                    onConfirm={confirm}
                                    onCancel={cancel}
                                    okText={t('button.btn_yes_txt')}
                                    cancelText={t('button.btn_no_txt')}
                                >
                                    <Button type="primary" danger> {t('button.btn_remove_text')} </Button>
                                </Popconfirm>
                            )}
                        </Space>

                    </Col>
                </Row>
                <br/>
                <HotTable style={{zIndex: 0}}
                          ref={ref_saving_history}
                          settings={hotSetting_saving_history}
                          colHeaders={fnColHeaders}
                />
                <br/>
                <Row>
                    <Col span={12} push={2}>
                        <Input placeholder={t('input.input_search_text')} allowClear onChange={fn_input_onChange}/>
                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Space direction="vertical">
                            <Space wrap>
                                <Button type="primary"
                                        style={{backgroundColor: colorOptions.saving}}
                                        loading={loading}
                                        icon={<SearchOutlined/>}
                                        onClick={fn_search_saving_history}>
                                    {t('button.btn_search')}
                                </Button>
                                <Button onClick={exports_saving} disabled={loading} type="default"
                                        icon={<DownloadOutlined/>} size={'middle'}>
                                    Tải xuống
                                </Button>
                            </Space>
                        </Space>
                    </Col>
                </Row>
                <br/>
                <Row gutter={16} align={"center"}>
                    <Col span={12} style={{textAlign: 'center'}}>
                        <Badge.Ribbon text={t('saving.name')} color={colorOptions.saving}>
                            <Card headStyle={{fontWeight: '700'}} title={t('text.txt_total')} size="small">
                                <Title style={{color: colorOptions.saving}} level={2}>
                                    {`${count_total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                            </Card>
                        </Badge.Ribbon>
                    </Col>
                </Row>
                <br/>
            </Spin>
        </div>
    )
}

SavingHistoryComponent.propTypes = {
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
)(translate(SavingHistoryComponent));
