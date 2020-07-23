import LocalizedStrings from 'react-localization';

import * as types from '../actions/types'; 
import en from '../languages/en'; 
import zeros from '../languages/zeros'; 

let strings = new LocalizedStrings({en, zeros});

export default function localizationReducer(state = {
  strings,
  errorFetchLanguage: ''
  }, action) {
  switch(action.type) {
    case types.SET_STRINGS:
      return Object.assign({}, state, {
        strings: action.strings
      });
    case types.SET_LANGUAGE: 
      strings.setLanguage(action.langCode);
      return Object.assign({}, state, {
        strings: Object.assign(strings, {})
      });
    default:
      return state;
  }
};