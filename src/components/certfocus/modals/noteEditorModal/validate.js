import moment from 'moment';

export default (values, props) => {
  const {
    requiredValidation,
    bothValidation
	} = props.local.strings.scProfile.notesTasks.modal;
	
	const isBefore = date => {
		const now = new Date();
		now.setHours(0,0,0,0);
		return date.valueOf() < now.getTime();
	};

  const errors = {};
  if(!values.title) {
    errors.title = requiredValidation;
  }
  if(!values.type) {
    errors.type = requiredValidation;
  }
  if(!values.note) {
    errors.note = requiredValidation;
  }

  // if type task
  if (values.type === 4 || values.type === '4') {
    // must have date due
    if(!values.dateDue) {
      errors.dateDue = requiredValidation;
    } 
    else {
			let checkDueDate = moment(values.dateDue, 'YYYY-MM-DD', true);
      if (! checkDueDate.isValid() || isBefore(checkDueDate)) { 
        errors.dateDue = 'Invalid date';
      }
    }

    if (!values.priority) {
      errors.priority = requiredValidation;
    }
    //and must have wither assigned user or role
    if (!values.assignTo && !values.roleId) {
      errors.assignTo = requiredValidation;
      errors.roleId = requiredValidation;
    } else if (values.assignTo && !values.roleId) {
      delete errors.roleId;
    } else if (!values.assignTo && values.roleId) {
      delete errors.assignTo;
    } else if (values.assignTo && values.roleId) {
      errors.assignTo = bothValidation;
      errors.roleId = bothValidation;
    }
  }

  return errors;
};