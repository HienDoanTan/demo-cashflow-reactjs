import React, {createRef, useEffect, useRef, useState} from "react";
import dayjs from 'dayjs';
import Handsontable from "handsontable";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {
    DownloadOutlined,
    LoadingOutlined,
    SearchOutlined,
    DownOutlined,
    CalendarOutlined
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
    Space,
    Input,
    Dropdown
} from "antd";
import {translate} from "react-switch-lang";
import {HotTable} from "@handsontable/react";

import {expense_history_actions, income_history_actions, saving_history_actions} from "../../actions";
import {expense_history_constants, income_history_constants, saving_history_constants} from "../../constants";
import {groupBy, numberToWords, remove_duplicates_es6} from "../../helpers/helpers";
import {colorOptions} from "../../config/colors_config.json";
import ReactDOM from "react-dom";
import UploadDefaultFileComponent from "../../helpers/upload_default_file";
import UploadFileComponent from "../../helpers/upload_file";

const {RangePicker} = DatePicker;
const {Title} = Typography;

const GroupIncomeExpenseSavingHistoryComponent = (props) => {
    const {t, type, typeColor, title} = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [data_group, set_data_group] = useState([{
        day: null,
        actions: null,
        money: null,
        attachedString: null,
        id: null,

    }]);
    const [loading, is_loading] = useState(false);
    const [isChecked, set_isChecked] = useState(false);
    const [is_has_data, set_is_has_data] = useState(false);
    let [list_checked_id, set_list_checked_id] = useState([]);
    let [count_total, set_count_total] = useState(0);
    let [count_total_text, set_count_total_text] = useState(null);
    const [firstDay, set_firstDay] = useState(dayjs().startOf('month'));
    const [lastDay, set_lastDay] = useState(dayjs().endOf('month'));
    const [data_merge_Cells, set_data_merge_Cells] = useState([]);
    const [input_text, set_input_text] = useState('');
    const [file_list_parent, set_file_list_parent] = useState([]);
    let [fileListTotal, setfileListTotal] = useState([]);
    const ref_group = useRef();

    function fnColHeaders(col) {
        switch (col) {
            case 0:
                return t('text.txt_day');
            case 1:
                return t('text.txt_Todo');
            case 2:
                return t('text.txt_Money');
            case 3:
                return t('text.txt_attach');
            case 4:
                return t('text.txt_action');
        }
    }

    const fnOnchangeCheckBoxSelectAll = (e) => {
        set_isChecked(e.target.checked);
        if (!e.target.checked) {
            set_list_checked_id([]);
        }
        let array_id = [];
        const dataObject = data_group.map(item => {
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
        set_data_group(dataObject);
    };

    const hotSetting_group = {
        ref: ref_group,
        data: data_group,
        rowHeaders: true,
        rowHeights: 34,
        height: 380,
        minRows: 10,
        minSpareRows: 0,
        maxCols: 5,
        stretchH: "all",
        manualRowResize: true,
        manualColumnResize: true,
        contextMenu: false,
        licenseKey: 'non-commercial-and-evaluation',
        mergeCells: data_merge_Cells,
        fixedRowsBottom: 0,
        comments: true,
        colWidths: [100, 200, 100, 200, 80],
        column: [
            {
                data: 'day',
                type: "date",
                dateFormat: "DD/MM/YYYY",
                correctFormat: true,
            },
            {
                data: "actions",
                type: "text",
            },
            {
                data: 'money'
            },
            {
                data: 'attachedString'
            },
            {
                data: "available",
                type: "checkbox",
                checkedTemplate: 1,
                uncheckedTemplate: 0,
            }
        ],
        cells: function (row, col, prop) {
            const cellProperties = {};
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
                        td.style.color = typeColor;
                    }
                    if (value >= 1000000) {
                        td.style.fontWeight = "bold";
                        td.style.color = typeColor;
                    }
                    cellProperties.type = "numeric";
                    cellProperties.numericFormat = {
                        pattern: "0,0 VNĐ"
                    }
                    cellProperties.readOnly = true;
                    cellProperties.className = "htRight htMiddle";
                    Handsontable.renderers.NumericRenderer.apply(this, arguments);
                };
            } else if (prop === 'attachedString') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    const childNodes = td.children;
                    const actions = instance.getDataAtRowProp(row, 'actions');
                    const attached_group = instance.getDataAtRowProp(row, 'attached_group');
                    if (actions !== null) {
                        if (!childNodes.item(0)) {
                            const dom = document.createElement('div');
                            ReactDOM.render(<UploadDefaultFileComponent {...props}
                                                                        type={type}
                                                                        attachedString={value}
                                                                        set_file_list_parent={set_file_list_parent}
                                                                        attached_group={attached_group}/>, dom);
                            td.appendChild(dom);
                        }
                    }
                    cellProperties.readOnly = true;
                    cellProperties.className = "htMiddle";
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
        afterChange: function (changes) {
            changes?.forEach(([row, prop, oldValue, newValue]) => {
                const id = ref_group.current.hotInstance.getDataAtRowProp(row, 'id');
                switch (prop) {
                    case "available":
                        if (newValue) {
                            set_list_checked_id(value => [...value, id]);
                        } else {
                            const array_value = list_checked_id.filter(function (item) {
                                return item !== id;
                            });
                            set_list_checked_id(array_value);
                        }
                        break;
                }
            })
        },
        afterInit: function () {
            if (ref_group) {
                if (ref_group.current !== null) {
                    setTimeout(() => {
                        ref_group.current.hotInstance.render();
                    }, 200);

                }
            }
        },
        afterOnCellMouseDown: function (event, coords, TD) {
            // kiểm tra nếu coords === 4 là cột checkbox
            if (coords) {
                if (coords.col === 4) {
                    if (coords.row !== -1) {
                        const id = ref_group.current.hotInstance.getDataAtRowProp(coords.row, 'id');
                        if (id > 0) {
                            const isCheck = ref_group.current.hotInstance.getDataAtCell(coords.row, coords.col);
                            ref_group.current.hotInstance.setDataAtRowProp(coords.row, 'available', !isCheck, "source");
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

            switch (type) {
                case "income":
                    await props
                        .dispatch(income_history_actions.income_history_delete(list_checked_id))
                        .then(response => {
                            if (response.type === income_history_constants.INCOME_HISTORY_DELETE_SUCCESS) {
                                messageApi.success(t('notification.notification_remove_success'));
                                set_list_checked_id([]);
                                setTimeout(() => {
                                    fn_search_group().then(r => {
                                        (async function fnc() {
                                            await props.prepare_callback();
                                        })();
                                    });
                                }, 1000);
                            } else {
                                messageApi.error(t('notification.notification_remove_failed'));
                            }
                            is_loading(false);
                        }).catch((error) => {
                            messageApi.error(error);
                        });
                    break;
                case "expense":
                    await props
                        .dispatch(expense_history_actions.fn_expense_remove_history(list_checked_id))
                        .then(response => {
                            if (response.type === expense_history_constants.EXPENSE_HISTORY_REMOVE_SUCCESS) {
                                messageApi.success(t('notification.notification_remove_success'));
                                set_list_checked_id([]);
                                setTimeout(() => {
                                    fn_search_group().then(r => {
                                        (async function fnc() {
                                            await props.prepare_callback();
                                        })();
                                    });
                                }, 1000);
                            } else {
                                messageApi.error(t('notification.notification_remove_failed'));
                            }
                            is_loading(false);
                        }).catch((error) => {
                            messageApi.error(error);
                        });
                    break;
                case "saving":
                    await props
                        .dispatch(saving_history_actions.saving_history_delete(list_checked_id))
                        .then(response => {
                            if (response.type === saving_history_constants.SAVING_HISTORY_DELETE_SUCCESS) {
                                messageApi.success(t('notification.notification_remove_success'));
                                set_list_checked_id([]);
                                setTimeout(() => {
                                    fn_search_group().then(r => {
                                        (async function fnc() {
                                            await props.prepare_callback();
                                        })();
                                    });
                                }, 1000);
                            } else {
                                messageApi.error(t('notification.notification_remove_failed'));
                            }
                            is_loading(false);
                        }).catch((error) => {
                            messageApi.error(error);
                        });
                    break;
                default:
                    break;
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            fn_search_group().then(r => {
            });
        }, 1000);

    }, []);

    useEffect(() => {
        if (props.activeKey === props.indexKey) {
            if (ref_group) {
                if (ref_group.current !== null) {
                    setTimeout(() => {
                        ref_group.current.hotInstance.render();
                    }, 200);
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

    useEffect(() => {
        //if (file_list_parent.length > 0) {
        setfileListTotal(prevArray => [...prevArray, file_list_parent]);
        //}
    }, [file_list_parent]);

    async function fn_search_group() {
        is_loading(true);
        let firstDay_ = dayjs(firstDay).format('DD/MM/YYYY');
        let lastDay_ = dayjs(lastDay).format('DD/MM/YYYY');

        if (dayjs(firstDay_, 'DD/MM/YYYY').isValid() === false) {
            firstDay_ = '';
        }

        if (dayjs(lastDay_, 'DD/MM/YYYY').isValid() === false) {
            lastDay_ = '';
        }

        let objectResult;
        if (type === "income") {
            await props.dispatch(income_history_actions.income_history_get(firstDay_, lastDay_, input_text)).then(response => {
                if (response.type === income_history_constants.INCOME_HISTORY_GET_SUCCESS) {
                    objectResult = response.data;
                } else {
                    messageApi.error(response.error);
                    setTimeout(() => {
                        is_loading(false);
                    }, 1000);
                }
            });
        } else if (type === "expense") {
            await props.dispatch(expense_history_actions.expense_get_history(firstDay_, lastDay_, input_text)).then(response => {
                if (response.type === expense_history_constants.EXPENSE_HISTORY_GET_SUCCESS) {
                    objectResult = response.data;
                } else {
                    messageApi.error(response.error);
                    setTimeout(() => {
                        is_loading(false);
                    }, 1000);
                }
            });
        } else if (type === "saving") {
            await props.dispatch(saving_history_actions.saving_history_get(firstDay_, lastDay_, input_text)).then(response => {
                if (response.type === saving_history_constants.SAVING_HISTORY_GET_SUCCESS) {
                    objectResult = response.data;
                } else {
                    messageApi.error(response.error);
                    setTimeout(() => {
                        is_loading(false);
                    }, 1000);
                }
            });
        }
        //--------------
        if (objectResult) {
            if (objectResult.length > 0) {
                objectResult.map((val, i) => {
                    val.day = dayjs(new Date(val.day)).format("DD/MM/YYYY");
                    val.money = parseInt(val.money);
                    let arr = [];
                    if (val.attached_group) {
                        if (val.attached_group.length > 0) {
                            val.attached_group.map((object, index) => {
                                object.uid = object.id;
                                object.name = object.FileName;
                                object.status = 'done';
                                object.url = object.FileName;
                                object.thumbUrl = object.FileName;
                            });
                        }
                    }
                });

                groupBy(objectResult, function (car) {
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
                    objectResult.map((val, i) => {
                        dataCallback.push({
                            day: val.day,
                            actions: val.actions,
                            money: val.money,
                            attachedString: val.attachedString,
                            available: false,
                            id: val.id,
                            notes: val.notes,
                            attached_group: val.attached_group
                        })
                    });

                    setTimeout(() => {

                        //-------- load sheet data rỗng trước, sau đó load sheet data có object
                        const objects = Handsontable.helper.createEmptySpreadsheetData(10, 5);
                        set_data_group(objects);

                        //--------
                        is_loading(false);
                        set_is_has_data(true);
                        set_data_group(dataCallback);
                        set_data_merge_Cells(array);

                        const countTotals = objectResult.reduce((n, {money}) => n + Number(money), 0);
                        if (countTotals > 0) {
                            const text_total = numberToWords(countTotals);
                            set_count_total_text(text_total);
                            set_count_total(countTotals);
                        }
                        set_list_checked_id([]);
                        set_isChecked(false);
                        messageApi.success(t('notification.notification_load_data_success'));
                    }, 1000);

                });
            } else {
                setTimeout(() => {
                    is_loading(false);
                    set_is_has_data(false);
                    set_data_group([{
                        day: null,
                        actions: null,
                        money: null,
                        attachedString: null,
                        id: null,
                        notes: null,
                        attached_group: null
                    }]);

                    set_count_total(0);
                    set_count_total_text(null);
                    messageApi.warning(t('notification.notification_data_empty'));
                }, 1000);
            }
        } else {
            setTimeout(() => {
                is_loading(false);
                set_is_has_data(false);
                set_data_group([{
                    day: null,
                    actions: null,
                    money: null,
                    attachedString: null,
                    id: null,
                    notes: null,
                    attached_group: null
                }]);

                set_count_total(0);
                set_count_total_text(null);
                messageApi.warning('ERROR LOADING');
            }, 1000);
        }
    }

    function fnSelectDatePicker(dates, dateStrings) {
        const fromDays = dateStrings[0], toDays = dateStrings[1];
        set_firstDay(fromDays);
        set_lastDay(toDays);
    }

    function fnOnChange(dates, dateStrings) {
        const fromDays = dateStrings[0], toDays = dateStrings[1];
        set_firstDay(fromDays);
        set_lastDay(toDays);
    }

    function exports_handsontable_file() {
        const hot = ref_group.current.hotInstance;
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


    function fn_input_onChange(e) {
        set_input_text(e.target.value);
    }

    return (
        <div className={props.classNameHot}>
            {contextHolder}
            <Spin size="default" tip={t("text.txt_loading")} spinning={loading}>
                <Row justify="space-around" align="middle">
                    <Col span={12} offset={3}>
                        <RangePicker style={{width: '100%'}}
                                     defaultValue={
                                         [
                                             dayjs(lastDay, 'DD/MM/YYYY'),
                                             dayjs(firstDay, 'DD/MM/YYYY')
                                         ]
                                     }
                                     onChange={fnOnChange}
                                     onCalendarChange={fnSelectDatePicker}
                                     dateRender={current => {
                                         return (
                                             <div className="ant-picker-cell-inner" style={{fontSize: 13}}>
                                                 {current.date()}
                                             </div>
                                         );
                                     }}
                        />
                    </Col>
                    <Col span={8} offset={1}>
                        <Space wrap>
                            {is_has_data && (
                                <Space wrap>
                                    <Checkbox onChange={fnOnchangeCheckBoxSelectAll}>
                                        {t('text.txt_select_all')}
                                    </Checkbox>
                                </Space>

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
                <HotTable
                    style={{zIndex: 0}}
                    ref={ref_group}
                    settings={hotSetting_group}
                    colHeaders={fnColHeaders}
                />
                <br/>
                <Row>
                    <Col span={12} push={2}>
                        <Input prefix={<SearchOutlined/>}
                               placeholder={t('input.input_search_text')}
                               allowClear
                               onChange={fn_input_onChange}
                        />
                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Space direction="vertical">
                            <Space wrap>
                                <Button
                                    type={"primary"}
                                    danger={type === 'expense'}
                                    style={{backgroundColor: type === 'income' ? colorOptions.income : ''}}
                                    loading={loading}
                                    icon={<SearchOutlined/>}
                                    onClick={fn_search_group}
                                >
                                    {t('button.btn_search')}
                                </Button>
                                <Button onClick={() => exports_handsontable_file} disabled={loading} type="default"
                                        icon={<DownloadOutlined/>} size={'middle'}>
                                    {t('button.btn_donwload')}
                                </Button>
                            </Space>
                        </Space>
                    </Col>
                </Row>
                <br/>
                <Row gutter={16} align={"center"}>
                    <Col span={12} style={{textAlign: 'center'}}>
                        <Badge.Ribbon text={title} color={typeColor}>
                            <Card headStyle={{fontWeight: '700'}} title={t('text.txt_total')} size="small">
                                <Title style={{color: typeColor}} level={2}>
                                    {`${count_total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                                <i style={{color: typeColor}}>{count_total_text}</i>
                            </Card>
                        </Badge.Ribbon>
                    </Col>
                </Row>
                <br/>
            </Spin>
        </div>
    )
}

GroupIncomeExpenseSavingHistoryComponent.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        state
    };
}

export default connect(
    mapStateToProps,
    null,
    null,
    {forwardRef: true}
)(translate(GroupIncomeExpenseSavingHistoryComponent));
