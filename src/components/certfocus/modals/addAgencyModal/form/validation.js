import * as regex from '../../../../../lib/regex';
import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
    mustBeNumericValue,
    phoneErrorMessage,
    wrongEmailFormat,
    postalCodeErrorMessage,
    mainPhoneErrorMessage,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'name',
    'address',
    'city',
    'country',
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.mainPhone) {
    if (values.country === 'United States') {
      if (values.mainPhone.match(regex.PHONE_US)) {
        values.mainPhone = Utils.formatPhoneNumberUS(values.mainPhone, values.mainPhone);
      } else {
        errors.mainPhone = mainPhoneErrorMessage;
      }
    } else {
      if (values.mainPhone.match(regex.PHONE_INTERNATIONAL) && Utils.isInternationalPhone(values.mainPhone)) {
        values.mainPhone = Utils.normalizePhoneNumber(values.mainPhone)
      } else {
        errors.mainPhone = mainPhoneErrorMessage;
      }
    }
  }

  if (values.mainEmail) {
    if(!values.mainEmail.match(regex.EMAIL)) {
      errors.mainEmail = wrongEmailFormat;
    }
  }

  return errors;
};

export default validate;
