import React from "react";
import {Layout} from "antd";

const {Header, Content, Footer} = Layout;

const FooterComponent = () => {
    return (
        <Footer style={{
            textAlign: 'center'
        }}>
            Design ©2023
            <br/>
            Contact for support <a target={'_blank'} href={'https://www.facebook.com/tanhien.it/'}>Hiền Đoàn</a>
        </Footer>
    )
}
export default FooterComponent;