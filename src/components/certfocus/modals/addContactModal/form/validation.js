import * as regex from '../../../../../lib/regex';
import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    phoneErrorMessage,
    wrongEmailFormat,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'firstName', 'lastName', 'phone',
    'email', 'title',
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  const checkPhone = ['phone', 'mobile'];
  checkPhone.forEach(name => {
    if (values[name]) {
      if (values[name].match(regex.PHONE)) {
        values[name] = Utils.formatPhoneNumber(values[name], values[name]);
      } else if (Utils.isInternationalPhone(values[name])){
        values[name] = Utils.normalizePhoneNumber(values[name])
      } else {
        errors[name] = phoneErrorMessage;
      }
    }
  });

  if(values.email){
    values.email = values.email.replace(/ /g, '');
    if(!values.email.match(regex.EMAIL)){
      errors.email = wrongEmailFormat;
    }
  }

  return errors;
};

export default validate;
