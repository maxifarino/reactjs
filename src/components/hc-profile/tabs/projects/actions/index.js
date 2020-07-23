import * as types from './types';
import Api from '../../../../../lib/api';

export const setProjectsError = (error) => {
  return {
    type: types.SET_PROJECTS_ERROR,
    error
  };
};

export const setContractsError = (error) => {
  return {
    type: types.SET_CONTRACTS_ERROR,
    error
  };
};

export const setProjectsList = (projects) => {
  return {
    type: types.SET_PROJECTS_LIST,
    projects
  };
};

export const setContractsList = (contracts) => {
  return {
    type: types.SET_CONTRACTS_LIST,
    contracts
  };
};

export const setTotalAmountOfProjects = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_PROJECTS,
    total
  };
};

export const setTotalAmountOfContracts = (total) => {
  return {
    type: types.SET_TOTAL_AMOUNT_OF_CONTRACTS,
    total
  };
};

export const setFetchingProjects = (fetchingProjects) => {
  return {
    type: types.SET_FETCHING_PROJECTS,
    fetchingProjects
  };
};

export const setFetchingContracts = (isFetching) => {
  return {
    type: types.SET_FETCHING_CONTRACTS,
    isFetching
  };
};

export const setShowModal = (status) => {
  return {
    type: types.SET_SHOW_MODAL,
    showModal: status
  };
};

export const setAddProjectData = (data) => {
  return {
    type: types.SET_ADD_PROJECT_DATA,
    data
  };
};

export const setProjectStatus = (data) => {
  return {
    type: types.SET_PROJECT_STATUS,
    data
  };
};

export const fetchProjects = (queryParams) => {
  return (dispatch, getState) => {
    const {login, localization} = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    const token = login.authToken;
    let urlParameters = '';

    dispatch(setFetchingProjects(true));
    dispatch(setTotalAmountOfProjects(0));

    const {projectsPerPage} = getState().projects;
    if (queryParams) {
      if (queryParams.withoutPag) {
        delete queryParams.pageNumber;
        delete queryParams.pageSize;
      }
      else {
        if (!queryParams.pageNumber) {
          queryParams.pageNumber = 1;
        }
        queryParams.pageSize = projectsPerPage;
      }
    }
    else {
      queryParams = {
        pageNumber: 1,
        pageSize: projectsPerPage
      };
    }


    let urlQuery = 'projects';

    urlParameters = `?${Object.keys(queryParams).map(i => `${i}=${queryParams[i]}`).join('&')}`;

    return Api.get(`${urlQuery}${urlParameters}`, token)
      .then(response => {
        const {success, totalCount, data} = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setTotalAmountOfProjects(totalCount));
          dispatch(setProjectsList(data));
        }
        else {
          switch (data.errorCode) {
            case 10005:
              errorMsg = error10005;
              break;
            case 10006:
              errorMsg = error10006;
              break;
            case 10007:
              errorMsg = error10007;
              break;
            case 10011:
              errorMsg = error10011;
              break;
            case 10019:
              errorMsg = error10019;
              break;
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setProjectsError(errorMsg));
          dispatch(setTotalAmountOfProjects(0));
          dispatch(setProjectsList([]));
        }
        dispatch(setFetchingProjects(false));
      })
      .catch(error => {
        dispatch(setProjectsError(errorConnection));
      });
  };
};

  export const fetchContracts = (query) => {
    return (dispatch, getState) => {
      const { login, localization } = getState();
      let {
        error10005,
        error10006,
        error10007,
        error10011,
        error10019,
        errorDefault,
        errorConnection,
      } = localization.strings.hcProfile.projects.actions;
      const token = login.authToken;

      dispatch(setFetchingContracts(true));
      dispatch(setTotalAmountOfContracts(0));
      dispatch(setContractsList([]));

      const urlQuery = 'contracts';
      const urlParameters = `?${Object.keys(query).map(i => `${i}=${query[i]}`).join('&')}`;

      return Api.get(`${urlQuery}${urlParameters}`, token)
        .then(response => {
          const {success, data } = response.data;
          let errorMsg = '';
          if(success) {
            dispatch(setContractsList(data));
          }
          else {
            switch(data.errorCode) {
              case 10005:
                errorMsg = error10005;
                break;
              case 10006:
                errorMsg = error10006;
                break;
              case 10007:
                errorMsg = error10007;
                break;
              case 10011:
                errorMsg = error10011;
                break;
              case 10019:
                errorMsg = error10019;
                break;
              default:
                errorMsg = errorDefault;
                break;
            }
            dispatch(setContractsError(errorMsg));
            dispatch(setTotalAmountOfContracts(0));
            dispatch(setContractsList([]));
          }
          dispatch(setFetchingContracts(false));
        })
        .catch(error => {
          dispatch(setProjectsError(errorConnection));
        });
    };
};

