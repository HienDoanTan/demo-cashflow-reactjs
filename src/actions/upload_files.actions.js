import {upload_files_services} from "../services";
import {upload_files_constants} from "../constants";
import {alertActions} from "./";

export const upload_files_actions = {
    fn_upload_files: fn_upload_files,
    fn_upload_files_list_type: fn_upload_files_list_type
};

function fn_upload_files(dataValue) {
    return async dispatch => {
        dispatch(request({ dataValue }));

        return await upload_files_services.fn_upload_files(dataValue).then(
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
        return {type: upload_files_constants.UPLOAD_FILES_REQUEST, data};
    }

    function success(data) {
        return {type: upload_files_constants.UPLOAD_FILES_SUCCESS, data};
    }

    function failure(error) {
        return {type: upload_files_constants.UPLOAD_FILES_FAIL, error};
    }
}
function fn_upload_files_list_type(value) {
    return {type: value};
}

