const validate = (values, props) => {
  const errors = {};
  const {
    mustBeNumericValue,
    requiredValidation,
    invalidValueErrorMessage,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'name', 'cardNumber', 'expirationMonth',
    'expirationYear', 'securityCode',
  ];

  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if(values.cardNumber) {
    if(isNaN(values.cardNumber)) {
      errors.cardNumber = mustBeNumericValue;
    } else if (values.cardNumber.length < 13 || values.cardNumber.length > 16) {
      errors.cardNumber = invalidValueErrorMessage;
    }
  }

  if(values.securityCode) {
    if (isNaN(values.securityCode)) {
      errors.securityCode = mustBeNumericValue;
    } else if (values.securityCode.length > 4) {
      errors.securityCode = invalidValueErrorMessage;
    }
  }

  return errors;
};

export default validate;
