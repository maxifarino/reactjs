/* eslint-disable no-useless-escape */
//export const EMAIL = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const EMAIL = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;


/* Accepted phone number formats
    +0 000 000 0000
    000 000 0000
    +00000000000
    0000000000
*/
export const PHONE = /^(\+([0-9]{1}))?([-( ]|( ?\())?([0-9]{3})([-( ]|(\) ?))?([0-9]{3})[- ]?([0-9]{4})$/;
export const PHONE_US = /^([-( ]|( ?\())?([0-9]{3})([-( ]|(\) ?))?([0-9]{3})[- ]?([0-9]{4})$/;
export const PHONE_INTERNATIONAL = /^(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})$/;
// Finds invalid characters '+'
export const PHONE_INVALID_CHARACTERS = /[^\d+]/g;

// (000) 000-0000
export const PHONE_PRIMARY_FORMAT = /(\d{3})(\d{3})(\d{4})/;

// +1 (000) 000-0000
export const PHONE_SECONDARY_FORMAT = /(\d{1})(\d{3})(\d{3})(\d{4})/;

export const POSTAL_CODE = /^\d{5}(-\d{4})?(?!-)$/;
export const CANADIAN_POSTAL_CODE = /(^\d{5}([ \-]\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1}[ \-]\d{1}[A-Z]{1}\d{1}$)/;

// Finds only numbers
export const ONLY_NUMBERS = /[^0-9]/g;

// Tax ID
export const TAX_ID = /^\d{2}-\d{7}$/

export const LEADING_TRAILING_SPACES = /^\s+|\s+$/g;
