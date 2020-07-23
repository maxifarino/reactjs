import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './CFTaskDetailModal.css';
import moment from "moment";
import CFTaskContacts from "./contacts";
import CFTaskComments from "./comment";
import CFTaskHistory from "./taskHistory";
import CFProjectHistory from "./projectHistory";

class CFTaskDetailModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectInsured: {
        status: '',
        url: '',
      }
    }
  }

  getDocumentInfo = () => {
    const {document} = this.props;
    if (document) {
      return <a target='_blank' href={document.DocumentUrl}>{document.FileName}</a>
    }
  }

  getComplianceStatus = () => {
    const {ProjectId, assetTypeId, id} = this.props.task;
    if (!id) return false;

    const {projectsInsuredsList, document} = this.props;

    let taskComplianceStatus = null;
    let taskProjectInsuredId = null;

    if (assetTypeId == 8) {
      taskProjectInsuredId = document.projectInsuredId
      taskComplianceStatus = document.DocumentStatus;
    } else if (projectsInsuredsList[0] && ProjectId) {
        const projectInsured = projectsInsuredsList[0];
        taskProjectInsuredId = projectInsured.ProjectInsuredID;
        taskComplianceStatus = projectInsured.ComplianceStatusName;
    }
    if (taskComplianceStatus && taskProjectInsuredId) {
      return <a target={'_blank'} href={'certfocus/certificates/' + taskProjectInsuredId}>{taskComplianceStatus}</a>
    }
  }

  getInsured = () => {

    const {assetTypeId, InsuredId, insuredName, id} = this.props.task;
    if (!id) return false;

    const {document} = this.props;

    let taskInsuredName = '';
    let taskInsuredId = '';
    if (assetTypeId == 8 && document.SubcontractorID) { //project/insured task
      taskInsuredId = document.SubcontractorID;
      taskInsuredName = document.insuredName;
    } else {
        taskInsuredId = InsuredId;
        taskInsuredName = insuredName;
    }

    if (taskInsuredName && taskInsuredId) {
      return <a target={'_blank'} href={`certfocus/insureds/${taskInsuredId}`}>{taskInsuredName}</a>
    }

    return '';

  }

  render() {
    const {holder, insured, action, projectNumber, dateDue, projectName, document, status, comment} = this.props.locale.labels;
    const {holderName, insuredName, type, HolderId, InsuredId, ProjectId} = this.props.task;
    const taskDateDue = this.props.task.dateDue;
    const taskProjectName = this.props.task.projectName;
    const taskProjectNumber = this.props.task.projectNumber;

    const {handleTaskSubmit, handleCommentSubmit, closeAndNew, onHide, taskHistory, projectHistory} = this.props;

    let contact = [];
    const { holderContact, insuredContact, agencyContact,agentContact} = this.props.task;
    if (holderContact) {
      contact = JSON.parse(holderContact);
    }
    if(insuredContact) {
      contact = contact.concat(JSON.parse(insuredContact));
    }
    if(agencyContact) {
      contact = contact.concat(JSON.parse(agencyContact));
    }
    if(agentContact) {
      contact = contact.concat(JSON.parse(agentContact));
    }

    const contactList = contact.concat(this.props.contacts)

    let taskDescription = '';
    if (this.props.task.originalComment) {
      taskDescription = this.props.task.originalComment.split('\n').map((item, i) => {
        return <p key={i} className={'m-0'}>{item}</p>;
      });
    }

    return (

      (this.props.task ?
        <React.Fragment>
          <div className={'taskDetail'}>
            <div className="row">
              <header>
                <div className={'title'}>{this.props.locale.title}</div>
              </header>
            </div>

            <div className="row">
              <div className="col-4">{holder}: <a target={'_blank'}
                                                  href={`certfocus/holders/${HolderId}`}>{holderName}</a></div>
              <div className="col-4">{insured}: {this.getInsured()}</div>
              <div className="col-4">{action}: <strong>{type}</strong></div>
            </div>
            <div className="row">
              <div className="col-4">{projectNumber}: <a target={'_blank'}
                                                         href={`certfocus/projects/${ProjectId}`}>{taskProjectNumber}</a>
              </div>
              <div className="col-4">{projectName}: <a target={'_blank'}
                                                       href={`certfocus/projects/${ProjectId}`}>{taskProjectName}</a>
              </div>
              <div className="col-4">{dateDue}: <span
                className="text-danger">{moment(taskDateDue).format('MM/DD/YYYY')}</span></div>
            </div>
            <div className="row">
              <div className="col-8">{document}: {this.getDocumentInfo()}</div>
              <div className="col-4">{status}: {this.getComplianceStatus()}</div>
            </div>
            <div className="row">
              <div className="col-12">{comment}: <br/> {taskDescription}</div>
            </div>
            {/*<hr/>*/}
            {/*Files attached*/}
            <br/>
            <CFTaskContacts
              contactList={contactList}
              onHide={onHide}
              closeAndNew={closeAndNew}
              handleTaskSubmit={handleTaskSubmit}
            />

            <CFTaskComments
              handleCommentSubmit={handleCommentSubmit}
            />

            {(projectHistory.length > 0) ?
              <React.Fragment>
                <div className="row">
             <span className={'innerTitle'}>
               <div className={'title'}>{this.props.locale.projectHistory}</div>
             </span>
                </div>
                <CFProjectHistory
                  locale={this.props.locale.history}
                  history={projectHistory}
                />
              </React.Fragment>
              : null
            }

            {(taskHistory.length > 0) ?
              <React.Fragment>

                <div className="row">
             <span className={'innerTitle'}>
               <div className={'title'}>{this.props.locale.taskHistory}</div>
             </span>
                </div>
                <CFTaskHistory
                  locale={this.props.locale.history}
                  history={taskHistory}
                />
              </React.Fragment>
              : null
            }
          </div>
        </React.Fragment>
        : '')
    );
  }
}

CFTaskDetailModal.propTypes = {
  task: PropTypes.object.isRequired,
  handleTaskSubmit: PropTypes.func.isRequired,
  closeAndNew: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};


const mapStateToProps = ((state) => {
  return {
    login: state.login,
    locale: state.localization.strings.CFTasks.viewDetail,
    contacts: state.contacts.list,
    documentsList: state.documents.list,
    projectsInsuredsList: state.projectInsureds.list,
  };
})

export default connect(mapStateToProps)(CFTaskDetailModal);