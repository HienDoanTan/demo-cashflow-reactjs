import React, {useEffect, useState} from 'react';
import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber, Layout,
    Row,
    Select,
} from 'antd';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {ReCaptcha} from 'react-recaptcha-google';
import {setDefaultLanguage, translate} from "react-switch-lang";
import {userActions} from "../../actions";
import {userConstants} from "../../constants";
import {history} from "../../helpers";
import RecaptchaComponent from "../reCAPTCHA/reCAPTCHA";

const {Header, Content, Footer} = Layout;
const RegisterComponent = (props) => {
    const [loading, setLoading] = useState(false);
    const onFinish = (values) => {
        const {username, password} = values;
        if (username && password) {
            setLoading(true);
            setTimeout(() => {
                props.dispatch(userActions.register(username, password));
            }, 1000);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }


    useEffect(() => {
        const now = new Date();
        if (now.getHours() < 18) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        }
    }, []);

    return (
        <Layout style={{transition: "background-color 0.5s ease"}}>
            <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
                <Row align="middle" style={{minHeight: 700}}>
                    <Col span={8} offset={8}>
                        <Form
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{required: true, message: 'Please input your username!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{required: true, message: 'Please input your password!'}]}
                            >
                                <Input.Password/>
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>

    )
};

RegisterComponent.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {registering} = state.authentication;
    return {
        registering
    };
}

export default connect(mapStateToProps,
    null,
    null,
    {forwardRef: true})(translate(RegisterComponent));