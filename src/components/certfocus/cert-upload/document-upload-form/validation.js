import * as regex from '../../../../lib/regex';

const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation,
    wrongEmailFormat,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const validateFilled = ['firstName', 'lastName', 'email'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if(values.email){
    values.email = values.email.replace(/ /g, '');
    if(!values.email.match(regex.EMAIL)){
      errors.email = wrongEmailFormat;
    }
  }

  if (values.files && values.files.length > 0) {    
    const { type } = values.files[0];
    const validFiles = ['application/pdf']; // 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    if (type) {
      if (!validFiles.includes(type)) {
        errors.files = 'This file has to be a pdf file';
      }
    }
  } else {
    errors.files = 'Required. This file has to be a pdf file';
  }

  return errors;
};

export default validate;