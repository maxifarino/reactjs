import * as regex from '../../../../lib/regex';

const validate = (values, props) => {
  const errors = {};
  const {
    mustBeNumericValue,
    postalCodeErrorMessage,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'companyName', 'companyLegalName', 'companyAddress',
    'companyCity', 'companyState', 'companyPostalCode',
    'companyCountry', 'companyfiles', 'accountManager',
    'agencyName', 'agencyAgentName', 'agencyAddress',
    'agencyCity', 'agencyState', 'agencyPostalCode',
    'agencyCountry', 'agencycomments',
  ];

  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if(values.companyPostalCode) {
    if(isNaN(values.companyPostalCode)) {
      errors.companyPostalCode = mustBeNumericValue;
    } else {
      let isValidPostalCode = regex.POSTAL_CODE.test(values.companyPostalCode);
      if((values.companyCountry === 'United States' && !isValidPostalCode) ||
         (values.companyCountry !== 'United States' && values.companyPostalCode.length < 3)) {
        errors.companyPostalCode = postalCodeErrorMessage;
      }
    }
  }

  if(values.agencyPostalCode) {
    if(isNaN(values.agencyPostalCode)) {
      errors.agencyPostalCode = mustBeNumericValue;
    } else {
      let isValidPostalCode = regex.POSTAL_CODE.test(values.agencyPostalCode);
      if((values.agencyCountry === 'United States' && !isValidPostalCode) ||
         (values.agencyCountry !== 'United States' && values.agencyPostalCode.length < 3)) {
        errors.agencyPostalCode = postalCodeErrorMessage;
      }
    }
  }

  return errors;
};

export default validate;
