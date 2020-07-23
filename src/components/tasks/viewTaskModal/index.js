import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';

import * as actions from '../../sc-profile/tabs/notesTasks/actions';
import Utils from '../../../lib/utils';

import './viewTaskModal.css';

class ViewTaskModal extends React.Component {
  assignTask() {
    const {
      task,
      login,
      actions,
      closeAndRefresh
    } = this.props;

    const payload = {
      taskId: task.id,
      assignedToUserId: login.profile.Id,
      assignedToRoleId: null,
      dateDue: task.dateDue,
      name: task.name,
      description: task.description
    };

    actions.saveNoteTask(payload);
    closeAndRefresh();
  }

  completeTask() {
    const {
      task,
      login,
      actions,
      closeAndRefresh
    } = this.props;

    const payload = {
      taskId: task.id,
      assignedToUserId: login.profile.Id,
      dateDue: task.dateDue,
      name: task.name,
      description: task.description,
      completed: true
    };

    actions.saveNoteTask(payload);
    closeAndRefresh();
  }

  render() {
    const {
      createdBy,
      assignedTo,
      urgency,
      dueDate,
      contactTypeLabel,
      taskDescription,
      assignButton,
      completeButton,
      close
    } = this.props.local.strings.tasks.viewTaskModal;

    const {
      name,
      enteredByUser,
      assignedToUser,
      assignedToRole,
      tasksPriority,
      dateDue,
      description,
      contactType,
      typeId,
      status
    } = this.props.task

    const formattedDateDue = dateDue ? Utils.getFormattedDate(dateDue, true) : null;

    return (
      <div className="view-task-modal">
        <header className="view-task-modal-header">{name}</header>

        <div className="view-task-content container-fluid filter-fields">
          <div className="row first-row">

            <div className="col-md-3 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-right">
                <div className="view-task-label">{createdBy}:</div>
                <div className="view-task-text normalFontWeight">{enteredByUser}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-right">
                <div className="view-task-label">{assignedTo}:</div>
                <div className="view-task-text normalFontWeight">{assignedToUser || assignedToRole}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-right">
                <div className="view-task-label">{urgency}:</div>
                <div className="view-task-text normalFontWeight">{tasksPriority}</div>
              </div>
            </div>

            {
              formattedDateDue &&
              <div className="col-md-3 col-sm-12 no-padd">
                <div className="admin-form-field-wrapper pad-right">
                  <div className="view-task-label">{dueDate}:</div>
                  <div className="view-task-text normalFontWeight">{formattedDateDue}</div>
                </div>
              </div>
            }

            {
              contactType &&
              <div className="col-md-3 col-sm-12 no-padd">
                <div className="admin-form-field-wrapper pad-right">
                  <div className="view-task-label">{contactTypeLabel}:</div>
                  <div className="view-task-text normalFontWeight">{contactType}</div>
                </div>
              </div>
            }

          </div>

          <div className="row">
            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-right">
                <div className="view-task-label">{taskDescription}:</div>
                <div className="description-text">{description}</div>
              </div>
            </div>
          </div >
          <div className="text-right">
            <button className="bg-sky-blue-gradient bn" onClick={this.props.close}>{close}</button>

            {
              !assignedToUser && assignedToRole &&
              <button className="bg-sky-blue-gradient bn action-button" onClick={this.assignTask.bind(this)}>{assignButton}</button>
            }

            {
              assignedToUser && (typeId === 2 || typeId === 4) && status!=="Completed" &&
              <button className="bg-sky-blue-gradient bn action-button" onClick={this.completeTask.bind(this)}>{completeButton}</button>
            }
          </div>

        </div>
      </div>
    );
  }
};

ViewTaskModal = reduxForm({
  form: 'ViewTaskModalForm'
})(ViewTaskModal);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTaskModal);
