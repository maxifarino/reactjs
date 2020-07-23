import * as regex from '../../../lib/regex';

const validate = (values, props) => {
  let {
    requiredValidation,
    wrongTaxIdFormat,
    zipcodeErrorMessage,
    fieldLengthValidation,
  } = props.local.strings.register.companyProfile;

  const errors = {}
  if (!values.companyName) {
    errors.companyName = requiredValidation;
  } else if (values.companyName.length > 100) {
    errors.companyName = fieldLengthValidation;
  }

  if (!values.trade || values.trade === 19678 || values.trade === '19678') {
    errors.trade = requiredValidation;
  }

  if (!values.country) {
    errors.country = requiredValidation;
  }

  if (!values.state) {
    errors.state = requiredValidation;
  } else if (values.state.length > 100) {
    errors.state = fieldLengthValidation;
  }

  if (!values.city) {
    errors.city = requiredValidation;
  } else if (values.city.length > 150) {
    errors.city = fieldLengthValidation;
  }

  if (!values.address) {
    errors.address = requiredValidation;
  } else if (values.address.length > 150) {
    errors.address = fieldLengthValidation;
  }

  if (!values.zipcode) {
    errors.zipcode = requiredValidation;
  } else if (values.zipcode.length > 10) {
    errors.zipcode = fieldLengthValidation;
  } else if (Number(values.country) === 1) {
    // Validate USA Zipcode
    if (!regex.POSTAL_CODE.test(values.zipcode)) {
      errors.zipcode = zipcodeErrorMessage;
    }
  } else if (Number(values.country) === 34) {
    // Validate Canadian Zipcode
    if (!regex.CANADIAN_POSTAL_CODE.test(values.zipcode)) {
      errors.zipcode = zipcodeErrorMessage;
    }
  }

  if (!values.taxid) {
    errors.taxid = requiredValidation;
  } else if (values.taxid.length > 16) {
    errors.taxid = fieldLengthValidation;
  } else if (Number(values.country) === 1) {
    // If country is USA validate the tax id format
    if (!regex.TAX_ID.test(values.taxid)) {
      errors.taxid = wrongTaxIdFormat;
    }
  } else if (Number(values.country) !== 1) {
    // For any other country, just check that this is a number
    if (Number.isNaN(Number(values.taxid))) {
      errors.taxid = wrongTaxIdFormat;
    }
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
