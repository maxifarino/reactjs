import * as regex from '../../../../../lib/regex';
import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    mustBeNumericValue,
    phoneErrorMessage,
    postalCodeErrorMessage,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'name', 
    'holderId',
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.CFContactPhone) {
    if (values.CFContactPhone.match(regex.PHONE)) {
      values.CFContactPhone = Utils.formatPhoneNumber(values.CFContactPhone, values.CFContactPhone);
    } else if (Utils.isInternationalPhone(values.CFContactPhone)){
      values.CFContactPhone = Utils.normalizePhoneNumber(values.CFContactPhone)
    } else {
      errors.CFContactPhone = phoneErrorMessage;
    }
  }

  return errors;
};

export default validate;
