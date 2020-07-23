import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as usersActions from '../../../users/actions';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import Utils from '../../../../lib/utils';
import moment from 'moment';

const isBefore = date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date.valueOf() < now.getTime();
};

const validate = (values, props) => {
  const {
    requiredValidation,
    bothValidation,
  } = props.local.strings.scProfile.notesTasks.modal;

  const errors = {};
  if (!values.title) {
    errors.title = requiredValidation;
  }
  if (!values.type) {
    errors.type = requiredValidation;
  }
  if (!values.note) {
    errors.note = requiredValidation;
  }

  // if type task
  if (values.type === 2 || values.type === '2') {
    // must have date due
    if (!values.dateDue) {
      errors.dateDue = requiredValidation;
    }
    else {
      let checkDueDate = moment(values.dateDue, 'YYYY-MM-DD', true);
      if (!checkDueDate.isValid() || isBefore(checkDueDate)) {
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

class NoteForm extends React.Component {
  constructor(props) {
    super(props);

    const { note } = this.props;
    if (note) {
      props.dispatch(change('NoteForm', 'title', note.name || ""));
      props.dispatch(change('NoteForm', 'type', note.typeId || ""));
      props.dispatch(change('NoteForm', 'assignTo', note.assignedToUserId || ""));
      props.dispatch(change('NoteForm', 'roleId', note.assignedToRoleId || ""));
      props.dispatch(change('NoteForm', 'priority', note.tasksPriorityId || ""));
      props.dispatch(change('NoteForm', 'dateDue', Utils.getInputDateFromDateString(note.dateDue) || ""));
      props.dispatch(change('NoteForm', 'note', note.description || ""));
      props.dispatch(change('NoteForm', 'contactTypeId', note.ContactTypeId || ""));
    }

  }



  defineQueryAndFetchUsers = () => {
    const query = Utils.getFetchQuery('name', 1, 'ASC')
    const id = this.props.fromHCtab ? this.props.hcId : (this.props.fromSCtab ? this.props.scId : 'no id was passed in')

    query.withoutPagination = true

    if (this.props.fromHCtab) {
      query.hiringClientId = id
    } else if (this.props.fromSCtab) {
      query.subcontractorId = id
    }

    if (this.props.fromHCtab || this.props.fromSCtab) {
      query.orderBy = 'firstName, lastName'
    }

    query.associatedOnly = 0

    this.props.actions.fetchUsers(query);
  }



  componentWillMount() {
    if (!this.props.fromFinancialTab) {
      this.defineQueryAndFetchUsers()
    }
  }

  fixMissingOptions(list, checkValue, label) {
    const index = _.findIndex(list, function (o) { return o.value.toString() === checkValue.toString() });
    if (index === -1) {
      // the option is missing, lets add it
      list.push({ value: checkValue, label });
    }
  }

  render() {
    const { handleSubmit, note, dismiss } = this.props;

    const {
      labelTitle,
      labelAssign,
      labelRoleAssign,
      labelPriority,
      labelDateDue,
      labelType,
      labelNote,
      labelContactType,
      assignedToPlaceholder,
      assignedToRolePlaceholder,
      contactTypePlaceholder,
      priorityPlaceholder,
      typePlaceholder,
      buttonCreate,
      buttonEdit,
      buttonCancel
    } = this.props.local.strings.scProfile.notesTasks.modal;

    const buttonText = note ? buttonEdit : buttonCreate;

    // combo lists
   
    const usersList = Utils.sortByPQassociation(this.props.users.nPQlist);
    const {
      taskTypesPossibleValues,
      taskPriorityPossibleValues,
      contactsTypesPossibleValues,
      rolesPossibleValues,
      cfRolesPossibleValues
    } = this.props.notesTasks;

    const typeOptionsList = Utils.getOptionsList(typePlaceholder, taskTypesPossibleValues, 'type', 'id', 'type');
    const assignOptionsList = Utils.getOptionsList(assignedToPlaceholder, usersList, 'name', 'id', 'name');
    const contactsTypesOptionsList = Utils.getOptionsList(contactTypePlaceholder, contactsTypesPossibleValues, 'type', 'id', 'type');
    const assignRoleOptionsList = Utils.getOptionsList(assignedToRolePlaceholder, rolesPossibleValues, 'name', 'id', 'name');
    const assignCFRoleOptionsList = Utils.getOptionsList(assignedToRolePlaceholder, cfRolesPossibleValues, 'name', 'id', 'name');
    const priorityOptionsList = Utils.getOptionsList(priorityPlaceholder, taskPriorityPossibleValues, 'name', 'id', 'name');
    
    assignCFRoleOptionsList.splice(0, 1);
    const assignRolesOptionsList = [...assignRoleOptionsList, ...assignCFRoleOptionsList];
    

    //fix missing options
    if (note && note.assignedToUserId) {
      this.fixMissingOptions(assignOptionsList, note.assignedToUserId, note.assignedToUser);
    }

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form noteForm">
        <div className="container-fluid filter-fields">
          <div className="row">

            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label htmlFor="title">
                  {labelTitle}:
                </label>
                <Field
                  name="title"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>

            {
              !this.props.fromFinancialTab && (
                <div className="col-md-6 col-sm-12 no-padd">
                  <div className="admin-form-field-wrapper pad-right">
                    <label htmlFor="priority">
                      {labelPriority}:
                  </label>
                    <div className="select-wrapper">
                      <Field
                        name="priority"
                        component={renderSelect}
                        options={priorityOptionsList}
                      />
                    </div>
                  </div>
                </div>
              )}

            {
              !this.props.fromFinancialTab && (
                <div className="col-md-6 col-sm-12 no-padd">
                  <div className="admin-form-field-wrapper pad-left">
                    <label htmlFor="type">
                      {labelType}:
                  </label>
                    <div className="select-wrapper">
                      <Field
                        name="type"
                        component={renderSelect}
                        options={typeOptionsList}
                      />
                    </div>
                  </div>
                </div>
              )}

            {
              !this.props.fromFinancialTab && (
                <div className="col-md-6 col-sm-12 no-padd">
                  <div className="admin-form-field-wrapper pad-right">
                    <label htmlFor="dateDue">
                      {labelDateDue}:
                  </label>
                    <Field
                      name="dateDue"
                      type="date"
                      component={renderField}
                    />
                  </div>
                </div>
              )}

            {
              !this.props.fromFinancialTab && (
                <div className="col-md-6 col-sm-12 no-padd">
                  <div className="admin-form-field-wrapper pad-left">
                    <label htmlFor="assignTo">
                      {labelAssign}:
                  </label>
                    <div className="select-wrapper">
                      <Field
                        name="assignTo"
                        component={renderSelect}
                        options={assignOptionsList}
                      />
                    </div>
                  </div>
                </div>
              )}

            {
              !this.props.fromFinancialTab && (
                <div className="col-md-6 col-sm-12 no-padd">
                  <div className="admin-form-field-wrapper pad-right">
                    <label htmlFor="assignTo">
                      {labelContactType}:
                  </label>
                    <div className="select-wrapper">
                      <Field
                        name="contactTypeId"
                        component={renderSelect}
                        options={contactsTypesOptionsList}
                      />
                    </div>
                  </div>
                </div>
              )}

            {
              !this.props.fromFinancialTab && (
                <div className="col-md-6 col-sm-12 no-padd">
                  {!_.isEmpty(rolesPossibleValues) && (
                    <div className="admin-form-field-wrapper pad-left">
                      <label htmlFor="assignTo">
                        {labelRoleAssign}:
                  </label>
                      <div className="select-wrapper">
                        <Field
                          name="roleId"
                          component={renderSelect}
                          options={assignRolesOptionsList}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            <div className="col-md-12 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label htmlFor="note">
                  {labelNote}:
                </label>
                <Field
                  name="note"
                  type="textarea"
                  component={renderField}
                />
              </div>
            </div>


          </div>
        </div>

        <div className="noteEditorButtons">
          <a className="bg-sky-blue-gradient bn" onClick={dismiss}>{buttonCancel}</a>
          <button className="bg-sky-blue-gradient bn" type="submit">{buttonText}</button>
        </div>

      </form>
    );
  }
}

NoteForm = reduxForm({
  form: 'NoteForm',
  validate
})(NoteForm);

const mapStateToProps = (state) => ({
  users: state.users,
  scProfile: state.SCProfile,
  notesTasks: state.notesTasks,
  local: state.localization,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(usersActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteForm);
