import * as regex from '../../../../../lib/regex';
import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    mustBeNumericValue,
    phoneErrorMessage,
    postalCodeErrorMessage,
    requiredValidation,
    wrongEmailFormat,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  /*const validateFilled = [
    'holderName', 'address1', 'city', 'state',
    'postalCode', 'country', 'intOfficeId',
    'contactName', 'contactPhone', 'accountManager', 'initialFee',
    'initialCredits', 'addlFee', 'addlCredits', 'pqInitialFee'
  ];*/
  const validateFilled = [
    'holderName', 'address1', 'city', 'state',
    'postalCode', 'country', 'contactPhone', 'contactEmail'
  ];
  validateFilled.forEach(name => {
    if (!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  // const formatCurrency = [
  //   'initialFee','initialCredits',
  //   'addlFee', 'addlCredits',
  // ];
  // formatCurrency.forEach(name => {
  //   if(values[name]) {
  //     values[name] = Utils.formatCurrencyWithDecimals(values[name]);
  //   }
  // });


  if (values.postalCode) {
    let isValidPostalCode = regex.POSTAL_CODE.test(values.postalCode);
    if ((values.country === 'United States' && !isValidPostalCode) ||
      (values.country !== 'United States' && values.postalCode.length < 3)) {
      errors.postalCode = postalCodeErrorMessage;
    }
  }

  if (values.contactPhone) {
    if (values.country === 'United States') {
      if (values.contactPhone.match(regex.PHONE_US)) {
        values.contactPhone = Utils.formatPhoneNumberUS(values.contactPhone, values.contactPhone);
      } else {
        errors.contactPhone = phoneErrorMessage;
      }
    } else {
      if (values.contactPhone.match(regex.PHONE_INTERNATIONAL) && Utils.isInternationalPhone(values.contactPhone)) {
        values.contactPhone = Utils.normalizePhoneNumber(values.contactPhone)
      } else {
        errors.contactPhone = phoneErrorMessage;
      }
    }
  }

  /*if (values.contactPhone) {
    if (values.contactPhone.match(regex.PHONE)) {
      values.contactPhone = Utils.formatPhoneNumber(values.contactPhone, values.contactPhone);
    } else if (Utils.isInternationalPhone(values.contactPhone)) {
      values.contactPhone = Utils.normalizePhoneNumber(values.contactPhone)
    } else {
      errors.contactPhone = phoneErrorMessage;
    }
  }*/

  if (values.contactEmail) {
    if (!values.contactEmail.match(regex.EMAIL)) {
      errors.contactEmail = wrongEmailFormat;
    }
  }

  if (values.intOfficeID) {
    if (isNaN(values.intOfficeID)) {
      errors.intOfficeID = mustBeNumericValue;
    } 
  }

  return errors;
};

export default validate;
