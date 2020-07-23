const validate = (values, props) => {
  const errors = {};

  const {
    mustBeNumericValue,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['coverage', 'displayOrder'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.displayOrder && isNaN(values.displayOrder)) {
    errors.displayOrder = mustBeNumericValue;
  }

  return errors;
};

export default validate;
