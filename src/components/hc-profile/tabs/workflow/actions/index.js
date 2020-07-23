import {SET_HC_ID} from './types';

export const setHcId = (hcId) => {
    return {
        type: SET_HC_ID,
        hcId: hcId
    }
} 