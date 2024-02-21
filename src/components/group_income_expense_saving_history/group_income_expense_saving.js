import React, {createRef, useEffect, useRef, useState} from "react";
import {Button, Row, Spin, message, Upload, Skeleton, Col, Badge, Card, Space, Typography} from "antd";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {connect} from "react-redux";
import {translate} from 'react-switch-lang';
import {HotTable} from '@handsontable/react';
import Handsontable from 'handsontable';
import {isMobile} from 'react-device-detect';
import Moment from 'moment';
import {expense_actions, incomeActions, saving_actions, upload_files_actions} from "../../actions";
import {expenseConstants, incomeConstants, saving_constants, upload_files_constants} from "../../constants";
import {LoadingOutlined, SaveFilled, UploadOutlined} from '@ant-design/icons';
import {colorOptions} from "../../config/colors_config.json";
import UploadFileComponent from "../../helpers/upload_file";
import {randomString} from "../../helpers/helpers";

const {Title} = Typography;
const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

const GroupIncomeExpenseSavingComponent = (props) => {
    const {t, typeColor, type, title, activeKey} = props;
    const [messageApi, contextHolder] = message.useMessage();

    const [dataHandsome, setDataHandsome] = useState([{
        day: null,
        actions: null,
        money: null,
        notes: null,
        attachedString: null,
    }]);

    const [loading, setLoading] = useState(false);
    let [count_total, set_count_total] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [file_list_parent, set_file_list_parent] = useState([]);
    let [fileListTotal, setfileListTotal] = useState([]);
    let numer_string_strength = 20;
    const ref_type = useRef();

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
            case 4:
                return t('text.txt_attach');
        }
    }

    const hotSetting = {
        ref: ref_type,
        data: dataHandsome,
        rowHeaders: true,
        rowHeights: 34,
        height: 380,
        minRows: 10,
        //maxCols: 3,
        minSpareRows: 1,
        stretchH: "all",
        manualRowResize: true,
        manualColumnResize: true,
        licenseKey: 'non-commercial-and-evaluation',
        contextMenu: false,
        fixedRowsBottom: 0,
        colWidths: [100, 200, 100, 200, 100],
        column: [
            {data: 'day'},
            {data: 'actions'},
            {data: 'money'},
            {data: 'notes'},
            {data: 'attachedString'}
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
                    cellProperties.readOnly = false;
                    cellProperties.className = 'htRight htMiddle';
                    Handsontable.renderers.NumericRenderer.apply(this, arguments);
                }
            } else if (prop === 'notes') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    cellProperties.className = 'htLeft htMiddle';
                    cellProperties.readOnly = false;
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                }
            } else if (prop === 'attachedString') {
                cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                    cellProperties.className = 'htCenter';
                    cellProperties.readOnly = true;
                    Handsontable.renderers.BaseRenderer.apply(this, arguments);
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
                    const actions = ref_type.current.hotInstance.getDataAtRowProp(row, 'actions');
                    if (actions === null) {
                        return false;
                    }
                    break;
                case 'actions':
                    if (newValues) {
                        if (newValues.length > 200) {
                            messageApi.error('dữ liệu không được quá 200 ký tự');
                            return false;
                        }
                    }
                    break;
                case 'notes':
                    if (newValues) {
                        if (newValues.length > 200) {
                            messageApi.error('ghi chú không được quá 200 ký tự');
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
        afterInit: function (a, b, c) {
            if (ref_type) {
                if (ref_type.current !== null) {
                    setTimeout(() => {
                        ref_type.current.hotInstance.render();
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
        },
        beforeKeyDown: (event) => {

        },
        afterLoadData: function (data, b, c) {

        }
    }

    function fnAfterChange(changes, source) {
        if (!source) {
            return;
        }
        source.forEach(function (change) {
            const toDay = Moment().format('DD/MM/YYYY');
            const row = change[0], col = change[1], newVal = change[3];
            const days = ref_type.current.hotInstance.getDataAtRowProp(row, 'day');
            switch (col) {
                case "actions":
                    if (newVal) {
                        console.log(days, 'days')
                        //if (!days) {
                            ref_type.current.hotInstance.setDataAtRowProp(row, 'day', toDay, "source");

                            //--- Add button
                            const cell = ref_type.current.hotInstance.getCell(row, 4); // col 4 là col attachedString
                            const random_string = randomString(numer_string_strength);

                            ref_type.current.hotInstance.setDataAtRowProp(row, 'attachedString', random_string, "source");

                            const dom = document.createElement('div');
                            ReactDOM.render(<UploadFileComponent {...props}
                                                                 random_string={random_string}
                                                                 row={row}
                                                                 type={'expense'}
                                                                 set_file_list_parent={set_file_list_parent}
                            />, cell);
                        //}
                    } else {
                        ref_type.current.hotInstance.setDataAtRowProp(row, 'day', null, "source");
                        //--- Xóa button
                        const cell = ref_type.current.hotInstance.getCell(row, 4);
                        cell.remove();
                    }
                    break;
                case 'day':
                    if (!Moment(new Date(newVal)).isValid()) {
                        return false;
                    }
                    break;
                case 'money':
                    const object_expense = ref_type.current.hotInstance.getSourceData();
                    let total_money = 0;
                    if (object_expense.length > 0) {
                        object_expense.map((value, i) => {
                            if (Number(value.money)) {
                                total_money += parseInt(value.money);
                            }
                        });
                    }
                    set_count_total(total_money);
                    break;
            }
        });
    }

    useEffect(() => {
        if (ref_type) {
            if (ref_type.current !== null) {
                setTimeout(() => {
                    ref_type.current.hotInstance.render();
                }, 0);

            }
        }
    }, [props.activeKey]);

    useEffect(() => {
        //if (file_list_parent.length > 0) {
        setfileListTotal(prevArray => [...prevArray, file_list_parent]);
        //}
    }, [file_list_parent]);

    async function fn_save_expense() {
        let DataObject = [], isReturn = false;
        dataHandsome.map((value, i) => {
            if (value.money > 0 && value.day && value.actions) {
                DataObject.push({
                    day: value.day,
                    actions: value.actions,
                    money: value.money,
                    notes: value.notes,
                    attachedString: value.attachedString,
                });
            }
        });

        if (DataObject.length > 0) {

            //--- Gọi hàm upload file
            await handleUpload().then((successCallback) => {
                if (successCallback) {
                    setLoading(true);

                    //---- Switch api theo type
                    if (type === "income") {
                        return props.dispatch(incomeActions.insertIncome(DataObject))
                            .then(response => {
                                setLoading(false);
                                if (response.type === incomeConstants.INCOME_INSERT_SUCCESS) {
                                    isReturn = true;
                                } else {
                                    messageApi.error(response.error);
                                    isReturn = false;
                                }
                            });
                    } else if (type === "expense") {
                        return props.dispatch(expense_actions.expense_insert(DataObject))
                            .then(response => {
                                setLoading(false);
                                if (response.type === expenseConstants.EXPENSE_INSERT_SUCCESS) {
                                    isReturn = true;
                                } else {
                                    messageApi.error(response.error);
                                    isReturn = false;
                                }
                            });
                    } else if (type === "saving") {
                        return props.dispatch(saving_actions.saving_insert(DataObject))
                            .then(response => {
                                setLoading(false);
                                if (response.type === saving_constants.SAVING_INSERT_SUCCESS) {
                                    isReturn = true;
                                } else {
                                    messageApi.error(response.error);
                                    isReturn = false;
                                }
                            });
                    }

                }
            }).catch((exception) => {
                messageApi.error(exception);
                setUploading(false);
                isReturn = false;
            });

        } else {
            messageApi.error(t('notification.notification_empty'));
            setLoading(false);
            isReturn = false;
        }

        if (isReturn) { // neu luu thanh cong

            messageApi.success(t('notification.notification_success'));
            const dataEmpty = [{
                day: null,
                actions: null,
                money: null,
                notes: null,
                attachedString: null
            }]
            set_count_total(0);

            //--- Load EmptySpread để xóa button
            const objects = Handsontable.helper.createEmptySpreadsheetData(10, 5);
            setDataHandsome(objects);

            //--- Sau đó load empty data rỗng
            setDataHandsome(dataEmpty);
        } else {
            messageApi.success('Something wrong!!!');
        }
        return isReturn;
    }

    async function functionPassed() {
        fn_save_expense().then(response => {
            if (response) {
                (async function fnc() {
                    await props.prepare_callback();
                })();
            }
        });

    }

    //----------- function upload file

    async function handleUpload() {
        const formData = new FormData();
        let arrUniq;
        if (fileListTotal.length > 0) {
            const uniqueArr = [];
            fileListTotal.map((values, index) => {
                if (values.hasFile) {
                    for (const [key, value] of Object.entries(values)) {
                        if (value.uid) {
                            uniqueArr.push({
                                file: value,
                                attachedString: values.attachedString
                            });
                        }
                    }
                }
            });

            arrUniq = [...new Map(uniqueArr.map(v => [JSON.stringify(v), v])).values()];

            if (arrUniq.length > 0) {

                arrUniq.forEach((data) => {
                    if (data.file.status !== "removed") {
                        formData.append("attachedString", data.attachedString);
                        formData.append('files', data.file);
                    }
                });

                // You can use any AJAX library you like
                return await props.dispatch(upload_files_actions.fn_upload_files(formData))
                    .then((res) => {
                        return res;
                    })
                    .then((res) => {
                        if (res.type === upload_files_constants.UPLOAD_FILES_SUCCESS) {
                            if (res.data) {
                                if (!res.data.status) {
                                    messageApi.error(res.data.message);
                                    return false;
                                } else {
                                    messageApi.success('upload file successfully.');
                                }
                                setfileListTotal([]);
                                setUploading(false);
                                return true;
                            }
                        } else if (res.type === upload_files_constants.UPLOAD_FILES_FAIL) {
                            messageApi.error(res.error);
                            return false;
                        }
                    })
                    .catch((exception) => {
                        messageApi.error('upload file failed.' + exception);
                        setUploading(false);
                        return false;
                    })
                    .finally(() => {
                        setUploading(false);
                        return true;
                    });
            } else {
                return true;
            }

        } else {
            return true;
        }
    }

    //-----------

    return (
        <div className={props.classNameHot}>
            {contextHolder}
            <Spin size="default" tip={"Running"} spinning={loading} indicator={antIcon} delay={500}>
                <HotTable colHeaders={fnColHeaders} style={{zIndex: 0}} ref={ref_type}
                          settings={hotSetting}/>
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
                        <Badge.Ribbon text={title} color={typeColor}>
                            <Card headStyle={{fontWeight: '700'}} title={t('text.txt_total')}
                                  size="small">
                                <Title style={{color: typeColor}} level={2}>
                                    {`${count_total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                            </Card>
                        </Badge.Ribbon>
                    </Space>
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    <Space direction="vertical">
                        <Space wrap>
                            <Button type={"primary"}
                                    danger={type === 'expense'}
                                    style={{backgroundColor: type === 'income' ? colorOptions.income : ''}}
                                    icon={<SaveFilled/>}
                                    loading={loading}
                                    onClick={() => functionPassed()}
                            >
                                {t('button.btn_Save')}
                            </Button>
                        </Space>
                    </Space>
                </Col>
            </Row>
            <br/>
        </div>
    )
}


GroupIncomeExpenseSavingComponent.propTypes = {
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
)(translate(GroupIncomeExpenseSavingComponent));
