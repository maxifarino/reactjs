import Utils from '../../lib/utils';
import * as types from '../actions/types'; 

export const setCustomStrings = (strings) => {
  return {
    type: types.SET_STRINGS,
    strings
  };
};

export const setCustomTerms = (customTerms) => {  
  //console.log('customTerms', customTerms);
  return (dispatch, getState) => {
    const { strings } = getState().localization;
    let customStrings = strings;
    customTerms.forEach(term => {
      customStrings = Utils.deepValueReplace(customStrings, term.OriginalTerm, term.CustomTerm);
    });
    dispatch(setCustomStrings(customStrings));
  }
}