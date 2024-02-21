import config from './../config/config.json';
import {authHeader} from '../helpers';

const {income} = require('./../config/api_config.json');

export const incomeService = {
    insertIncome
};

function insertIncome(dataIncome) {

    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify(dataIncome),
    };

    return fetch(`${config.local.host}${income.insert}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {

            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
