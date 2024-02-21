import config from './../config/config.json';
import {authHeader} from '../helpers';

const {expense} = require('./../config/api_config.json');

export const expense_history_service = {
    expense_get_history,
    fn_expense_remove_history
};

function expense_get_history(fromday, today, search_string) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({
            fromday: fromday,
            today: today,
            queryString: search_string
        })
    };

    return fetch(`${config.local.host}${expense.history}`, requestOptions).then(handleResponse);
}

function fn_expense_remove_history(value) {

    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(value)
    };

    return fetch(`${config.local.host}${expense.delete}`, requestOptions).then(handleResponse);
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
