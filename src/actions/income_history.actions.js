import {income_history_services} from "../services";
import {income_history_constants} from "../constants";

export const income_history_actions = {
    income_history_get,
    income_history_delete
};

function income_history_get(fromday, today, queryString) {
    return async dispatch => {
        dispatch(request());

        return await income_history_services.income_history_get(fromday, today, queryString).then(
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
        return {type: income_history_constants.INCOME_HISTORY_GET_REQUEST};
    }

    function success(data) {
        return {type: income_history_constants.INCOME_HISTORY_GET_SUCCESS, data};
    }

    function failure(error) {
        return {type: income_history_constants.INCOME_HISTORY_GET_FAIL, error};
    }
}

function income_history_delete(value) {
    return async dispatch => {
        dispatch(request());

        return await income_history_services.income_history_delete(value).then(
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
        return {type: income_history_constants.INCOME_HISTORY_DELETE_REQUEST};
    }

    function success(data) {
        return {type: income_history_constants.INCOME_HISTORY_DELETE_SUCCESS, data};
    }

    function failure(error) {
        return {type: income_history_constants.INCOME_HISTORY_DELETE_FAIL, error};
    }
}
