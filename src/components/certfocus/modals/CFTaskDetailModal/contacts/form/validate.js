export default (values, props) => {
  const errors = {};
  if(!values.contactSummary) {
    errors.contactSummary = 'Required';
  }

  return errors
}