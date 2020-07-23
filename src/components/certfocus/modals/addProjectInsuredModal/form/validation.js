const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'insured', 'status'
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  return errors;
};

export default validate;
