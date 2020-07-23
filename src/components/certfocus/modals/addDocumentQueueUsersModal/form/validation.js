import * as regex from '../../../../../lib/regex';
import Utils from '../../../../../lib/utils';

const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = [
    'userId',
  ];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  return errors;
};

export default validate;
