const validate = (values, props) => {  
  const {
    requiredValidation,
  } = props.local.strings.processing.dataEntry;
  const errors = {};
  
  const validateFilled = ['dateCertificate', 'agency'];

  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (!values.coverages || values.coverages.length === 0) {
    errors.coverages = { _error: 'At least one coverage must be entered' };
  } else {
    const coveragesArrayErrors = [];
    values.coverages.forEach((coverage, coverageIndex) => {
      const coverageErrors = {};
      // if (!coverage || !coverage.insurer) {
      //   coverageErrors.insurer = requiredValidation;
      //   coveragesArrayErrors[coverageIndex] = coverageErrors;
      // }
      if (!coverage || !coverage.ruleGroupId) {
        coverageErrors.ruleGroupId = requiredValidation;
        coveragesArrayErrors[coverageIndex] = coverageErrors;
      }
      if (!coverage || !coverage.policy) {
        coverageErrors.policy = requiredValidation;
        coveragesArrayErrors[coverageIndex] = coverageErrors;
      }
      if (!coverage || !coverage.effectiveDate) {
        coverageErrors.effectiveDate = requiredValidation;
        coveragesArrayErrors[coverageIndex] = coverageErrors;
      }
      if (!coverage || !coverage.expirationDate) {
        coverageErrors.expirationDate = requiredValidation;
        coveragesArrayErrors[coverageIndex] = coverageErrors;
      }

      // if (coverage && coverage.attributes && coverage.attributes.length) {
      //   const attributesArrayErrors = [];
      //   coverage.attributes.forEach((attribute, attrIndex) => {
      //     const attributeErrors = {};
      //     if (!attribute || !attribute.value) {
      //       attributeErrors.value = requiredValidation;
      //       attributesArrayErrors[attrIndex] = attributeErrors;
      //     }
      //   });

      //   if (attributesArrayErrors.length) {
      //     coverageErrors.attributes = attributesArrayErrors;
      //     coveragesArrayErrors[coverageIndex] = coverageErrors;
      //   }
      // }
    });

    if (coveragesArrayErrors.length) {
      errors.coverages = coveragesArrayErrors;
    }
  }
  //console.log('validate err: ', errors);  
  return errors;
};

export default validate;
