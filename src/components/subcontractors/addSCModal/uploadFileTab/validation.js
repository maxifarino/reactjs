const validate = (values, props) => {
  const { 
    dataFyleIncorrect,
    dataFyleNotUploaded
  } = props.local.strings.subcontractors.addSCModal.validation;

  const { csvSCDataFile } = values;
  let errors = {
    csvSCDataFile: ''
  };

  if(csvSCDataFile) {
    const splitedFileName = values.csvSCDataFile.name.split('.');
    const extension = splitedFileName[splitedFileName.length - 1];
    if(
      !(
        extension === 'xls' || 
        extension === 'xlsx' || 
        extension === 'csv'
      )
    ) {
      errors.csvSCDataFile = dataFyleIncorrect;
    }
  } 
  else {
    errors.csvSCDataFile = dataFyleNotUploaded;
  }

  return errors;
};

export default validate;