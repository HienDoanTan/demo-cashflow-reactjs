import {saving_services} from "../services";
import {saving_constants} from "../constants";
import {alertActions} from "./";

export const saving_actions = {
    saving_insert: saving_insert
};

function saving_insert(dataSaving) {
    return async dispatch => {
        dispatch(request({dataSaving: dataSaving}));

        return await saving_services.saving_insert(dataSaving).then(
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
        return {type: saving_constants.SAVING_INSERT_REQUEST, data};
    }

    function success(data) {
        return {type: saving_constants.SAVING_INSERT_SUCCESS, data};
    }

    function failure(error) {
        return {type: saving_constants.SAVING_INSERT_FAIL, error};
    }
}
