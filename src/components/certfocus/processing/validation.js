const validate = (values, props) => {
  const errors = {};

  const {
    requiredValidation,
  } = props.local.strings.hiringClients.addHCModal.companyInfoTab;

  const {
    fileTypeValidation,
  } = props.local.strings.processing.dataEntry;

  const validateFilled = ['holder', 'project', 'documentFile'];
  validateFilled.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  if (values.documentFile) {
    const { type } = values.documentFile;
    const validFiles = ['application/pdf']; // 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (type) {
      if (!validFiles.includes(type)) {
        errors.documentFile = fileTypeValidation;
      }
    }
  }

  return errors;
};

export default validate;
