const validate = (values, props) => {
  const { CFRoleId } = props.login.profile;
  const availableRoles = [8, 12, 13, 14];
  const disabledByRole = (availableRoles.find(e => e === Number(CFRoleId))) ? false : true;
  const {
    requiredValidation,
    mustBeNumericValue,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;
  const errors = {};
  
  const validateFilled = [
    'holderId', 
    'projectId',
    'insuredId',
    'documentTypeId',
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });
  
  // Validate by certificate / another doc type
  if (Number(values.documentTypeId) === 1) {    
    if (disabledByRole) {
      if (!values.queueId) {
        errors.queueId = requiredValidation;
      }
    }
  }

  return errors;
};

export default validate;
