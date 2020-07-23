import * as regex from '../../../../lib/regex';

const validate = (values, props) => {
  const errors = {};
  const {
    phoneErrorMessage,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  if (!values.contactFullName) {
    errors.contactFullName = requiredValidation;
  }

  if (!values.contactEmail) {
    errors.contactEmail = requiredValidation;
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
