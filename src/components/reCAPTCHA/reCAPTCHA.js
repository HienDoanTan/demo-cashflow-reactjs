import React, { Component } from 'react';
import { ReCaptcha } from 'react-recaptcha-google'
class RecaptchaComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
    }

    componentDidMount() {
        if (this.captchaDemo) {
            console.log("started, just a second...")
            this.captchaDemo.reset();
        }
    }

    onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }

    verifyCallback(recaptchaToken) {
        // Here you will get the final recaptchaToken!!!
        console.log(recaptchaToken, "<= your recaptcha token")
    }

    render() {
        return (
            <div>
                {/* You can replace captchaDemo with any ref word */}
                <ReCaptcha
                    ref={(el) => {this.captchaDemo = el;}}
                    size="normal"
                    data-theme="dark"
                    render="explicit"
                    sitekey="6Lftp1YkAAAAALTksf5zj8t11B0TZVHPRU9xtoud"
                    onloadCallback={this.onLoadRecaptcha}
                    verifyCallback={this.verifyCallback}
                />
                <code>
                    1. Add <strong>your site key</strong> in the ReCaptcha component. <br/>
                    2. Check <strong>console</strong> to see the token.
                </code>
            </div>
        );
    };
};
export default RecaptchaComponent;