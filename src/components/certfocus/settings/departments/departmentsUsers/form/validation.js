const validate = (values, props) => {
  const errors = {};

  const {
    requiredValidation,
  } = props.locale.form;

  const validateFilled = [
    'userId',
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });
  return errors;
};

export default validate;