// import { } from './types';
import Api from '../../../../../lib/api';

export const getWorkFlow = (hiringClientId, authToken, callback) => {
        Api.get(
            `workflows?hiringClientId=${hiringClientId}`,
            authToken
        )
        .then(response => {
            const { success, data } = response.data;
            if(success) {
                callback(null, data);
            } else {
                callback(data, []);
            }
        })
        .catch(error => {
            callback(error);
        });
}

export const getWorkFlowComponents = (workFlowId, authToken, callback) => {
    Api.get(
        `workflows/components?workflowId=${workFlowId}`,
        authToken
    )
    .then(response => {
        const { success, data, workflowId, components, possible_values } = response.data;
        if(success) {
            //console.log('workflow service', response.data)
            callback(null, {workflowId, components, possible_values});
        } else {
            callback(data, []);
        }
    })
    .catch(error => {
        callback(error);
    });
}

export const saveWorkFlowComponents = (payload, authToken, callback) => {
    Api.post(
        `workflows/components`,
        payload,
        authToken
    )
    .then(response => {
        const { success, data } = response.data;
        if(success) {
            //console.log('workflow service', response.data)
            callback(null, response.data);
        } else {
            callback(data, []);
        }
    })
    .catch(error => {
        callback(error);
    });
}

export const resetWorkFlowComponents = (workFlowId, authToken, callback) => {
    Api.get(
        `workflows/components?workflowId=${workFlowId}&resetToDefaultWF=true`,
        authToken
    )
    .then(response => {
        const { success, data, workflowId, components, possible_values } = response.data;
        if(success) {
            //console.log('reset', response.data)
            callback(null, {workflowId, components, possible_values});
        } else {
            callback(data, []);
        }
    })
    .catch(error => {
        callback(error);
    });
}
