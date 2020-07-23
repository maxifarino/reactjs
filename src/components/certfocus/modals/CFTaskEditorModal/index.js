import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import * as actions from "../../../certfocus/tasks/actions";
import {CERTFOCUS_TASK_OPEN_ID} from '../../../certfocus/tasks/actions/types'
import * as commonActions from "../../../common/actions";
import {connect} from "react-redux";
import CFTaskForm from "./form";
import Utils from "../../../../lib/utils";

import './CFTaskEditorModal.css';

class CFTaskEditorModal extends Component {

  saveTask = (values) => {
    const payload = {...values,
      statusId: CERTFOCUS_TASK_OPEN_ID,
      description: Utils.sanitizeQuotes(values.description),
      enteredByUserId: this.props.profile.Id, //current user
      dateDue: new Date(values.dateDue+'T23:59:59Z'),

    };
    if (values.insured && !values.projectInsured) {
      payload.insuredId = values.insured.value;
    }

    if (values.assignedToUserId) {
      payload.assignedToUserId = values.assignedToUserId.value;
    }

    //ASSET TYPE
    if (values.projectInsured && values.projectInsured.value) {
      payload.assetId = values.projectInsured.value;
      payload.insuredId = values.projectInsured.value;
      payload.assetTypeId = 8;
    } else if (values.insured && values.insured.value) {
      payload.assetId = values.insured.value;
      payload.assetTypeId = 6;
    } else if (values.documentId) {
      payload.assetTypeId = 8;
    } else if (values.projectId) {
      payload.assetId = values.projectId;
      payload.assetTypeId = 5;
    } else {
      payload.assetId = values.holder.value;
      payload.assetTypeId = 7;
    }

    if (values.holder) {
      payload.holderId = values.holder.value;
    }



    this.props.commonActions.setLoading(true);
    this.props.actions.saveNoteTask(payload, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        this.props.closeAndRefresh();
      }
    });
  };

  render() {

    const { closeAndRefresh, close } = this.props;
    const { holderId, fromHolderTab, holderName, fromInsuredTab, insuredName, insuredId, projectId, projectName, fromProject } = this.props;

    const {titleCreate} = this.props.locale.modal;

    return (
      <div className={'taskEditor'}>
        <header>
          <div className={'title'}>{titleCreate}</div>
        </header>
        <CFTaskForm
          onSubmit={this.saveTask}
          dismiss={close}
          fromHolderTab ={fromHolderTab}
          holderName ={holderName}
          holderId={holderId}
          fromInsuredTab ={fromInsuredTab}
          insuredName = { insuredName }
          insuredId ={insuredId}
          projectId = {projectId}
          fromProject = {fromProject}
          projectName = {projectName}

          // handleSubmit={closeAndRefresh}
        />
      </div>
    );
  }
}

CFTaskEditorModal.proptypes = {
  closeAndRefresh: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    profile: state.login.profile,
    locale: state.localization.strings.CFTasks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};



export default connect(mapStateToProps,mapDispatchToProps)(CFTaskEditorModal);