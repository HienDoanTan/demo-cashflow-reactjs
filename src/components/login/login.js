import './login.css';
import PropTypes, {func} from "prop-types";
import {connect} from 'react-redux';
import React, {Component, useEffect, useState} from 'react';
import {userActions} from '../../actions';
import {history} from '../../helpers';
import {setDefaultLanguage, setLanguage, setTranslations, translate,} from 'react-switch-lang';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Form, Input, Button, Checkbox, Row, Avatar, Col, Switch, Layout} from 'antd';
import {userConstants} from "../../constants";
import en from "../../language/en.json";
import vi from "../../language/vi.json";
// import './../../theme.dark.less';
// import './../../theme.light.less';
// import 'antd/dist/antd.compact.css';
import FooterComponent from "../home/footer";

const {Header, Content, Footer, Sider} = Layout;

const siderStyle = {
    textAlign: 'center',
    width: '50%',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9',
};

const LoginComponent = (props) => {
    const {t, dispatch} = props;
    const [loading, setLoading] = useState(false);
    const [valueLanguage, setValueLanguage] = useState('vi');
    const [theme, setTheme] = useState('light');
    const [classNameHot, setClassNameHot] = useState(theme === 'light' ? 'light-theme' : 'dark-theme');

    useEffect(() => {
        dispatch(userActions.logout());
        setDefaultLanguage(valueLanguage);
        const now = new Date();
        if (now.getHours() < 18) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        }
    }, []);

    function handleChange(value) {
        const {username, password} = value;
        if (username && password) {
            setLoading(true);
            setTimeout(() => {
                props.dispatch(userActions.login(username, password)).then(response => {
                    if (response.type === userConstants.LOGIN_FAILURE) {
                        setLoading(false);
                    } else {
                        history.push('/');
                    }
                });
            }, 1000);

        }
    }

    function handleSetLanguage(key) {
        const lang = key ? 'vi' : 'en';
        setValueLanguage(lang);
        setLanguage(lang);
    }

    const headerStyle = {
        textAlign: 'center',
        color: '#fff',
        paddingTop: 40
    };
    const contentStyle = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#108ee9',
    };
    const siderStyle = {
        textAlign: 'center',
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#3ba0e9',
        backgroundImage: `url('https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ')`,
    };
    const footerStyle = {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#7dbcea',
    };

    return (
        <Layout className={"login-form"} style={{transition: "background-color 0.5s ease"}}>
            <Sider style={siderStyle}></Sider>
            <Layout>
                <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
                    <div className={classNameHot}>
                        <Row align="middle" style={{minHeight: 600}}>
                            <Col span={12} offset={6}>
                                <Form
                                    size={'middle'}
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{remember: true}}
                                    onFinish={handleChange}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[{required: true, message: t('login.txt_username_required')}]}
                                    >
                                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                                               placeholder="Username"/>
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        autoComplete="off"
                                        rules={[{required: true, message: t('login.txt_password_required')}]}
                                    >
                                        <Input
                                            prefix={<LockOutlined className="site-form-item-icon"/>}
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>{t('login.txt_remember')}</Checkbox>
                                        </Form.Item>

                                        <a className="login-form-forgot" href="">
                                            {t('login.txt_forgot_password')}
                                        </a>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button shape={"default"} loading={loading} type="primary" htmlType="submit"
                                                className="login-form-button">
                                            {t('login.btn_login')}
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        {t('login.txt_or')} <a href={'/register'}>{t('login.btn_register')}</a>
                                        <Switch
                                                onChange={handleSetLanguage}
                                                checkedChildren="Viet"
                                                unCheckedChildren="Eng"
                                                className="login-form-forgot"
                                        />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </Content>
                <FooterComponent/>
            </Layout>
        </Layout>
    )
}

LoginComponent.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {loggingIn} = state.authentication;
    return {
        loggingIn
    };
}

export default connect(mapStateToProps,
    null,
    null,
    {forwardRef: true})(translate(LoginComponent));
