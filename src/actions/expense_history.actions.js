import {expense_history_service} from "../services";
import {expense_history_constants} from "../constants";

export const expense_history_actions = {
    expense_get_history,
    fn_expense_remove_history
};

function expense_get_history(fromday, today, search_string) {
    return async dispatch => {
        dispatch(request());

        return await expense_history_service.expense_get_history(fromday, today, search_string).then(
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
        return {type: expense_history_constants.EXPENSE_HISTORY_GET_REQUEST};
    }

    function success(data) {
        return {type: expense_history_constants.EXPENSE_HISTORY_GET_SUCCESS, data};
    }

    function failure(error) {
        return {type: expense_history_constants.EXPENSE_HISTORY_GET_FAIL, error};
    }
}

function fn_expense_remove_history(value) {
    return async dispatch => {
        dispatch(request());

        return await expense_history_service.fn_expense_remove_history(value).then(
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
        return {type: expense_history_constants.EXPENSE_HISTORY_REMOVE_REQUEST};
    }

    function success(data) {
        return {type: expense_history_constants.EXPENSE_HISTORY_REMOVE_SUCCESS, data};
    }

    function failure(error) {
        return {type: expense_history_constants.EXPENSE_HISTORY_REMOVE_FAIL, error};
    }
}
