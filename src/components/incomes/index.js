import React, {useState} from "react";
import {Space, Tabs, Typography} from 'antd';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {translate} from 'react-switch-lang';
import {StickyContainer, Sticky} from 'react-sticky';
import IncomeComponent from "./incomes";
import IncomeHistoryComponent from "./income_history";
import SavingComponent from "../saving/saving";
import SavingHistoryComponent from "../saving/saving_history";
import ExpenseComponent from "../expense/expense";
import ExpenseHistoryComponent from "../expense/expense_history";
import {colorOptions} from "./../../config/colors_config.json";
import GroupIncomeExpenseSavingComponent from "../group_income_expense_saving_history/group_income_expense_saving";
import GroupIncomeExpenseSavingHistoryComponent
    from "../group_income_expense_saving_history/group_income_expense_saving_history";
import GroupIncomeExpenseSavingHistoryAntdTableComponent
    from "../group_income_expense_saving_history/group_income_expense_saving_history_ant_table";
import GroupIncomeExpenseSavingAntdTableComponent
    from "../group_income_expense_saving_history/group_income_expense_saving_ant_table";

const {Text, Link} = Typography;

const {TabPane} = Tabs;
const IncomePage = (props) => {
    const {t} = props;

    const [activeKey, set_activeKey] = useState(1);

    const renderTabBar = (props, DefaultTabBar) => (
        <Sticky bottomOffset={80}>
            {({style}) => (
                <DefaultTabBar {...props} className="tab-1-custom-tab-bar" style={{...style}}/>
            )}
        </Sticky>
    );

    function onChange(value) {
        set_activeKey(value);
    }


    return (
        <div>
            <StickyContainer>
                <Tabs animated={true} onChange={onChange} defaultActiveKey={1} renderTabBar={renderTabBar}
                      items={[
                          {
                              key: 1,
                              label: (
                                  <Space>
                                      <img style={{borderRadius: 20}}
                                           src={require('../../images/icons/income.jpg').default}
                                           alt={""} height={40}/>
                                      <Text style={{color: colorOptions.income}}>{t('income.name')}</Text>
                                  </Space>
                              ),
                              children: (
                                  <GroupIncomeExpenseSavingComponent typeColor={colorOptions.income}
                                                                     type={"income"}
                                                                     indexKey={1}
                                                                     title={t('income.name')}
                                                                     activeKey={activeKey} {...props}/>
                              ),
                          },
                          {
                              key: 2,
                              label: (
                                  <Space>
                                      <img style={{borderRadius: 20}}
                                           src={require('../../images/icons/income.jpg').default}
                                           alt={""} height={30}/>
                                      <Text style={{color: colorOptions.income}}>{t('income.history')}</Text>
                                  </Space>
                              ),
                              children: (<GroupIncomeExpenseSavingHistoryAntdTableComponent typeColor={colorOptions.income}
                                                                                   type={"income"}
                                                                                   indexKey={2}
                                                                                   title={t('income.history')}
                                                                                   activeKey={activeKey} {...props}/>),
                          },
                          {
                              label: null,
                              key: 'null_1',
                              children: null,
                              disabled: true,
                          },
                          {

                              key: 3,
                              label: (
                                  <Space>
                                      <img style={{borderRadius: 20}}
                                           src={require('../../images/icons/expense.jpg').default}
                                           alt={""} height={40}/>
                                      <Text style={{color: colorOptions.expense}}>{t('expense.name')}</Text>
                                  </Space>
                              ),
                              children: (<GroupIncomeExpenseSavingComponent typeColor={colorOptions.expense}
                                                                            type={"expense"}
                                                                            indexKey={3}
                                                                            title={t('expense.name')}
                                                                            activeKey={activeKey} {...props}/>),
                          },
                          {
                              key: 4,
                              label: (
                                  <Space>
                                      <img style={{borderRadius: 20}}
                                           src={require('../../images/icons/expense.jpg').default}
                                           alt={""} height={30}/>
                                      <Text style={{color: colorOptions.expense}}>{t('expense.history')}</Text>
                                  </Space>
                              ),
                              children: (<GroupIncomeExpenseSavingHistoryAntdTableComponent typeColor={colorOptions.expense}
                                                                                   type={"expense"}
                                                                                   indexKey={4}
                                                                                   title={t('expense.history')}
                                                                                   activeKey={activeKey} {...props}/>),
                          },
                          {
                              label: null,
                              key: 'null_2',
                              children: null,
                              disabled: true,
                          },
                          {
                              key: 5,
                              label: (
                                  <Space>
                                      <img style={{borderRadius: 20}}
                                           src={require('../../images/icons/saving.png').default}
                                           alt={""} height={40}/>
                                      <Text style={{color: colorOptions.saving}}>{t('saving.name')}</Text>
                                  </Space>
                              ),
                              children: (<GroupIncomeExpenseSavingComponent typeColor={colorOptions.saving}
                                                                            type={"saving"}
                                                                            indexKey={5}
                                                                            title={t('saving.name')}
                                                                            activeKey={activeKey} {...props}/>),
                          },
                          {
                              key: 6,
                              label: (
                                  <Space>
                                      <img style={{borderRadius: 20}}
                                           src={require('../../images/icons/saving.png').default}
                                           alt={""} height={30}/>
                                      <Text style={{color: colorOptions.saving}}>{t('saving.history')}</Text>
                                  </Space>
                              ),
                              children: (<GroupIncomeExpenseSavingHistoryAntdTableComponent typeColor={colorOptions.saving}
                                                                                   type={"saving"}
                                                                                   indexKey={6}
                                                                                   title={t('saving.history')}
                                                                                   activeKey={activeKey} {...props}/>),
                          }
                      ]
                      }>
                </Tabs>
            </StickyContainer>
        </div>
    )
}
IncomePage.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {users, authentication} = state;
    const {user} = authentication;
    return {
        user,
        users,
    };
}

export default connect(
    mapStateToProps,
    null,
    null,
    {forwardRef: true}
)(translate(IncomePage));
