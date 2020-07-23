const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
  } = props.local.strings.scProfile.files.addModal;

  if (!values.documentFile) {
    errors.documentFile = requiredValidation;
  }

  if (!values.description) {
    errors.description = requiredValidation;
  }

  return errors;
};

export default validate;
