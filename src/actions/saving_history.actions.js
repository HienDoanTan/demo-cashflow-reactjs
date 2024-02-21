import {saving_history_service} from "../services";
import {saving_history_constants} from "../constants";

export const saving_history_actions = {
    saving_history_get: saving_history_get,
    saving_history_delete: saving_history_delete
};

function saving_history_get(fromday, today, queryString) {
    return async dispatch => {
        dispatch(request());

        return await saving_history_service.saving_history_get(fromday, today, queryString).then(
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
        return {type: saving_history_constants.SAVING_HISTORY_REQUEST};
    }

    function success(data) {
        return {type: saving_history_constants.SAVING_HISTORY_GET_SUCCESS, data};
    }

    function failure(error) {
        return {type: saving_history_constants.SAVING_HISTORY_FAIL, error};
    }
}


function saving_history_delete(value) {
    return async dispatch => {
        dispatch(request());

        return await saving_history_service.saving_history_delete(value).then(
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
        return {type: saving_history_constants.SAVING_HISTORY_DELETE_REQUEST};
    }

    function success(data) {
        return {type: saving_history_constants.SAVING_HISTORY_DELETE_SUCCESS, data};
    }

    function failure(error) {
        return {type: saving_history_constants.SAVING_HISTORY_DELETE_FAIL, error};
    }
}
