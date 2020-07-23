import * as types from './types';
// import Api from '../../lib/api';

// sets

export const setStrings = (strings) => {
  return {
    type: types.SET_STRINGS,
    strings
  };
};

export const setLanguage = (langCode) => {
  return {
    type: types.SET_LANGUAGE,
    langCode
  };
};