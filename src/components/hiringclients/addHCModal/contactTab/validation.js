import * as regex from '../../../../lib/regex';

const validate = (values, props) => {
  const errors = {};
  const {
    passwordBoth,
    phoneErrorMessage,
    requiredValidation,
    wrongEmailFormat,
  } = props.local.strings.hiringClients.addHCModal.contactTab;

  if (values.tab === 'create') {
    if (!values.firstName) {
      errors.firstName = requiredValidation;
    }

    if (!values.lastName) {
      errors.lastName = requiredValidation;
    }

    if (!values.email) {
      errors.email = requiredValidation;
    }
    else {
      if (!values.email.match(regex.EMAIL)) {
        errors.email = wrongEmailFormat;
      }
      // else {
      //   let userExists = props.hc.hcUsers.find(user => user.Mail === values.email);
      //   if(userExists) {
      //     errors.email = userAlreadyExists;
      //   }
      // }
    }

    if (!values.phone) {
      errors.phone = requiredValidation;
    } else {
      let isPhone = regex.PHONE.test(values.phone);
      if (!isPhone) {
        errors.phone = phoneErrorMessage;
      }
    }

    if (!values.password) {
      errors.password = requiredValidation;
    }
    if (!values.retypePassword) {
      errors.retypePassword = requiredValidation;
    }
    if (values.password !== values.retypePassword) {
      errors.password = passwordBoth;
      errors.retypePassword = passwordBoth;
    }
  }
  else {
    if (!values.hcUser) {
      errors.hcUser = requiredValidation;
    }
  }

  return errors;
};

export default validate;
