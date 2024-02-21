import {expense_service} from "../services";
import {expenseConstants} from "../constants";
import {alertActions} from "./";

export const expense_actions = {
    expense_insert
};

function expense_insert(dataIncome) {
    return async dispatch => {
        dispatch(request({ dataIncome }));

        return await expense_service.expense_insert(dataIncome).then(
            response => {
                dispatch(success(response));
                return success(response);
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
                return failure(error.toString());
            }
        );
    };

    function request(data) {
        return {type: expenseConstants.EXPENSE_INSERT_REQUEST, data};
    }

    function success(data) {
        return {type: expenseConstants.EXPENSE_INSERT_SUCCESS, data};
    }

    function failure(error) {
        return {type: expenseConstants.EXPENSE_INSERT_FAIL, error};
    }
}
