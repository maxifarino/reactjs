export default (values, props) => {
  const errors = {};
  const {required} = props.locale.errors;
  if(!values.comment) {
    errors.comment = required;
  }

  if (values.action === 'reassign' && !values.toUser) {
      errors.toUser = required;
  }

  if (values.action === 'postpone' && !values.toDate) {
    errors.toDate = required;
  }

  return errors
}