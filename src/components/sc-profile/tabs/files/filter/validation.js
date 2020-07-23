const validate = (values, props) => {
  const errors = {};
  const {
    dateValidation
  } = props.local.strings.scProfile.files.filter;


  if (values.dateFrom && values.dateTo && values.dateFrom > values.dateTo) {
    errors.dateFrom = dateValidation;
    }

  return errors;
};

export default validate;
