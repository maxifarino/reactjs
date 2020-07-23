import moment from "moment";

const isBefore = date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date.valueOf() < now.getTime();
};

export default (values, props) => {

  const {requiredValidation, atLeastOneAssigned, atLeastOneRelated, invalidDueDate} = props.locale;
  const errors = {};
  let groupErrors = {};

  const requiredFields = ['tasksPriorityId', 'typeId', 'dateDue', 'description'];

  requiredFields.forEach(name => {
    if(!values[name]) {
      errors[name] = requiredValidation;
    }
  });

  let checkDueDate = moment(values['dateDue'], 'YYYY-MM-DD', true);
  if (!checkDueDate.isValid() || isBefore(checkDueDate)) {
    errors['dateDue'] = invalidDueDate;
  }

  if (!values['departmentId'] && !values['assignedToRoleId'] && !values['assignedToUserId']) {
    errors['departmentId'] = atLeastOneAssigned;
    errors['assignedToRoleId'] = atLeastOneAssigned;
    errors['assignedToUserId'] = atLeastOneAssigned;
  }

  if (!values['holder'] && !values['insured']) {
    errors['holder'] = atLeastOneRelated;
    errors['insured'] = atLeastOneRelated;
  }

  return errors;
}