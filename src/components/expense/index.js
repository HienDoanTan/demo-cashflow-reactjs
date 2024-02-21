import React, {createRef, useRef, useState} from "react";
import {Tabs, Button} from 'antd';
import ExpenseComponent from "./expense";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {translate} from 'react-switch-lang';
import {StickyContainer, Sticky} from 'react-sticky';
import ExpenseHistoryComponent from "./expense_history";
import UploadExcelComponent from "../../helpers/upload_excel_file";

const {TabPane} = Tabs;
const ExpensePage = (props) => {
    const {t} = props;
    const [activeKey, set_activeKey] = useState(1);

    const renderTabBar = (props, DefaultTabBar) => (
        <Sticky bottomOffset={80}>
            {({style}) => (
                <DefaultTabBar {...props} className="tab-1-custom-tab-bar" style={{...style}}/>
            )}
        </Sticky>
    );

    const onChange = (activeKey) => {
        set_activeKey(activeKey);
    }

    const operations = () => {
        return (
            <UploadExcelComponent />
        )
    }


    return (
        <div className={props.classNameHot}>
            <StickyContainer>
                <Tabs animated={true}
                      //tabBarExtraContent={operations()}
                      onChange={onChange} defaultActiveKey={1}
                      renderTabBar={renderTabBar} items={
                    [
                        {
                            key: 1,
                            label: (
                                <span>
                                  <img style={{marginRight: 5}}
                                       src={require('../../images/icons/expensive.png').default}
                                       alt={""} width={"30"} height={"30"}/>
                                    {t('expense.name')}
                                </span>
                            ),
                            children: (<ExpenseComponent activeKey={activeKey} {...props}/>),
                        },
                        {
                            key: 2,
                            label: (
                                <span>
                                  <img style={{marginRight: 5}}
                                       src={require('../../images/icons/expensive.png').default}
                                       alt={""} width={"20"} height={"20"}/>
                                    {t('expense.history')}
                                </span>
                            ),
                            children: (<ExpenseHistoryComponent activeKey={activeKey} {...props}/>),
                        }
                    ]
                }>
                </Tabs>
            </StickyContainer>
        </div>

    )
}

ExpensePage.propTypes = {
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
)(translate(ExpensePage));
