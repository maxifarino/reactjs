const validate = (values, props) => {
  const {
    requiredValidation,
  } = props.local.strings.projectUsers.addUser;

  const errors = {};

  if (!values.user) {
    errors.user = requiredValidation;
  }

  return errors;
};

export default validate;
