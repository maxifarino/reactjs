const validate = (values, props) => {
  console.log('form validation: ', props.locale);
  const errors = {};
  const {requiredValidation} = props.locale.form;
  const validateFilled = ['name'];

  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  return errors;
};

export default validate;