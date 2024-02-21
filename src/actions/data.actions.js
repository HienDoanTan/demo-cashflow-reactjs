import {dataService} from "../services/data.services";
import {dataConstants} from "../constants/data.contants";

export const dataActions = {
    getYearNumber,
    fn_get_data_by_year,
    fn_get_data_all_year
}
function getYearNumber() {
    return async dispatch => {
        dispatch(request());

        return await dataService.getYearNumber().then(
            response => {
                dispatch(success(response));
                return success(response);
            },
            error => {
                dispatch(failure(error.toString()));
                return failure(error.toString());
            }
        );
    };

    function request() {
        return {type: dataConstants.DATA_YEAR_REQUEST};
    }

    function success(data) {
        return {type: dataConstants.DATA_YEAR_SUCCESS, data};
    }

    function failure(error) {
        return {type: dataConstants.DATA_YEAR_FAIL, error};
    }
}

function fn_get_data_by_year(year) {
    return async dispatch => {
        dispatch(request());

        return await dataService.fn_get_data_by_year(year).then(
            response => {
                dispatch(success(response));
                return success(response);
            },
            error => {
                dispatch(failure(error.toString()));
                return failure(error.toString());
            }
        );
    };

    function request() {
        return {type: dataConstants.DATA_BY_YEAR_REQUEST};
    }

    function success(data) {
        return {type: dataConstants.DATA_BY_YEAR_SUCCESS, data};
    }

    function failure(error) {
        return {type: dataConstants.DATA_BY_YEAR_FAIL, error};
    }
}

function fn_get_data_all_year() {
    return async dispatch => {
        dispatch(request());

        return await dataService.fn_get_data_all_year().then(
            response => {
                dispatch(success(response));
                return success(response);
            },
            error => {
                dispatch(failure(error.toString()));
                return failure(error.toString());
            }
        );
    };

    function request() {
        return {type: dataConstants.DATA_ALL_YEAR_REQUEST};
    }

    function success(data) {
        return {type: dataConstants.DATA_ALL_YEAR_SUCCESS, data};
    }

    function failure(error) {
        return {type: dataConstants.DATA_ALL_YEAR_FAIL, error};
    }
}
