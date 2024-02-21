import {authHeader} from "../helpers";
import config from './../config/config.json';

const {data} = require('./../config/api_config.json');
export const dataService = {
    getYearNumber,
    fn_get_data_by_year,
    fn_get_data_all_year
};

function getYearNumber() {

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.local.host}${data.get_year}`, requestOptions).then(handleResponse);
}

function fn_get_data_by_year(year) {

    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({year: year}),
    };

    return fetch(`${config.local.host}${data.get_data_by_year}`, requestOptions).then(handleResponse);
}

function fn_get_data_all_year() {

    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'}
    };

    return fetch(`${config.local.host}${data.get_data_all_year}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                window.location.href = "/login";
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
