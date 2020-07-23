const validate = (values, props) => {
  const errors = {};

  const {
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['name', 'code', 'deficiencyMessage', 'deficiencyCode'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  return errors;
};

export default validate;
