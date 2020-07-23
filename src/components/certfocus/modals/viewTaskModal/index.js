import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';

import Utils from '../../../../lib/utils';

import * as actions from '../../tasks/actions';
import * as commonActions from '../../../common/actions';

import './viewTaskModal.css';

class ViewTaskModal extends Component {
  assignTask = () => {
    const {
      task,
      login,
      actions,
      closeAndRefresh,
    } = this.props;

    const payload = {
      taskId: task.id,
      assignedToUserId: login.profile.Id,
      assignedToRoleId: null,
      dateDue: task.dateDue,
      name: task.name,
      description: task.description,
    };

    this.props.commonActions.setLoading(true);
    actions.saveNoteTask(payload, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        closeAndRefresh();
      }
    });
  }

  completeTask = () => {
    const {
      task,
      login,
      actions,
      closeAndRefresh,
    } = this.props;

    const payload = {
      taskId: task.id,
      assignedToUserId: login.profile.Id,
      dateDue: task.dateDue,
      name: task.name,
      description: task.description,
      completed: true,
    };

    this.props.commonActions.setLoading(true);
    actions.saveNoteTask(payload, (success) => {
      this.props.commonActions.setLoading(false);
      if (success) {
        closeAndRefresh();
      }
    });
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
      close,
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
      status,
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
                <div className="view-task-text">{enteredByUser}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-right">
                <div className="view-task-label">{assignedTo}:</div>
                <div className="view-task-text">{assignedToUser || assignedToRole}</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-right">
                <div className="view-task-label">{urgency}:</div>
                <div className="view-task-text">{tasksPriority}</div>
              </div>
            </div>

            {
              formattedDateDue &&
              <div className="col-md-3 col-sm-12 no-padd">
                <div className="admin-form-field-wrapper pad-right">
                  <div className="view-task-label">{dueDate}:</div>
                  <div className="view-task-text">{formattedDateDue}</div>
                </div>
              </div>
            }

            {
              contactType &&
              <div className="col-md-3 col-sm-12 no-padd">
                <div className="admin-form-field-wrapper pad-right">
                  <div className="view-task-label">{contactTypeLabel}:</div>
                  <div className="view-task-text">{contactType}</div>
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
            {this.props.notesTasks.savingTaskError}

            <button className="bg-sky-blue-gradient bn" onClick={this.props.close}>{close}</button>

            <span>
              {
                !assignedToUser && assignedToRole &&
                <button className="bg-sky-blue-gradient bn action-button" onClick={this.assignTask}>{assignButton}</button>
              }

              {
                assignedToUser && typeId === 4 && status!=="Completed" &&
                <button className="bg-sky-blue-gradient bn action-button" onClick={this.completeTask}>{completeButton}</button>
              }
            </span>
          </div>

        </div>
      </div>
    );
  }
};

ViewTaskModal = reduxForm({
  form: 'ViewCFTaskModalForm'
})(ViewTaskModal);

const mapStateToProps = (state) => {
  return {
    notesTasks: state.CFTasks,
    local: state.localization,
    login: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewTaskModal);
