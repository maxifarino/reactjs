import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NoteForm from './form';
import Utils from '../../../../lib/utils';

import * as actions from '../../tasks/actions';
import * as commonActions from '../../../common/actions';

import './noteeditor.css';

class NoteEditorModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editingNoteId: false
    };
  };

  saveNote = (values) => {
    let
      tasksPriorityId = values.priority ? values.priority : 2,
      name = Utils.sanitizeQuotes(values.title),
      description =  Utils.sanitizeQuotes(values.note);

    const payload = {
      taskId: this.props.note ? this.props.note.id : null,
      name,
      description,
      dateDue: new Date(values.dateDue+'T23:59:59Z'),
      assignedToUserId: values.assignTo,
      assignedToRoleId: values.roleId,
      contactTypeId: values.contactTypeId,
      typeId: values.type,
      tasksPriorityId,
    };

    if (this.props.fromHolderTab) {
      payload.hiringClientId = this.props.holderId;
      payload.assetId = this.props.holderId;
      payload.assetTypeId = '1';
    } else if (this.props.fromInsuredTab) {
      payload.subcontractorId = this.props.insuredId;
      payload.assetId = this.props.insuredId;
      payload.assetTypeId = '2';
    }

    this.props.commonActions.setLoading(true);
    this.props.actions.saveNoteTask(payload, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        this.props.closeAndRefresh();
      }
    });
  }

  render() {
    const {
      titleCreateNote,
      titleEditNote,
      titleCreateTask,
      titleEditTask,
    } = this.props.local.strings.scProfile.notesTasks.modal;

    const { fromNotes, fromTasks, note } = this.props;

    let title = '';
    if (fromNotes) {
      title = note ? titleEditNote : titleCreateNote;
    } else if (fromTasks) {
      title = note ? titleEditTask : titleCreateTask;
    }

    return (
      <div>
        <header>
          <div className="noteEditorTitle">{title}</div>
        </header>
        <NoteForm
          onSubmit={this.saveNote}
          dismiss={this.props.close}
          note={this.props.note}
          holderId={this.props.holderId}
          fromHolderTab={this.props.fromHolderTab}
          insuredId={this.props.insuredId}
          fromInsuredTab={this.props.fromInsuredTab}
          fromTasks={this.props.fromTasks}
          fromNotes={this.props.fromNotes}
          defaultValue={this.props.defaultValue}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    scProfile: state.SCProfile,
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditorModal);
