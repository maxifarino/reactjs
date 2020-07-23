const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
    mustBeNumericValue,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['name', 'order'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });
  
  if (values.order) {
    if(isNaN(values.order)) {
      errors.order = mustBeNumericValue;
    } else if (values.order < 1) {
      errors.order = 'This field has to be greater than 0';
    } else {
      if (props.tags && props.tags.list && props.tags.list.length > 0) {
        let existingValue = props.tags.list.some(f => f.CFdisplayOrder === Number(values.order));
        if (existingValue) {
          errors.order = 'This value has already been entered';
        }
      }
    }     
  }
  
  return errors;
};

export default validate;
