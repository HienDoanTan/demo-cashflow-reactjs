import config from './../config/config.json';
import {authHeader} from '../helpers';

const {saving} = require('./../config/api_config.json');

export const saving_services = {
    saving_insert: saving_insert
};

function saving_insert(dataSaving) {

    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(dataSaving),
    };

    return fetch(`${config.local.host}${saving.insert}`, requestOptions).then(handleResponse);
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = "/login";
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
