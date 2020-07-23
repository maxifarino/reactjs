import * as regex from '../../../../lib/regex';

const validate = (values, props) => {
  let {
    requiredValidation,
    phoneErrorMessage,
    wrongEmailFormat,
    passwordBoth
  } = props.local.strings.register.userInformation;
  
  let {
    wrongTaxIdFormat,
  } = props.local.strings.register.companyProfile;

  const errors = {}

  if (!values.firstName) {
    errors.firstName = requiredValidation;
  }

  if (!values.lastName) {
    errors.lastName = requiredValidation;
  }

  if (!values.title) {
    errors.title = requiredValidation;
  }

  if(!values.phone) {
    errors.phone = requiredValidation;
  } else {
    let isPhone = regex.PHONE.test(values.phone);
    if (!isPhone) {
      errors.phone = phoneErrorMessage;
    }
  }

  if (!values.email) {
    errors.email = requiredValidation;
  }
  else{
    if(!values.email.match(regex.EMAIL)) {
      errors.email = wrongEmailFormat;
    }
  }

  if (!values.password) {
    errors.password = requiredValidation;
  }
  if (!values.passwordagain) {
    errors.passwordagain = requiredValidation;
  }
  if(values.password !== values.passwordagain) {
    errors.password = passwordBoth;
    errors.passwordagain = passwordBoth;
  }


  if (!values.companyName) {
    errors.companyName = requiredValidation;
  }
  if (!values.trade || values.trade === 19678 || values.trade === '19678') {
    errors.trade = requiredValidation;
  }
  if (!values.address) {
    errors.address = requiredValidation;
  }
  if (!values.city) {
    errors.city = requiredValidation;
  }
  if (!values.state) {
    errors.state = requiredValidation;
  }
  if (!values.country) {
    errors.country = requiredValidation;
  } else if (values.country === 1 || values.country === "1"){
    // check tax id only when country is USA
    if (!values.taxid) {
      errors.taxid = requiredValidation;
    } else {
      if(!values.taxid.match(regex.TAX_ID)) {
        errors.taxid = wrongTaxIdFormat;
      }
    }
  }


  if (values.hcContactEmail && !values.hcContactEmail.match(regex.EMAIL)) {
    errors.hcContactEmail = wrongEmailFormat;
  }
  

  if (!values.agree) {
    errors.agree = requiredValidation;
  }

  if (parseInt(values.trade, 10) <= 0) {
    errors.trade = requiredValidation;
  }

  
  return errors;
};

export default validate;
