import * as regex from '../../../lib/regex';
import Utils from './../../../lib/utils';

const validate = (values, props) => {
  let {
    requiredValidation,
    wrongEmailFormat,
    passwordBoth,
  } = props.local.strings.users.addUser;

  const isEdit = !!props.currentEditingUser || !!props.users.currentEditingUser;
  const errors = {};

  if (!isEdit) {
    if (props.pqRole && props.cfRole) {
      if (!values.role && !values.cfRole) {
        errors.role = requiredValidation;
        errors.cfRole = requiredValidation;
      }
    } else if (props.pqRole && !props.cfRole) {
      if (!values.role) {
        errors.role = requiredValidation;
      }
    } else if (props.cfRole && !props.pqRole) {
      if (!values.cfRole) {
        errors.role = requiredValidation;
      }
    }

    if (props.fromHolderTab && errors.role) delete errors.role;

    if (!values.firstName) {
      errors.firstName = requiredValidation;
    }
  
    if (!values.lastName) {
      errors.lastName = requiredValidation;
    }
    if (!values.password) {
      errors.password = requiredValidation;
    }
    if (!values.passwordagain) {
      errors.passwordagain = requiredValidation;
    }
  }

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
  }

  if (values.password !== values.passwordagain) {
    errors.password = passwordBoth;
    errors.passwordagain = passwordBoth;
  }

  return errors;
};

export default validate;
