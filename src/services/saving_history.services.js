import config from './../config/config.json';
import {authHeader} from '../helpers';
const {saving} = require('./../config/api_config.json');

export const saving_history_service = {
    saving_history_get: saving_history_get,
    saving_history_delete: saving_history_delete
};

function saving_history_get(fromday, today, queryString) {

    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({
            fromday: fromday,
            today: today,
            queryString: queryString
        })
    };

    return fetch(`${config.local.host}${saving.history}`, requestOptions).then(handleResponse);
}


function saving_history_delete(value) {

    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(value)
    };

    return fetch(`${config.local.host}${saving.delete}`, requestOptions).then(handleResponse);
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
