import {upload_files_constants} from '../constants';

export function upload_file_list_type(state = {}, action) {
    switch (action.type) {
        case upload_files_constants.UPLOAD_FILES_LIST_TYPE_TEXT:
            return {
                type: 'text',
                message: action.message
            };
        case upload_files_constants.UPLOAD_FILES_LIST_TYPE_PICTURE:
            return {
                type: 'picture',
                message: action.message
            };
        case upload_files_constants.UPLOAD_FILES_LIST_TYPE_PICTURE_CARD:
            return {
                type: 'picture-card',
                message: action.message
            };
        case upload_files_constants.UPLOAD_FILES_LIST_TYPE_PICTURE_CIRCLE:
            return {
                type: 'picture-circle',
                message: action.message
            };
        default:
            return {
                type: 'picture',
                message: action.message
            }
    }
}
