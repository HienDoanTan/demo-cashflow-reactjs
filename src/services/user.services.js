import config from './../config/config.json';
import {authHeader} from '../helpers';

export const userService = {
    login,
    register,
    logout,
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    };

    return fetch(`${config.local.host}/api/auth/signin`, requestOptions)
        .then(handleResponse => handleResponse.text().then(text => {
            const data = text && JSON.parse(text);

            if (!handleResponse.ok) {
                if (handleResponse.status === 401) {

                }

                const error = (data && data.message) || (data && data.value) || handleResponse.statusText;
                return Promise.reject(error);
            }
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        }));
}

function register(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    }

        return fetch(`${config.local.host}/api/auth/register`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}


