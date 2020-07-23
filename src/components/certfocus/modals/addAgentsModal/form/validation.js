import * as regex from '../../../../../lib/regex';
import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
    phoneErrorMessage,
    wrongEmailFormat,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'firstName',
    'lastName',
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.mobileNumber) {
    if (values.mobileNumber.match(regex.PHONE)) {
      values.mobileNumber = Utils.formatPhoneNumber(values.mobileNumber, values.mobileNumber);
    } else if (Utils.isInternationalPhone(values.mobileNumber)){
      values.mobileNumber = Utils.normalizePhoneNumber(values.mobileNumber)
    } else {
      errors.mobileNumber = phoneErrorMessage;
    }
  }

  if (values.phoneNumber) {
    if (values.phoneNumber.match(regex.PHONE)) {
      values.phoneNumber = Utils.formatPhoneNumber(values.phoneNumber, values.phoneNumber);
    } else if (Utils.isInternationalPhone(values.phoneNumber)){
      values.phoneNumber = Utils.normalizePhoneNumber(values.phoneNumber)
    } else {
      errors.phoneNumber = phoneErrorMessage;
    }
  }

  if (values.emailAddress) {
    if(!values.emailAddress.match(regex.EMAIL)) {
      errors.emailAddress = wrongEmailFormat;
    }
  }

  return errors;
};

export default validate;
