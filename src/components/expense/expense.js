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
import {expense_actions, upload_files_actions} from "../../actions";
import {incomeConstants, upload_files_constants} from "../../constants";
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

const ExpenseComponent = (props) => {
    const {t} = props;
    const [dataHandsome, setDataHandsome] = useState([{
        day: null,
        actions: null,
        money: null,
        notes: null,
        attachedString: null,
    }]);
    const ref_expense = useRef(null);
    const [loading, setLoading] = useState(false);
    let [count_total, set_count_total] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [file_list_parent, set_file_list_parent] = useState([]);
    let [fileListTotal, setfileListTotal] = useState([]);
    let numer_string_strength = 20;

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
        ref: ref_expense,
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
                        td.style.color = colorOptions.expense;
                    }
                    if (value >= 1000000) {
                        td.style.fontWeight = "bold";
                        td.style.color = colorOptions.expense;
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
                    // const childNodes = td.children;
                    // const actions = instance.getDataAtRowProp(row, 'actions');
                    // if (actions !== null) {
                    //     if (!childNodes.item(0)) {
                    //         const dom = document.createElement('div');
                    //         const random_string = randomString(numer_string_strength);
                    //         ReactDOM.render(<UploadFileComponent {...props}
                    //                                              random_string={random_string}
                    //                                              row={row}
                    //                                              type={'expense'}
                    //         />, dom);
                    //         td.appendChild(dom);
                    //     }
                    // }
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
                    const actions = ref_expense.current.hotInstance.getDataAtRowProp(row, 'actions');
                    if (actions === null) {
                        return false;
                    }
                    break;
                case 'actions':
                    if (newValues) {
                        if (newValues.length > 50) {
                            message.error('dữ liệu không được quá 50 ký tự');
                            return false;
                        }
                    }
                    break;
                case 'notes':
                    if (newValues) {
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
        afterInit: function (a, b, c) {
            if (ref_expense) {
                if (ref_expense.current !== null) {
                    setTimeout(() => {
                        ref_expense.current.hotInstance.render();
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
            const days = ref_expense.current.hotInstance.getDataAtRowProp(row, 'day');
            switch (col) {
                case "actions":
                    if (newVal) {
                        if (!days) {
                            ref_expense.current.hotInstance.setDataAtRowProp(row, 'day', toDay, "source");

                            //--- Add button
                            const cell = ref_expense.current.hotInstance.getCell(row, 4); // col 4 là col attachedString
                            const random_string = randomString(numer_string_strength);

                            ref_expense.current.hotInstance.setDataAtRowProp(row, 'attachedString', random_string, "source");

                            const dom = document.createElement('div');
                            ReactDOM.render(<UploadFileComponent {...props}
                                                                 random_string={random_string}
                                                                 row={row}
                                                                 type={'expense'}
                                                                 set_file_list_parent={set_file_list_parent}
                            />, dom);
                            cell.appendChild(dom);
                        }
                    } else {
                        // ref_expense.current.hotInstance.setDataAtRowProp(row, 'day', null, "source");
                        // //--- Xóa button
                        // const cell = ref_expense.current.hotInstance.getCell(row, 4);
                        // cell.remove();
                    }
                    break;
                case 'day':
                    if (!Moment(new Date(newVal)).isValid()) {
                        return false;
                    }
                    break;
                case 'money':
                    const object_expense = ref_expense.current.hotInstance.getSourceData();
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
        if (props.activeKey === props.keyTabs) {
            console.log(props.activeKey, props.keyTabs, 'props.activeKey')
            if (ref_expense) {
                if (ref_expense.current !== null) {
                    setTimeout(() => {
                        ref_expense.current.hotInstance.render();
                    }, 200);
                }
            }
        }
    }, [props.activeKey]);

    useEffect(() => {
        //if (file_list_parent.length > 0) {
        setfileListTotal(prevArray => [...prevArray, file_list_parent]);
        //}
    }, [file_list_parent]);

    async function fn_save_expense() {
        let DataObject = [];
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

                    return props.dispatch(expense_actions.expense_insert(DataObject))
                        .then(response => {
                            setLoading(false);
                            if (response.type === incomeConstants.INCOME_INSERT_FAIL) {
                                message.error(response.error);
                            } else {
                                message.success(t('notification.notification_success'));
                                const dataEmpty = [{
                                    day: null,
                                    actions: null,
                                    money: null,
                                    notes: null,
                                    attachedString: null
                                }]
                                set_count_total(0);

                                //--- Xóa button
                                const objects = Handsontable.helper.createEmptySpreadsheetData(10, 5);
                                setDataHandsome(objects);
                                setDataHandsome(dataEmpty);

                            }
                            return response;
                        });
                }
            });

            return false;


        } else {
            message.error(t('notification.notification_empty'));
            setLoading(false);
            return null;
        }
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
                                    message.error(res.data.message);
                                    return false;
                                } else {
                                    message.success('upload file successfully.');
                                }
                                setfileListTotal([]);
                                setUploading(false);
                                return true;
                            }
                        } else if (res.type === upload_files_constants.UPLOAD_FILES_FAIL) {
                            message.error(res.error);
                            return false;
                        }
                    })
                    .catch((exception) => {
                        message.error('upload file failed.' + exception);
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
            <Spin size="default" tip={"Running"} spinning={loading} indicator={antIcon} delay={500}>
                <HotTable colHeaders={fnColHeaders} style={{zIndex: 0}} ref={ref_expense} settings={hotSetting}/>
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
                        <Badge.Ribbon text={t('expense.name')} color={colorOptions.expense}>
                            <Card headStyle={{fontWeight: '700'}} title={t('text.txt_total')} size="small">
                                <Title style={{color: colorOptions.expense}} level={2}>
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
                                    danger
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


ExpenseComponent.propTypes = {
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
)(translate(ExpenseComponent));
