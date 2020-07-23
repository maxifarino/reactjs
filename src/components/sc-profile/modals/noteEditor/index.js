import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NoteForm from './form';
import * as actions from '../../tabs/notesTasks/actions';
import Utils from '../../../../lib/utils'
import './noteeditor.css';

class NoteEditorModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingNoteId: false
    }

    this.saveNote = this.saveNote.bind(this);
  };

  saveNote(values) {
    let 
      tasksPriorityId = values.priority ? values.priority : 2,
      name = Utils.sanitizeQuotes(values.title),
      description =  Utils.sanitizeQuotes(values.note)

    const payload = {
      taskId: this.props.note ? this.props.note.id : null,
      name,
      description,
      dateDue: new Date(values.dateDue+'T23:59:59Z'),
      assignedToUserId: values.assignTo,
      assignedToRoleId: values.roleId,
      contactTypeId: values.contactTypeId,
      typeId: values.type,
      tasksPriorityId
    };

    if (this.props.fromFinancialTab) {
      payload.subcontractorId = this.props.subcontractorId;
      this.props.saveNote(payload);
    } else {
      if (this.props.fromHCtab) {
        payload.hiringClientId = this.props.hcId;
        payload.assetId = this.props.hcId;
        payload.assetTypeId = '1';
      } else {
        let { hcId } = this.props.scProfile
        payload.hiringClientId = hcId;
        payload.subcontractorId = this.props.subcontractorId;
        payload.assetId = this.props.subcontractorId;
        payload.assetTypeId = '2';
      }

      console.log('payload = ', payload)

      this.props.actions.saveNoteTask(payload);
    }

    this.props.closeAndRefresh();

  }

  render() {
    const {
      titleCreate,
      titleEdit
    } = this.props.local.strings.scProfile.notesTasks.modal;

    const title = this.props.note ? titleEdit : titleCreate;

    return (
      <div>
        <header>
          <div className="noteEditorTitle">{title}</div>
        </header>
        <NoteForm onSubmit={this.saveNote} dismiss={this.props.close} note={this.props.note} fromFinancialTab={this.props.fromFinancialTab} scId={this.props.subcontractorId} hcId={this.props.hcId} fromHCtab={this.props.fromHCtab} fromSCtab={this.props.fromSCtab} />
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    notesTasks: state.notesTasks,
    scProfile: state.SCProfile,
    users: state.users,
    local: state.localization,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditorModal);
