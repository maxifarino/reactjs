const validate = (values, props) => {  
  const errors = {};
  const {
    mustBeNumericValue,
    phoneErrorMessage,
    postalCodeErrorMessage,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'subcontractorContactName',
    'subcontractorContactPhone',
    'subcontractorContactEmail',
    'subcontractorName',
    'primaryTrade',
    'subcontractorFullAddress',
    'subcontractorPhone',
    'subcontractorTaxId'
  ];
  validateFilled.forEach(name => {        
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });
    
  return errors;
};

export default validate;