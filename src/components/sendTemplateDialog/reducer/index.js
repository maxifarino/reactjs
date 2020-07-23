import {OPEN_DIALOG, CLOSE_DIALOG} from '../actions/types';

export default function sendTemplate(
    state = {
        isDialogOpen: false
    }, action) {

        switch (action.type) {
            case OPEN_DIALOG:
                return Object.assign({}, state, {isDialogOpen: true, formItem: action.payload.formItem })
            case CLOSE_DIALOG:
            return Object.assign({}, state, {isDialogOpen: false})
            default:
                return state;
        }
}