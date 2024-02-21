import {
    Form,
    InputNumber,
    Popconfirm,
    Table,
    Typography,
    Input,
    Space,
    message,
    Row,
    Col,
    Checkbox,
    Button, Spin, DatePicker, Badge, Card, Tooltip
} from 'antd';
import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {translate} from "react-switch-lang";
import UploadDefaultFileComponent from "../../helpers/upload_default_file";
import dayjs from "dayjs";
import {expense_history_actions, income_history_actions, saving_history_actions} from "../../actions";
import {expense_history_constants, income_history_constants, saving_history_constants} from "../../constants";
import {groupBy, numberToWords} from "../../helpers/helpers";
import {DownloadOutlined, SearchOutlined, EditOutlined} from "@ant-design/icons";
import {colorOptions} from "../../config/colors_config.json";

const {TextArea} = Input;
const {RangePicker} = DatePicker;
const {Title} = Typography;

const GroupIncomeExpenseSavingHistoryAntdTableComponent = (props) => {
    const {t, type, typeColor, title} = props;
    const [form] = Form.useForm();
    const [data_group, set_data_group] = useState([]);

    let [list_checked_id, set_list_checked_id] = useState([]);
    const [isChecked, set_isChecked] = useState(false);
    const [is_has_data, set_is_has_data] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, is_loading] = useState(false);
    const [firstDay, set_firstDay] = useState(dayjs().startOf('month'));
    const [lastDay, set_lastDay] = useState(dayjs().endOf('month'));
    const [input_text, set_input_text] = useState('');
    const [editingKey, setEditingKey] = useState('');
    let [count_total, set_count_total] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    let [count_total_text, set_count_total_text] = useState(null);
    const [file_list_parent, set_file_list_parent] = useState([]);
    let [fileListTotal, setfileListTotal] = useState([]);
    const isEditing = (record) => record.key === editingKey;
    const [paginationInfo, setPaginationInfo] = useState({
        current: 1,
        pageSize: 10
    });
    const edit = (record) => {
        form.setFieldsValue({
            day: '',
            actions: '',
            money: '',
            money_total: '',
            notes: null,
            attachedString: null,
            ...record,
        });
        setEditingKey(record.key);
    };


    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              inputType,
                              record,
                              index,
                              children,
                              ...restProps
                          }) => {

        let inputNode;
        if (dataIndex === 'actions') {
            inputNode = <Input value={record.actions}/>;
        } else if (dataIndex === 'money') {
            inputNode = <InputNumber defaultValue={record.money}/>;
        } else if (dataIndex === 'notes') {
            inputNode = <TextArea maxLength={200} rows={4} defaultValue={record.notes}/>;
        } else {
            inputNode = children;
        }

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        //name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: !(dataIndex === 'attached_group' || dataIndex === 'notes'),
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data_group];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];

                console.log(item, 'item')
                item.attached_group.push({
                    AttachedString: '8YNXpuy5x208tzLzTLTd',
                    FileName: "http://localhost:6969/uploads/355051265_943510740192877_2674363710324439289_n.jpg",
                    id: 93,
                    name: "http://localhost:6969/uploads/355051265_943510740192877_2674363710324439289_n.jpg",
                    status: "done",
                    thumbUrl: "http://localhost:6969/uploads/355051265_943510740192877_2674363710324439289_n.jpg",
                    uid: 93,
                    url: "http://localhost:6969/uploads/355051265_943510740192877_2674363710324439289_n.jpg"
                });
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                set_data_group(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                set_data_group(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const hasSelected = selectedRowKeys.length > 0;

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: editingKey !== '',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    const columns = [
        {
            title: t('text.txt_day'),
            dataIndex: 'day',
            //width: '25%',
            editable: true,
            ellipsis: true,
            align: 'center',
            // sorter: (a, b) => {
            //     return (
            //         a.id - b.id
            //     )
            // },
            render: (value, row, index) => {
                const trueIndex =
                    index + paginationInfo.pageSize * (paginationInfo.current - 1);
                const obj = {
                    children: value,
                    props: {}
                };
                if (data_group.length > 0) {
                    if (index >= 1 && value === data_group[trueIndex - 1].day) {
                        obj.props.rowSpan = 0;
                    } else {
                        for (
                            let i = 0;
                            trueIndex + i !== data_group.length &&
                            value === data_group[trueIndex + i].day;
                            i += 1
                        ) {
                            obj.props.rowSpan = i + 1;
                        }
                    }
                }
                return obj;
            }
        },
        {
            title: t('text.txt_Todo'),
            dataIndex: 'actions',
            //width: '15%',
            editable: true,
            ellipsis: true,
            render: (_, record) => {
                return (
                    <Tooltip color={typeColor} placement="topLeft" title={record.actions}>
                        <span>{record.actions}</span>
                    </Tooltip>
                )
            },

        },
        {
            title: t('text.txt_Money'),
            editable: true,
            ellipsis: true,
            children: [
                {
                    title: t('text.txt_Money'),
                    dataIndex: 'money',
                    align: 'right',
                    width: 100,
                    render: (_, record) => {
                        return (
                            <span
                                style={{color: typeColor}}>{`${record.money}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                        )
                    },
                },
                {
                    title: t('home.total'),
                    dataIndex: 'money_total',
                    align: 'right',
                    render: (value, row, index) => {
                        const trueIndex =
                            index + paginationInfo.pageSize * (paginationInfo.current - 1);
                        const obj = {
                            children: <span
                                style={{color: typeColor, fontSize: 18, fontWeight: 'bold'}}>
                                {`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </span>,
                            props: {}
                        };
                        if (index >= 1 && value === data_group[trueIndex - 1].money_total) {
                            obj.props.rowSpan = 0;
                        } else {
                            for (
                                let i = 0;
                                trueIndex + i !== data_group.length &&
                                value === data_group[trueIndex + i].money_total;
                                i += 1
                            ) {
                                obj.props.rowSpan = i + 1;
                            }
                        }
                        return obj;
                    }
                },
            ],
        },
        {
            title: t('text.txt_notes'),
            dataIndex: 'notes',
            //width: '20%',
            editable: true,
            ellipsis: true,
            render: (_, record) => {
                return (
                    <Tooltip color={typeColor} placement="topLeft" title={record.notes}>
                        <span>{record.notes}</span>
                    </Tooltip>
                )
            },
        },
        {
            title: t('text.txt_attach'),
            dataIndex: 'attached_group',
            editable: true,
            ellipsis: true,
            width: '20%',
            render: (_, record) => {
                const val_attachedString = record.attachedString === undefined ? '' : record.attachedString;
                return (
                    <UploadDefaultFileComponent {...props}
                                                isEditing={editingKey}
                                                type={type}
                                                attachedString={val_attachedString}
                                                set_file_list_parent={set_file_list_parent}
                                                attached_group={record.attached_group}
                                                id_value={record.id}
                    />
                )
            },
        },
        {
            title: t('text.txt_action'),
            dataIndex: 'operation',
            width: 100,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link
                onClick={() => save(record.key)}
                style={{
                    marginRight: 8,
                }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                    <>
                        {editingKey === '' && (
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                <Button type="dashed" icon={<EditOutlined/>}>
                                    Edit
                                </Button>
                            </Typography.Link>
                        )}
                    </>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record, rowIndex) => {
                return ({
                    record,
                    inputType: col.dataIndex === 'day' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                })
            },
        };
    });
    useEffect(() => {
        setTimeout(() => {
            fn_search_group().then(r => {
            });
        }, 1000);
    }, []);

    useEffect(() => {
        setfileListTotal(prevArray => [...prevArray, file_list_parent]);
        console.log(file_list_parent, 'file_list_parent')
    }, [file_list_parent]);

    useEffect(() => {
        console.log(fileListTotal, 'fileListTotal')
    }, [fileListTotal]);


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
                }).then(() => {

                    const sum = objectResult.reduce((acc, cur) => {
                        const found = acc.find(val => val.day === cur.day);
                        if (found) {
                            found.money_total += Number(cur.money);
                        } else {
                            acc.push({...cur, money_total: Number(cur.money)})
                        }
                        return acc;
                    }, []);

                    const dataCallback = [];
                    objectResult.map((val, i) => {
                        const find = objectResult.filter((value, index, array) => {
                            return value.day === val.day;
                        });

                        const sum_money = find.reduce((accumulator, object) => {
                            return accumulator + object.money;
                        }, 0);

                        dataCallback.push({
                            day: val.day,
                            actions: val.actions,
                            money: val.money,
                            attachedString: val.attachedString,
                            available: false,
                            id: val.id,
                            notes: val.notes,
                            attached_group: val.attached_group,
                            key: val.id,
                            money_total: sum_money
                        })
                    });

                    setTimeout(() => {
                        const countTotals = objectResult.reduce((n, {money}) => n + Number(money), 0);
                        if (countTotals > 0) {
                            const text_total = numberToWords(countTotals);
                            set_count_total_text(text_total);
                            set_count_total(countTotals);
                        }

                        is_loading(false);
                        set_is_has_data(true);
                        set_data_group(dataCallback);
                        console.log(dataCallback, 'dataCallback')
                        messageApi.success(t('notification.notification_load_data_success'));
                    }, 1000);

                });
            } else {
                setTimeout(() => {
                    is_loading(false);
                    set_is_has_data(false);
                    // set_data_group([{
                    //     day: null,
                    //     actions: null,
                    //     money: null,
                    //     attachedString: null,
                    //     id: null,
                    //     notes: null,
                    //     attached_group: null
                    // }]);

                    set_count_total(0);
                    set_count_total_text(null);
                    messageApi.warning(t('notification.notification_data_empty'));
                }, 1000);
            }
        } else {
            setTimeout(() => {
                is_loading(false);
                set_is_has_data(false);
                // set_data_group([{
                //     day: null,
                //     actions: null,
                //     money: null,
                //     attachedString: null,
                //     id: null,
                //     notes: null,
                //     attached_group: null
                // }]);
                //
                set_count_total(0);
                set_count_total_text(null);
                messageApi.warning('ERROR LOADING');
            }, 1000);
        }
    }

    function fnOnchangeCheckBoxSelectAll() {

    }

    function fn_input_onChange(e) {
        set_input_text(e.target.value);
    }

    function exports_handsontable_file() {

    }

    const fn_handleChange_table = pagination => {
        setPaginationInfo(pagination);
    };

    async function confirm() {
        // kiểm tra list id có dữ liệu không, nếu có thì thực hiện xóa
        if (selectedRowKeys.length > 0) {
            is_loading(true);

            switch (type) {
                case "income":
                    await props
                        .dispatch(income_history_actions.income_history_delete(selectedRowKeys))
                        .then(response => {
                            if (response.type === income_history_constants.INCOME_HISTORY_DELETE_SUCCESS) {
                                messageApi.success(t('notification.notification_remove_success'));
                                setSelectedRowKeys([]);
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
                        .dispatch(expense_history_actions.fn_expense_remove_history(selectedRowKeys))
                        .then(response => {
                            if (response.type === expense_history_constants.EXPENSE_HISTORY_REMOVE_SUCCESS) {
                                messageApi.success(t('notification.notification_remove_success'));
                                setSelectedRowKeys([]);
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
                        .dispatch(saving_history_actions.saving_history_delete(selectedRowKeys))
                        .then(response => {
                            if (response.type === saving_history_constants.SAVING_HISTORY_DELETE_SUCCESS) {
                                messageApi.success(t('notification.notification_remove_success'));
                                setSelectedRowKeys([]);
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

    return (
        <Form form={form} component={false}>
            {contextHolder}
            <Spin size="default" tip={t("text.txt_loading")} spinning={loading}>
                <Table
                    rowSelection={{
                        ...rowSelection,
                    }}
                    size={"middle"}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    onChange={fn_handleChange_table}
                    dataSource={data_group}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                        size: 'default',
                        //pageSize: 5
                    }}
                    // scroll={{
                    //     //x: 600,
                    //     y: 300,
                    // }}
                    title={() => {
                        return (
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
                                        {hasSelected && (
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

                                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                                    </Space>
                                </Col>
                            </Row>
                        )
                    }}
                />
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
                                <Button onClick={() => exports_handsontable_file} disabled={loading}
                                        type="default"
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
                            <Card headStyle={{fontWeight: '700'}} title={t('text.txt_total')}
                                  size="small">
                                <Title style={{color: typeColor}} level={2}>
                                    {`${count_total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ
                                </Title>
                                <i style={{color: typeColor}}>{count_total_text}</i>
                            </Card>
                        </Badge.Ribbon>
                    </Col>
                </Row>
            </Spin>
        </Form>
    );
};


GroupIncomeExpenseSavingHistoryAntdTableComponent.propTypes = {
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
)(translate(GroupIncomeExpenseSavingHistoryAntdTableComponent));

// .editable-row .ant-form-item-explain {
//     position: absolute;
//     top: 100%;
//     font-size: 12px;
// }