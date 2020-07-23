import * as regex from '../../../../../lib/regex';
import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    mustBeNumericValue,
    phoneErrorMessage,
    wrongEmailFormat,
    wrongTaxIdFormat,
    postalCodeErrorMessage,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'insuredName', 
    'address1', 
    'city', 
    'state', 
    'postalCode', 
    'country',
    'contactName',
    'contactPhone',
    'contactFax', 
    'contactEmail', 
    'countryId',
    'holderId',
  ];
  validateFilled.forEach(name => {
    if (!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  const checkNumber = ['taxId'];
  checkNumber.forEach(name => {

    if (values.countryId !== 1 || values.countryId !== "1") {
      if (values[name] && isNaN(values[name])) {
        errors[name] = mustBeNumericValue;
      }
    } else if (values.countryId === 1 || values.countryId === "1") {
      // check tax id only when country is USA
      if (!values[name]) {
        errors[name] = requiredValidation;
      } else {
        if (!values[name].match(regex.TAX_ID)) {
          errors[name] = 'Wrong Tax ID format';
        }
      }
    }
  });

  const checkPhone = ['contactPhone', 'contactFax'];
  checkPhone.forEach(name => {
    if (values[name]) {
      if (values[name].match(regex.PHONE)) {
        values[name] = Utils.formatPhoneNumber(values[name], values[name]);
      } else if (Utils.isInternationalPhone(values[name])) {
        values[name] = Utils.normalizePhoneNumber(values[name])
      } else {
        errors[name] = phoneErrorMessage;
      }
    }
  });

  if (values.contactEmail) {
    values.contactEmail = values.contactEmail.replace(/ /g, '');
    if (!values.contactEmail.match(regex.EMAIL)) {
      errors.contactEmail = wrongEmailFormat;
    }
  }

  return errors;
};

export default validate;