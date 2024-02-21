import {incomeService} from "../services";
import {incomeConstants} from "../constants";
import {alertActions} from "./";

export const incomeActions = {
    insertIncome
};

function insertIncome(dataIncome) {
    return async dispatch => {
        dispatch(request({ dataIncome }));

        return await incomeService.insertIncome(dataIncome).then(
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
        return {type: incomeConstants.INCOME_INSERT_REQUEST, data};
    }

    function success(data) {
        return {type: incomeConstants.INCOME_INSERT_SUCCESS, data};
    }

    function failure(error) {
        return {type: incomeConstants.INCOME_INSERT_FAIL, error};
    }
}
