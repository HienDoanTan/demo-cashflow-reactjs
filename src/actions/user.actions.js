import {userConstants} from '../constants';
import {userService} from '../services';
import {alertActions} from './';
import {message} from "antd";
import {history} from '../helpers';

export const userActions = {
    login,
    register,
    logout,
    setDarkMode
};

function login(username, password) {
    return async dispatch => {
        dispatch(request({username}));

        return await userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    return success(user);
                },
                error => {
                    message.error(error.toString());
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    return failure(error);
                }
            );
    };

    function request(user) {
        return {type: userConstants.LOGIN_REQUEST, user}
    }

    function success(user) {
        return {type: userConstants.LOGIN_SUCCESS, user}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
}

function register(username, password) {
    return async dispatch => {
        dispatch(request(username));
        return await userService.register(username, password)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    message.error(error.toString());
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    return failure(error);
                }
            );
    };

    function request(user) {
        return {type: userConstants.REGISTER_REQUEST, user}
    }

    function success(user) {
        return {type: userConstants.REGISTER_SUCCESS, user}
    }

    function failure(error) {
        return {type: userConstants.REGISTER_FAILURE, error}
    }
}

function logout() {
    userService.logout();
    return {type: userConstants.LOGOUT};
}

function setDarkMode(is_dark_mode) {
    return async dispatch => {
        await dispatch(success(is_dark_mode))
    }

    function success(is_dark_mode) {
        return {type: userConstants.SET_DARK_MODE, is_dark_mode: is_dark_mode}
    }
}

