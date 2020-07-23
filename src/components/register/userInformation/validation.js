import * as regex from '../../../lib/regex';

const validate = (values, props) => {
  let {
    requiredValidation,
    phoneErrorMessage,
    wrongEmailFormat,
    passwordBoth,
    fieldLengthValidation,
  } = props.local.strings.register.userInformation;

  const errors = {};

  if (!values.firstName) {
    errors.firstName = requiredValidation;
  } else if (values.firstName.length > 60) {
    errors.firstName = fieldLengthValidation;
  }

  if (!values.lastName) {
    errors.lastName = requiredValidation;
  } else if (values.lastName.length > 60) {
    errors.lastName = fieldLengthValidation;
  }

  if (!values.title) {
    errors.title = requiredValidation;
  }

  if (!values.phone) {
    errors.phone = requiredValidation;
  } else {
    let isPhone = regex.PHONE.test(values.phone) || regex.PHONE_INTERNATIONAL.test(values.phone);

    if (!isPhone) {
      errors.phone = phoneErrorMessage;
    }
  }

  if (values.cellphone) {
    if (!regex.PHONE.test(values.cellphone) && !regex.PHONE_INTERNATIONAL.test(values.cellphone)) {
      errors.cellphone = phoneErrorMessage;
    }
  }

  if (!values.email) {
    errors.email = requiredValidation;
  } else {
    if(!regex.EMAIL.test(values.email)) {
      errors.email = wrongEmailFormat;
    } else if (values.email.length > 80) {
      errors.email = fieldLengthValidation;
    }
  }

  if (!values.password) {
    errors.password = requiredValidation;
  } else if (values.password.length > 80) {
    errors.password = fieldLengthValidation;
  }

  if (!values.passwordagain) {
    errors.passwordagain = requiredValidation;
  } else if(values.password !== values.passwordagain) {
    errors.passwordagain = passwordBoth;
  }

  if (parseInt(values.title, 10) <= 0) {
    errors.title = requiredValidation;
  }

  return errors;
};

export default validate;
