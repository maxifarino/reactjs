const validate = (values, props) => {
  const errors = {};

  const {
    mustBeNumericValue,
    requiredValidation,
    invalidValueErrorMessage
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['documentTypeName'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.expireAmount && isNaN(values.expireAmount)) {
    errors.expireAmount = mustBeNumericValue;
  }

  if (values.expirePeriod === 'Months' && values.expireAmount >= 12) {
    errors.expireAmount = invalidValueErrorMessage;
  }

  return errors;
};

export default validate;
