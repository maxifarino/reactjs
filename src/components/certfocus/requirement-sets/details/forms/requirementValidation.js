import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'attribute', 'deficiencyText', 'conditionTypeId', 'conditionValue', 'deficiencyTypeId', 'deficiencyText',
    ...(props.fromSettingsTab && !props.requirement) ? ['coverageType', 'ruleGroupName'] : []
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.conditionValue && (Number(values.conditionTypeId) > 3)) {
    values.conditionValue = Utils.formatCurrency(values.conditionValue);
  }

  // TODO: Review this
  // avoid duplicate attributes
  // if (values.attribute && props.holderRequirementSets.rules && props.holderRequirementSets.rules.length > 0) {
  //   const exists = props.holderRequirementSets.rules
  //     .filter(f => f.RuleGroupID === props.requirement.RuleGroupID)
  //     .find(f => f.AttributeID === values.attribute.value);

  //   // TODO: add error to typeAhead field
  //   if (exists) {
  //     errors['deficiencyText'] = `${values.attribute.label} has already been selected.`;      
  //   } 
  // }

  return errors;
};

export default validate;
