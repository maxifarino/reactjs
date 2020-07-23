const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
    mustBeNumericValue,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['insurerName'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.NAICCompanyNumber && isNaN(values.NAICCompanyNumber)) {
    errors.NAICCompanyNumber = mustBeNumericValue;
  }

  return errors;
};

export default validate;
