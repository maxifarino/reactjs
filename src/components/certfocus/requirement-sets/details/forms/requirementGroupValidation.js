const validate = (values, props) => {
  const errors = {};  
  const {
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['ruleGroupName', 'coverageType'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  // avoid duplicate ruleGroups
  if (props.holderRequirementSets.rulesGroups && props.holderRequirementSets.rulesGroups.length > 0) {
    if (props.holderRequirementSets.rulesGroups.find(f => f.RuleGroupName === values.ruleGroupName)) {
      errors['ruleGroupName'] = `${values.ruleGroupName} has already been selected.`;      
    } 
  } 

  return errors;
};

export default validate;
