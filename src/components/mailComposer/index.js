import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';

import Header from './header';
import Editor from './editor';
import * as commonActions from '../common/actions'
import * as mailActions from './actions';
import {fetchTemplates, setTemplatesList} from '../communication-templates/list/actions';
import './mail-composer.css';

const Alerts = require ('../alerts');

class MailComposer extends Component {
  constructor (props) {
    super(props);

    this.state ={
      lastVisitedHiringClientUpdated: false,
      lastVisitedSubcontractorUpdated: false
    };

    this.onSendMail = this.onSendMail.bind(this);
    this.onDiscardMail = this.onDiscardMail.bind(this);

    props.commonActions.fetchUserHiringClients(this.props.system);
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.mailComposer.sendingMail && !nextProps.mailComposer.sendingMail){
      if(nextProps.mailComposer.errorMsg) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.mailComposer.errorMsg,
          'Accept',
          false,
          ()=>{}
        );
      } else if(nextProps.mailComposer.successMsg) {
        Alerts.showInformationAlert(
          'Success',
          nextProps.mailComposer.successMsg,
          'Accept',
          false,
          ()=>{
            this.onDiscardMail();
          }
        );
      }
    }
    const lastHiringClientIdVisited = this.props.common.lastHiringClientId;
    const lastSubcontractorVisited = this.props.common.lastSubcontractorId || '';

    let newHC = nextProps.mailComposer.hiringClientId;
    const oldHC = this.props.mailComposer.hiringClientId;
    let newSC = nextProps.mailComposer.subcontractorId;
    const oldSC = this.props.mailComposer.subcontractorId;

    let newProject = nextProps.mailComposer.projectId;
    const oldProject = this.props.mailComposer.projectId;

    if (lastHiringClientIdVisited && !this.state.lastVisitedHiringClientUpdated) {
      newHC = lastHiringClientIdVisited;
    }

    if ((newHC !== oldHC) || (newSC !== oldSC)) {
      if (newHC === ""){
        this.props.actions.setPossibleRecipeints([]);
        this.props.actions.setMailPossibleSubcontractors([]);
      } else {
        if (newHC !== oldHC) {
          newSC = '';

          if (this.state.lastVisitedHiringClientUpdated && !this.state.lastVisitedSubcontractorUpdated) {
            newSC = lastSubcontractorVisited;
            this.setState({ lastVisitedSubcontractorUpdated: true });

          }
          this.props.actions.setMailHiringClientId(newHC);
          this.props.actions.setMailSubcontractorId(newSC);
          this.props.actions.fetchPossibleSubcontractors(newHC);
          this.props.actions.fetchPossibleProjects(newHC);
          this.props.fetchTemplates({orderBy:'templateName', orderDirection:'ASC', hiringClientId: newHC, isBehalfHC: true});
        }
        this.props.actions.fetchPossibleRecipeints(newHC, newSC);
      }
    }

    this.setState({ lastVisitedHiringClientUpdated: true })
  }

  componentWillUnmount () {
    this.onDiscardMail();
  }

  onSendMail () {
    // create the id list
    let emailsList = "";
    const recipients = this.props.mailComposer.recipients;
    for (var i = 0; i < recipients.length; i++) {
      if(emailsList === "")
        emailsList += recipients[i].id;
      else
        emailsList += `,${recipients[i].id}`;
    }

    if (emailsList !== "") {
      const payload = {
        emailsList,
        subject: this.props.mailComposer.mail.subject,
        body: this.props.mailComposer.mail.bodyHTML,
        hiringClientId: this.props.mailComposer.hiringClientId,
        subcontractorId: this.props.mailComposer.subcontractorId,
        dueDate: this.props.mailComposer.dueDate,
        taskDetail: this.props.mailComposer.taskDetail,
      };
      this.props.actions.sendMail(payload);
    }
  }

  onDiscardMail () {
    const editorState = EditorState.createEmpty();
    const text = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    this.props.actions.setMailEditorState(editorState, text);
    this.props.actions.setMailSubject("");
    this.props.actions.setMailRecipeints([]);
    this.props.actions.setPossibleRecipeints([]);
    this.props.actions.setMailHiringClientId("");
    this.props.actions.setMailPossibleSubcontractors([]);
    this.props.actions.setMailPossibleProjects([]);
    this.props.setTemplatesList([]);
    this.props.actions.setMailTemplate([], {});
    this.props.actions.setMailSubcontractorId("");
    this.props.actions.setMailDueDate("");
    this.props.actions.setMailTaskDetail("");
  }

  render() {
    const {
      sendBtn,
      discardBtn
    } = this.props.local.strings.mailComposer;

    return(
      <div className="container-fluid mail-composer">
            <div>
              <Header
                mailData = {this.props.mailData}
                setMailHiringClientId={this.props.actions.setMailHiringClientId}
                setMailRecipeints={this.props.actions.setMailRecipeints}
                setMailSubject={this.props.actions.setMailSubject}
                setMailSubcontractorId={this.props.actions.setMailSubcontractorId}
                setMailDueDate={this.props.actions.setMailDueDate}
                setMailTaskDetail={this.props.actions.setMailTaskDetail}
                system={this.props.system}
              />
              <Editor setMailEditorState={this.props.actions.setMailEditorState}/>
              <div className="mailFooter">
                <div className="column">
                </div>
                <div className="mailFooterRow">
                  <button className="footerBtn" onClick={this.onSendMail}>{sendBtn}</button>
                  <button className="footerBtn" onClick={this.onDiscardMail}>{discardBtn}</button>
                </div>
              </div>
            </div>
      </div>
    );
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(mailActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    fetchTemplates: bindActionCreators(fetchTemplates, dispatch),
    setTemplatesList: bindActionCreators(setTemplatesList, dispatch),
  };
};

const mapStateToProps = (state, ownProps) => {
  const { login, mailComposer, common, localization } = state;
  return {
    login,
    mailComposer,
    common,
    local: localization
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MailComposer);
