import {
    AppstoreFilled,
    AppstoreOutlined,
    LogoutOutlined,
    FontColorsOutlined,
    SlackOutlined,
    UserOutlined,
    CheckOutlined,
    createFromIconfontCN, SettingFilled, SearchOutlined, SettingOutlined
} from '@ant-design/icons';
import {
    Button,
    Badge,
    Layout,
    Menu,
    Divider,
    Space,
    theme,
    Row,
    Col,
    FloatButton,
    List,
    Switch,
    Dropdown,
    Avatar,
    Image,
    ConfigProvider,
    Card, Popconfirm, Drawer
} from 'antd';
import React, {useEffect, useState} from 'react';
import './layout.css';
import {history} from "../../helpers";
import {setDefaultLanguage, setLanguage, setLanguageCookie, setTranslations, translate} from "react-switch-lang";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import vi from "../../language/vi.json";
import en from "../../language/en.json";
import HomeComponent from "../home/home";
import FooterComponent from "../home/footer";
import {userActions} from "../../actions";

const {Header, Sider, Content} = Layout;

setTranslations({vi, en});

// If you want to remember selected language
setLanguageCookie();

const LayoutComponent = (props) => {
    const {t} = props;
    const [current, setCurrent] = useState('dashboard');
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    //const [theme, setTheme] = useState('light');
    const {defaultAlgorithm, darkAlgorithm} = theme;
    const [valueLanguage, setValueLanguage] = useState('vi');
    //const [classNameHot, setClassNameHot] = useState(theme === 'light' ? 'light-theme' : 'dark-theme');
    const [isDarkMode, setIsDarkMode] = useState(props.state.users.is_dark_mode);
    const [openDrawer, setOpenDrawer] = useState(false);

    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };

    function changeTheme(value) {
        setIsDarkMode((previousValue) => !previousValue);
        fn_update_document_body(value);
        props.setDarkMode(value);
    }

    function handleSetLanguage(key) {
        const lang = key ? 'en' : 'vi';
        setValueLanguage(lang);
        setLanguage(lang);
    }

    function signOut(e) {
        history.push('/login')
    }

    function handleMenuClick(e) {
        if (e.key === '3') {
            setOpen(false);
        }
    }

    function handleOpenChange(flag) {
        setOpen(flag);
    }

    function fn_update_document_body(value) {
        if (!value) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        }
    }

    useEffect(() => {
        setDefaultLanguage(valueLanguage);
        fn_update_document_body(isDarkMode);

        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', event => {
                const colorScheme = event.matches ? "dark" : "light";
                console.log(colorScheme, 'colorScheme'); // "dark" or "light"
            });

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            console.log('dark')
        } else {
            console.log('light')
        }
    }, []);


    const items = [

        {
            label: (
                <Row style={{padding: 5}} onClick={showDrawer}>
                    <Col span={4}>
                        <UserOutlined style={{fontSize: 20}}/>
                    </Col>
                    <Col span={20}>
                        {t('account.txt_account_profile')}
                    </Col>
                </Row>
            ),
            key: 'profile',
        },
        {
            label: (
                <Row style={{padding: 5}}>
                    <Col span={4}>
                        <FontColorsOutlined style={{fontSize: 20}}/>
                    </Col>
                    <Col span={8}>
                        {t('text.txt_language')}
                    </Col>
                    <Col span={12} style={{textAlign: 'center'}}>
                        <Switch defaultChecked={valueLanguage === 'en'}
                                onChange={handleSetLanguage}
                                checkedChildren="Eng"
                                unCheckedChildren="Viet"
                        />
                    </Col>
                </Row>
            ),
            key: 'language',
        },
        {
            label: (
                <Row style={{padding: 5}}>
                    <Col span={4}>
                        <SlackOutlined style={{fontSize: 20}}/>
                    </Col>
                    <Col span={8}>
                        {t('text.txt_theme')}
                    </Col>
                    <Col span={12} style={{textAlign: 'center', verticalAlign: 'middle'}}>
                        <Switch
                            checked={isDarkMode}
                            onChange={changeTheme}
                            checkedChildren={'Dark'}
                            unCheckedChildren={'Light'}
                        />
                    </Col>
                </Row>
            ),
            key: 'theme',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <Row style={{padding: 5}} onClick={e => signOut(e)}>
                    <Col span={4}>
                        <LogoutOutlined/>
                    </Col>
                    <Col span={20}>
                        {t('home.logout')}
                    </Col>
                </Row>
            ),
            key: 'signout',
            danger: true,
        },
    ];


    const itemsMenuHeader = [
        {
            label: t('home.title'),
            key: 'dashboard',
            icon: <AppstoreFilled/>,
        },
    ];

    function onClick(e) {
        setCurrent(e.key);
    }


    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
            }}>
            <Layout hasSider style={{
                minHeight: '100vh',
            }}>
                <Layout className="site-layout">
                    <Header
                        style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            width: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <Row>
                            <Col span={3}>
                                <Image preview={false} src={require('../../images/logo/logo.svg').default} height={32}/>
                            </Col>
                            <Col span={20}>
                                <Menu theme={theme} onClick={onClick} selectedKeys={[current]} mode="horizontal"
                                      items={itemsMenuHeader}/>
                            </Col>
                            <Col span={1}>
                                <Row justify="end">
                                    <Dropdown
                                        overlayStyle={{width: 256}}
                                        menu={{
                                            items,
                                            onClick: handleMenuClick
                                        }}
                                        trigger={['hover']}
                                        onOpenChange={handleOpenChange}
                                        open={open}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <Badge dot={true} status="success" size="default" offset={[0, 50]}>
                                                <Avatar size="large" icon={<UserOutlined/>}/>
                                            </Badge>
                                        </a>
                                    </Dropdown>
                                </Row>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
                        <HomeComponent {...props} isDarkMode={isDarkMode} valueLanguage={valueLanguage}/>
                    </Content>
                    <FooterComponent/>
                </Layout>
            </Layout>
            <Drawer title="Basic Drawer" placement="right" onClose={onCloseDrawer} open={openDrawer}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </ConfigProvider>
    );
};

LayoutComponent.propTypes = {
    t: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {alert, users, authentication} = state;
    const {user} = authentication;
    return {
        state
    };
}

const mapDispatchToProps = dispatch => ({
    dispatch,
    setDarkMode: post => dispatch(userActions.setDarkMode(post)),
});

export default connect(mapStateToProps,
    mapDispatchToProps,
    null,
    {forwardRef: true}
)(translate(LayoutComponent));