import * as regex from '../../../../lib/regex';

const validate = (values, props) => {
  const errors = {};
  const {
    fileTypeValidation,
    mustBeNumericValue,
    phoneErrorMessage,
    postalCodeErrorMessage,
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  if(!values.companyLogo) {
    if(!props.profile || !props.profile.logo ) {
      errors.companyLogo = requiredValidation;
    }
  }
  else {
    const {type} = values.companyLogo;
    if(type){
      if(
        !(
          type === "image/jpeg" ||
          type === "image/png" ||
          type === "image/gif" ||
          type === "image/svg+xml"
        )
      ) {
        errors.companyLogo = fileTypeValidation;
      }
    }
  }

  if(!values.companyName) {
    errors.companyName = requiredValidation;
  }

  if(!values.companyAddress1) {
    errors.companyAddress1 = requiredValidation;
  }

  if(!values.city) {
    errors.city = requiredValidation;
  }

  if(!values.state) {
    errors.state = requiredValidation;
  }

  if(!values.postalCode) {
    errors.postalCode = requiredValidation;
  }
  else {
    if(isNaN(values.postalCode)) {
      errors.postalCode = mustBeNumericValue;
    } else {
      let isValidPostalCode = regex.POSTAL_CODE.test(values.postalCode);
      if(!isValidPostalCode) {
        errors.postalCode = postalCodeErrorMessage;
      }
    }
  }

  if(!values.phone) {
    errors.phone = requiredValidation;
  } else {
    let isPhone = regex.PHONE.test(values.phone);
    if (!isPhone) {
      errors.phone = phoneErrorMessage;
    }
  }

  if(values.phone2) {
    let isPhone = regex.PHONE.test(values.phone2);
    if (!isPhone) {
      errors.phone2 = phoneErrorMessage;
    }
  }


  const entityOption = parseInt(values.entityType, 10);
  const parentHCOption = parseInt(values.parentHC, 10);

  if(entityOption < 0) {
    errors.entityType = requiredValidation;
  }
  else {
    if(entityOption === 1 && (parentHCOption === 0 || isNaN(parentHCOption))) {
      errors.parentHC = requiredValidation;
    }
  }

  if(!values.subdomain) {
    errors.subdomain = requiredValidation;
  }

  return errors;
};

export default validate;
