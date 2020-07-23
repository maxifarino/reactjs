const validate = (values, props) => {
  const errors = {};
  
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