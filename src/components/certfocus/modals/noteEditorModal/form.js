import React, { Component } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import Utils from '../../../../lib/utils';

import * as usersActions from '../../../users/actions';

import validate from './validate';

class NoteForm extends Component {
  componentDidMount() {
    const { note, fromTasks } = this.props;

    if (note) {
      this.props.dispatch(change('HolderNoteForm', 'title', note.name || ""));
      this.props.dispatch(change('HolderNoteForm', 'type', note.typeId || ""));
      this.props.dispatch(change('HolderNoteForm', 'assignTo', note.assignedToUserId || ""));
      this.props.dispatch(change('HolderNoteForm', 'roleId', note.assignedToRoleId || ""));
      this.props.dispatch(change('HolderNoteForm', 'priority', note.tasksPriorityId || ""));
      this.props.dispatch(change('HolderNoteForm', 'dateDue', Utils.getInputDateFromDateString(note.dateDue) || ""));
      this.props.dispatch(change('HolderNoteForm', 'note', note.description || ""));
      this.props.dispatch(change('HolderNoteForm', 'contactTypeId', note.ContactTypeId || ""));
    } else {
      if (fromTasks) {
        this.props.dispatch(change('HolderNoteForm', 'type', 4));
      } else {
        this.props.dispatch(change('HolderNoteForm', 'type', 3));
      }
    }
  }

  componentWillMount() {
    this.defineQueryAndFetchUsers();
  }

  defineQueryAndFetchUsers = () => {
    const { fromHolderTab, holderId, fromInsuredTab, insuredId } = this.props;

    const query = Utils.getFetchQuery('name', 1, 'ASC');

    query.withoutPagination = true;

    if (fromHolderTab) {
      query.hiringClientId = holderId;
    } else if (fromInsuredTab) {
      query.subcontractorId = insuredId;
    }

    query.orderBy = 'firstName, lastName';
    query.associatedOnly = 0;

    this.props.actions.fetchUsers(query);
  }

  fixMissingOptions (list, checkValue, label) {
    const index = _.findIndex(list, function(o) { return o.value.toString() === checkValue.toString() });
    if (index === -1){
      // the option is missing, lets add it
      list.push({ value: checkValue, label });
    }
  }

  render() {    
    const { handleSubmit, note, dismiss, fromTasks, defaultValue } = this.props;

    const {
      labelNoteTitle,
      labelTaskTitle,
      labelAssign,
      labelRoleAssign,
      labelPriority,
      labelDateDue,
      labelContactType,
      labelDescription,
      assignedToPlaceholder,
      assignedToRolePlaceholder,
      contactTypePlaceholder,
      priorityPlaceholder,
      buttonCreateTask,
      buttonCreateNote,
      buttonEdit,
      buttonCancel
    } = this.props.local.strings.scProfile.notesTasks.modal;

    const buttonText = note ? buttonEdit : (fromTasks ? buttonCreateTask : buttonCreateNote);

    // combo lists
    const {
      contactsTypesPossibleValues,
      taskPriorityPossibleValues,
      // rolesPossibleValues, CFRoles
      cfRolesPossibleValues,
    } = this.props.notesTasks;

    const usersList = Utils.sortByPQassociation(this.props.users.nPQlist);
    const typeOptionsList = Utils.getOptionsList(contactTypePlaceholder, contactsTypesPossibleValues, 'type', 'id', 'type');
    const assignOptionsList = Utils.getOptionsList(assignedToPlaceholder, usersList, 'name', 'id');
    const assignCFRoleOptionsList = Utils.getOptionsList(assignedToRolePlaceholder, cfRolesPossibleValues, 'name', 'id', 'name');
    const priorityOptionsList = Utils.getOptionsList(priorityPlaceholder, taskPriorityPossibleValues, 'name', 'id', 'name');

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
                  {fromTasks ? labelTaskTitle : labelNoteTitle}:
                </label>
                <Field
                  name="title"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>

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

            <div className="col-md-6 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-left">
                <label htmlFor="contactTypeId">
                  {labelContactType}:
                </label>
                <div className="select-wrapper">
                  <Field
                    name="contactTypeId"
                    component={renderSelect}
                    defaultValue={defaultValue}
                    options={typeOptionsList}
                  />
                </div>
              </div>
            </div>

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

            <div className="col-md-6 col-sm-12 no-padd">
              {!_.isEmpty(cfRolesPossibleValues) && (
              <div className="admin-form-field-wrapper pad-right">
                <label htmlFor="roleId">
                  {labelRoleAssign}:
                </label>
                <div className="select-wrapper">
                  <Field
                    name="roleId"
                    component={renderSelect}
                    options={assignCFRoleOptionsList}
                  />
                </div>
              </div>
            )}
            </div>

            <div className="col-md-12 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label htmlFor="note">
                  {labelDescription}:
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
          {this.props.notesTasks.savingTaskError}
          <div>
            <a className="bg-sky-blue-gradient bn" onClick={dismiss}>{buttonCancel}</a>
            <button className="bg-sky-blue-gradient bn" type="submit">{buttonText}</button>
          </div>
        </div>

      </form>
    );
  }
}

NoteForm = reduxForm({
  form: 'HolderNoteForm',
  validate,
})(NoteForm);

const mapStateToProps = (state, ownProps) => ({
  users: state.users,
  notesTasks: state.CFTasks,
  local: state.localization,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(usersActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteForm);
