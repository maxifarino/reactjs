import {OPEN_DIALOG, CLOSE_DIALOG} from './types';
import Api from '../../../lib/api';

export const openDialog = (formItem) => {
    return {
        type: OPEN_DIALOG,
        payload :{
            isDialogOpen: true,
            formItem: formItem
        }
        
    }
}

export const closeDialog = () => {
    return {
        type: CLOSE_DIALOG,
        payload :{
            isDialogOpen: false
        }
    }
}

export const getSubContractors = (userId, authToken, callback) => {

    return () => {
        Api.get(
            `subcontractors`, 
            authToken
        )
        .then(response => {
            const { success, data } = response.data;
            if(success) {
                callback(null, data);
            } else {
                callback(data);
            }
        })
        .catch(error => {
            callback(error);
        });
    }
}

export const getHiringClients = (SubContractorId, authToken, callback) => {
    return () => {
        Api.get(
            `subcontractors/hiringclients?subcontractorId=${SubContractorId}`, 
            authToken
        )
        .then(response => {
            const { success, data } = response.data;
            if(success) {
                callback(null, response.data.hiringClients);
            } else {
                callback(data);
            }
        })
        .catch(error => {
            callback(error);
        });
    }
}

export const sendForm = (hiringClientId, subcontractorId, formId, authToken, callback) => {

    const payload = {
        hiringClientId: hiringClientId,
        subcontractorId: subcontractorId,
        formId: formId
    }

    return () => {
        Api.post(
            `subcontractors/sendsubmission`, 
            payload,
            authToken
        )
        .then(response => {
            const { success, data } = response.data;
            if(success) {
                callback(null, response.data);
            } else {
                callback(data);
            }
        })
        .catch(error => {
            callback(error);
        });
    }
}