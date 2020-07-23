const validate = (values, props) => {
  const errors = {};
  const {
    requiredValidation
  } = props.local.strings.hcProfile.projects.addProjectModal.projectTab;

  if (!values.projectName) {
    errors.projectName = requiredValidation;
  }

  if (!values.projectStatus) {
    errors.projectStatus = requiredValidation;
  }

  return errors;
};

export default validate;
