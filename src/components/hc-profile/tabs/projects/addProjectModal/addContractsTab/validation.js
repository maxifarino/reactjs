import _ from 'lodash'

const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation
  } = props.local.strings.hcProfile.projects.addProjectModal.AddContractsTab;

  if (values.rows && values.rows.length)  {
    const rowsArrayErrors = []

    values.rows.forEach((row, rowIndex) => {
      const rowErrors = {}

      if (!_.isEmpty(row)) {
        if (!row.subcontractorId) {
          rowErrors.subcontractorId = requiredValidation
          rowsArrayErrors[rowIndex] = rowErrors
        }

        if (!row.contractNumber) {
          rowErrors.contractNumber = requiredValidation
          rowsArrayErrors[rowIndex] = rowErrors
        }

        if (!row.contractAmount) {
          rowErrors.contractAmount = requiredValidation
          rowsArrayErrors[rowIndex] = rowErrors
        }

        if (!row.startDate) {
          rowErrors.startDate = requiredValidation
          rowsArrayErrors[rowIndex] = rowErrors
        }
      }
    });

    errors.rows = rowsArrayErrors;
  }

  return errors;
};

export default validate;
