import * as regex from '../../../../../../lib/regex';

const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
    phoneErrorMessage,
    wrongEmailFormat,
  } = props.local.strings.scProfile.references.modal;

  if (!values.typeId) {
    errors.typeId = requiredValidation;
  }

  if (!values.companyName) {
    errors.companyName = requiredValidation;
  }

  if (!values.savedFormId) {
    errors.savedFormId = requiredValidation;
  }

  if (!values.contactName) {
    errors.contactName = requiredValidation;
  }

  if (!values.contactEmail) {
    errors.contactEmail = requiredValidation;
  }

  if (!values.contactEmail) {
    errors.contactEmail = requiredValidation;
  }
  else if (!values.contactEmail.match(regex.EMAIL)) {
      errors.contactEmail = wrongEmailFormat;
  }

  if (!values.contactPhone) {
    errors.contactPhone = requiredValidation;
  } else {
    let isPhone = regex.PHONE.test(values.contactPhone);
    if (!isPhone) {
      errors.contactPhone = phoneErrorMessage;
    }
  }

  return errors;
};

export default validate;
