const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['name', 'type', 'order'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if(Number(values.type) === 2){
    if(!values.values) {
      errors.values = requiredValidation;
    } else if (!values.values.trim()) {
      errors.values = requiredValidation;
    }
  }

  return errors;
};

export default validate;
