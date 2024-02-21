import React from 'react';
import {history} from './helpers/index';
import LoginComponent from "./components/login/login";
import {PrivateRoute} from './components/PrivateRoute';
import LayoutComponent from "./components/layout/layout";
import RegisterComponent from "./components/register/register";
import {Router, Route, Switch as SwitchDOM} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router history={history}>
            <SwitchDOM>
                <Route path="/login" name="Login Page" component={LoginComponent}/>
                <Route path="/register" name="Register Page" component={RegisterComponent}/>
                <PrivateRoute exact path="/" name="Layout Component" component={LayoutComponent}/>
            </SwitchDOM>
        </Router>
    );
}

export default App;
