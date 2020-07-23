import * as types from '../actions/types';

export default function registerReducer(state = {
  errorForms: '',
  list: [],
  discreetAccounts: [],
  totalAmountOfForms: 0,
  formsPerPage: 10,
  fetchingForms: true,
  formCreatorUsers: [],
  formSCSentTo: [],
  scorecardsFields: [],
  fetchingHiddenScorecardFields: false,
}, action) {
  switch (action.type) {

    // sets

    case types.SET_FORMS_LIST_ERROR:
      return Object.assign({}, state, {
        errorForms: action.error
      });

    case types.SET_FORMS_LIST:
      return Object.assign({}, state, {
        list: action.list.map((form, idx) => {
          return {
            id: form.id,
            name: form.name,
            description: form.description,
            invitesSent: 123,
            formSections: form.formSections,
            creator: form.creator,
            dateCreated: new Date(form.dateCreated).toLocaleDateString('en-US'),
            selected: form.selected != null ? form.selected.split(",").map(item => {
              return parseInt(item, 10);
            }) : [],
            accountDisplayTypeId: form.accountDisplayTypeId,
            scorecardHiddenFields: form.scorecardHiddenFields,
          };
        })
      });

    case types.SET_FETCHING_FORMS:
      return Object.assign({}, state, {
        fetchingForms: action.isFetching
      });

    case types.SET_TOTAL_AMOUNT_OF_FORMS:
      return Object.assign({}, state, {
        totalAmountOfForms: action.formsLength
      });

    case types.SET_FORM_CREATOR_USERS:
      return Object.assign({}, state, {
        formCreatorUsers: action.formCreatorUsers
      });

    case types.SET_FORM_SC_SENT_TO:
      return Object.assign({}, state, {
        formSCSentTo: action.formSCSentTo
      });

    case types.SET_DISCREET_ACCOUNTS_LIST:
      return Object.assign({}, state, {
        discreetAccounts: action.list
      });

    case types.SET_SCORECARDS_FIELDS_LIST:
      return Object.assign({}, state, {
        scorecardsFields: action.list
      });

    case types.SET_FETCHING_HIDDEN_SCORECARD_FIELDS:
      return Object.assign({}, state, {
        fetchingHiddenScorecardFields: action.fetching
      });

    case types.SET_FORMS_LIST_HIDDEN_SCORECARD_FIELDS:
      return Object.assign({}, state, {
        list: state.list.map((form) => {
          if (action.payload.formId === form.id) {
            return {
              ...form,
              scorecardHiddenFields: action.payload.fields
            };
          } else {
            return form;
          }
        }),
      });

    case types.SET_UPDATE_FORMS_LIST_DISCRETE_ACCOUNTS:
      const selectedFields = action.payload.data.filter((discreteAccount) => discreteAccount.selected);
      const mappedSelectedFields = selectedFields.map(field => parseInt(field.daId, 10));

      return Object.assign({}, state, {
        list: state.list.map((form) => {
          if (action.payload.formId === form.id) {
            return {
              ...form,
              accountDisplayTypeId: action.payload.accountDisplayTypeId,
              selected: mappedSelectedFields,
            };
          } else {
            return form;
          }
        }),
      });

    default:
      return state;
  }
}