export const fetchProjectStatus = () => {
  return (dispatch, getState) => {
    const { login, localization } = getState();
    let {
      error10005,
      error10006,
      error10007,
      error10011,
      error10019,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    const token = login.authToken;

    return Api.get('projects/status', token)
      .then(response => {
        const { success, projectsStatusList, data } = response.data;
        let errorMsg = '';
        if (success) {
          dispatch(setProjectStatus(projectsStatusList));
        }
        else {
          switch (data.errorCode) {
            case 10005:
              errorMsg = error10005;
              break;
            case 10006:
              errorMsg = error10006;
              break;
            case 10007:
              errorMsg = error10007;
              break;
            case 10011:
              errorMsg = error10011;
              break;
            case 10019:
              errorMsg = error10019;
              break;
            default:
              errorMsg = errorDefault;
              break;
          }
          dispatch(setProjectsError(errorMsg));
        }
      })
      .catch(error => {
        dispatch(setProjectsError(errorConnection));
      });
  };
};

export const sendProject = (closeModal) => {

  return (dispatch, getState) => {
    const { login, localization, projects } = getState();
    const { projectInfo, contracts, hiringClientId } = projects.addProjectData;
    const {
      error10001,
      error10003,
      error10004,
      error10005,
      error10006,
      error10007,
      error10008,
      error10011,
      error10013,
      error10014,
      errorDefault,
      errorConnection,
    } = localization.strings.hcProfile.projects.actions;
    const errors = {
      10001: error10001,
      10003: error10003,
      10004: error10004,
      10005: error10005,
      10006: error10006,
      10007: error10007,
      10008: error10008,
      100011: error10011,
      100013: error10013,
      100014: error10014
    }
    const token = login.authToken;

    dispatch(setProjectsError(''));

    let payload = {
      hiringClientId: hiringClientId,
      name: projectInfo.projectName,
      statusId: projectInfo.projectStatus
    };
    let apiMethod = 'post';

    if (projectInfo.id) {
      payload.id = projectInfo.id;
      apiMethod = 'put';
    }

    return Api[apiMethod](
      `projects`,
      payload,
      token)
      .then(response => {
        const { success, data } = response.data;
        let errorMsg = '';
        if (success) {
          // no contracts when editing the project from hc profile
          if (contracts) {

            const { projectId } = data;

            const mappedContracts = contracts.map((contract) => {
              return {
                projectId,
                ...contract
              };
            });

            const payload2 = {
              contractsList: mappedContracts
            };

            Api.post(
              `contracts/list`,
              payload2,
              token)
              .then(response => {
                const { success, data } = response.data;
                if (success) {

                } else {
                  errorMsg = errors[data.errorCode] || errorDefault;
                  dispatch(setProjectsError(errorMsg));
                }
              })
              .catch(error => {
                console.log("error on contracts", error);
                dispatch(setProjectsError(errorConnection));
              });

          }

        } else {
          errorMsg = errors[data.errorCode] || errorDefault;
          dispatch(setProjectsError(errorMsg));
        }
        closeModal();
      })
      .catch(error => {
        console.log("error on project", error);
        dispatch(setProjectsError(errorConnection));
      });
  };
}
