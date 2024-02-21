import config from './../config/config.json';
import {authHeader} from '../helpers';

const {files} = require('./../config/api_config.json');

export const upload_files_services = {
    fn_upload_files: fn_upload_files
};

function fn_upload_files(value) {
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader()},
        body: value,
    };

    return fetch(`${config.local.host}${files.upload_files}`, requestOptions).then(handleResponse);
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


