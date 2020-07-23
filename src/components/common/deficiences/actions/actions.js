import Api from '../../../../lib/api';
import * as types from './types';
import _ from 'lodash';

export const setConfirmAll = () => {
  return {
    type: types.SET_CONFIRM_ALL
  };
};

export const setWaiveAll = () => {
  return {
    type: types.SET_WAIVE_ALL
  };
};

export const setShowAll = (payload) => {
  return {
    type: types.SET_SHOW_ALL,
    payload
  };
};

export const setHiddeAll = (payload) => {
  return {
    type: types.SET_HIDDE_ALL,
    payload
  };
};

export const setConfirm = (value) => {
  return {
    type: types.SET_CONFIRM_BY_ID,
    payload: value
  };
};

export const setWaive = (value) => {
  return {
    type: types.SET_WAIVE_BY_ID,
    payload: value
  };
};

export const setUndo = (value) => {
  return {
    type: types.SET_UNDO_BY_ID,
    payload: value
  };
};

export const setFetchDeficiencesSuccess = (data) => {
  return {
    type: types.SET_FETCH_DEFICIENCES_SUCCESS,
    payload: data
  }
}

export const fetchDeficiences = (projectInsuredId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    const urlParameters = `?projectInsuredId=${projectInsuredId}`;
    let urlQuery = `cf/certificates/deficiences`;

    return Api.get(`${urlQuery}${urlParameters}`, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          dispatch(setFetchDeficiencesSuccess(data));
          if (callback) callback(data);
        }
      })
      .catch(() => {
        if (callback) callback(false);
      });
  };
}

export const fetchToggleDeficiences = (projectInsuredDeficiencyId, deficiencesStatusId, deficiencyType) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    const body = {
      projectInsuredDeficiencyId,
      deficiencesStatusId,
      deficiencyType
    }

    let urlQuery = `cf/certificates/toggledeficiences`;

    return Api.put(urlQuery, body, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          setToggleDeficiences(dispatch, projectInsuredDeficiencyId, deficiencyType);
        }
      })
      .catch((error) => {
        console.log('error ', error);
      });
  };
}

const setToggleDeficiences = (dispatch, projectInsuredDeficiencyId, deficiencyType) => {

  switch (deficiencyType) {
    case types.CONFIRM_BY_ID:
      dispatch(setConfirm(projectInsuredDeficiencyId));
      break;

    case types.WAIVE_BY_ID:
      dispatch(setWaive(projectInsuredDeficiencyId));
      break;

    case types.CONFIRM_ALL:
      dispatch(setConfirmAll());
      break;

    case types.WAIVE_ALL:
      dispatch(setWaiveAll());
      break;

    case types.UNDO_BY_ID:
      dispatch(setUndo(projectInsuredDeficiencyId));
      break;
  }
}

export const setSelectAllWaiver = () => {
  return {
    type: types.SET_SELECT_ALL_WAIVER
  };
};

export const setSelectWaiver = (id) => {
  return {
    type: types.SET_SELECT_WAIVER,
    payload: id
  };
};

export const setUnSelectAllWaiver = () => {
  return {
    type: types.SET_UNSELECTED_ALL_WAIVER
  };
};

export const fetchWaiverDeficiences = (body, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let urlQuery = `cf/certificates/waiversdeficiencies`;

    return Api.post(urlQuery, body, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          body.deficiencesWaiver.forEach(elementId => {
            setToggleDeficiences(dispatch, elementId, types.WAIVE_BY_ID);
          });
          dispatch(setUnSelectAllWaiver());
          if (callback)
            callback()
        }
      })
      .catch((error) => {
        console.log('error ', error);
        if (callback)
          callback()
      });
  };
}

export const fetchUndoWaiverDeficiences = (parameter, projectInsuredId, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let body = {
      projectInsuredDeficiencyId: parameter,
      projectInsuredId
    }

    let urlQuery = `cf/certificates/undowaiversdeficiencies`;

    return Api.put(urlQuery, body, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          setToggleDeficiences(dispatch, parameter, types.UNDO_BY_ID);
          if (callback)
            callback();
        }
      })
      .catch((error) => {
        console.log('error ', error);
        if (callback)
          callback();
      });
  };
}

export const setSelectAllConfirm = () => {
  return {
    type: types.SET_SELECT_ALL_CONFIRM
  };
};

export const setUnSelectAllConfirm = () => {
  return {
    type: types.SET_UNSELECTED_ALL_CONFIRM
  };
};

export const fetchConfirmDeficiences = (deficienciesToConfirm, projectInsuredId, deficienciesRemaining = {}, callback) => {
  return (dispatch, getState) => {
    const { login: { authToken } } = getState();

    let urlQuery = `cf/certificates/confirmdeficiencies`;
    let data = {
      deficiencies: deficienciesToConfirm,
      remaining: deficienciesRemaining,
      projectInsuredId
    }
    return Api.put(urlQuery, data, authToken)
      .then(response => {
        const { success, data } = response.data;
        if (success) {
          deficienciesToConfirm.forEach(elementId => {
            setToggleDeficiences(dispatch, elementId, types.CONFIRM_BY_ID);
          });
          dispatch(setUnSelectAllConfirm());
          if (callback) {
            callback();
          }
        }
      })
      .catch((error) => {
        dispatch(setUnSelectAllConfirm());
        if (callback) {
          callback();
        }
      });
  };
}