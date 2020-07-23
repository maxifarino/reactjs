/* eslint-disable */
import React, { isValidElement } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PDFViewer from './PDFViewer';
import * as certificateActions from './actions';
import './certificates.css';
import Deficiences from './../../common/deficiences';
import { Link, withRouter } from 'react-router-dom';
import * as mailComposerActions from './../../mailComposer/actions/index';
import * as commonActions from './../../common/actions';

class Certificates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCertificate: null,
      certificates: null,
      currentPosition: 0,
      disableBtnSaveEmailInsured: false
    }
  }

  componentDidMount() {
    const { projectInsuredId } = this.props.match.params;
    this.props.certificateActions.fetchCertificates(projectInsuredId);
    this.props.certificateActions.fetchUsers();
    this.props.certificateActions.fetchProjectInsured(projectInsuredId);
  }

  handleFormSubmit = (values) => {

  };

  moveLeft = () => {
    let currentPosition = this.state.currentPosition;
    let nextPosition = 0;
    if (currentPosition > 0) {
      nextPosition = currentPosition - 1;
      this.setState({ currentPosition: nextPosition, disableBtnSaveEmailInsured: true, disableBtnSaveEmailProcedure: true });
    }
  }

  moveRight = () => {
    let currentPosition = this.state.currentPosition;
    let nextPosition = 0;
    if (currentPosition <= (this.props.certificates.certificatesAmount - 1)) {
      nextPosition = currentPosition + 1;
      this.setState({ currentPosition: nextPosition, disableBtnSaveEmailInsured: true, disableBtnSaveEmailProcedure: true });
    }
  }

  disableBtnBefore() {
    return this.state.currentPosition > 0;
  }

  disableBtnAfter() {
    return !(this.state.currentPosition == (this.props.certificates.certificatesAmount - 1));
  }

  toggleEmailProcedure(data) {
    this.props.certificateActions.toogleEmailProcedure(data);
  }

  toggleEmailInsured(data) {
    this.props.certificateActions.toogleEmailInsured(data);
  }

  renderLinkToCoverage() {
    let { projectInsuredId } = this.props.match.params;
    let requirementSetId = this.props.certificates.projectInsured ? this.props.certificates.projectInsured.RequirementSetId : null;

    let component = (
      <Link
        to={{
          pathname: `/certfocus/coverages/${projectInsuredId}/${requirementSetId}`
        }}
        target="_blank"
        className="bg-sky-blue-gradient bn bn-small"
      >
        {'VIEW COVERAGES'}
      </Link>
    );

    return component;
  }

  renderLinkToViewInsured() {
    let requirementSetId = this.props.certificates.projectInsured ? this.props.certificates.projectInsured.InsuredId : null;
    let component = (
      <Link
        to={{
          pathname: `/certfocus/insureds/${requirementSetId}`
        }}
        target="_blank"
        className="bg-sky-blue-gradient bn bn-small"
      >
        {'VIEW INSUREDS'}
      </Link>
    );

    return component;
  }

  eventSendEmail() {
    const { HolderId, InsuredId, ProjectId } = this.props.certificates.projectInsured;
    let url = this.getUrlMailPage(HolderId, ProjectId, InsuredId, 36, []);
    this.props.history.push(url);
  }

  renderLinkSendEmail() {
    let component = (
      <button onClick={() => this.eventSendEmail()} className="bg-sky-blue-gradient bn bn-small">SEND EMAIL</button>
    );
    return component;
  }


  saveEmailInsured(data) {
    let payload = { insuredId: data.InsuredID, email: data.EmailInsured };
    this.initLoadingSpinner();
    this.props.certificateActions.setfetchInsuredEmail(payload, () => {
      this.closeLoadingSpinner();
    });
  }

  saveEmailProcedure(data) {
    let payload = { certificateId: data.CertificateID, documentId: data.DocumentId, email: data.EmailProcedure };
    this.initLoadingSpinner();
    this.props.certificateActions.setfetchProcedureEmail(payload, () => {
      this.closeLoadingSpinner();
    });
  }

  handleChangeEmailInsured = (e) => {
    this.props.certificateActions.setEmailInsured(e.target.value);
    this.setState({ disableBtnSaveEmailInsured: !(e.target.value.length > 0) });
  }

  handleChangeEmailProcedure = (e, data) => {
    this.validateEmail(e.target.value, data.CertificateID);
    this.props.certificateActions.setEmailProcedure({ certificateID: data.CertificateID, documentId: data.DocumentId, emailProcedure: e.target.value });
  }

  validateEmail(email, certificateId) {
    let lastAtPos = email.lastIndexOf('@');
    let lastDotPos = email.lastIndexOf('.');
    if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
      this.props.certificateActions.settoggleEmailProcedurebtn({ disable: true, certificateId });
    } else {
      this.props.certificateActions.settoggleEmailProcedurebtn({ disable: false, certificateId });
    }
  }

  rejectCertificate = (data) => {

    let documentId = data.DocumentId
    let projectInsuredID = data.ProjectInsuredID
    let insuredID = data.InsuredID;
    let ruleGroupId = this.props.deficiences[0].ruleGroupId;
    let certificateId = data.CertificateID;
    let holderId = this.props.certificates.projectInsured.HolderId;
    let deficiences = this.props.deficiences.filter(x => x.ProjectInsuredID != null);
    let ruleId = this.props.deficiences[0].ruleId;

    let reject = { projectInsuredID, insuredID, documentId, deficiences, holderId, certificateId, ruleGroupId, ruleId };
    this.initLoadingSpinner();
    this.props.certificateActions.setfetchReject(reject, (error) => {
      this.closeLoadingSpinner();
      if (!error) {
        this.redirectToEmailPageAfterReject();
      }
    });
  }

  redirectToEmailPageAfterReject() {
    this.props.history.push("/mail");
  }

  onHoldCertificate = (data) => {
    console.log(data);
    this.initLoadingSpinner();
    if (!data.isOnHold) {
      let onHold = { projectInsuredID: data.ProjectInsuredID, status: 16, lastStatus: data.complianceStatusID };
      console.log('onHold', onHold);
      this.props.certificateActions.setfetchOnHold(onHold, () => {
        this.closeLoadingSpinner();
      });
    }
    else {
      let onHold = { projectInsuredID: data.ProjectInsuredID };
      this.props.certificateActions.setFetchRemoveOnHold(onHold, () => {
        this.closeLoadingSpinner();
      });
    }
  }

  initLoadingSpinner = () => {
    this.props.commonActions.setLoading(true);
  }

  closeLoadingSpinner = () => {
    this.props.commonActions.setLoading(false);
  }

  renderLinkToDataEntry(certificateId) {
    let component = (
      <Link
        to={{
          pathname: `/certfocus/processing/${certificateId}`
        }}
        target="_blank"
        className="bg-sky-blue-gradient bn bn-small"
      >
        {'VIEW / EDIT DATA ENTRY'}
      </Link>
    );

    return component;
  }

  getUrlMailPage(holderId, projectId, insuredId, templateId, recipients) {
    let mailData = {
      holderId, projectId, insuredId, templateId, recipients
    };

    let urlmailPage = '/mail/' + window.btoa(JSON.stringify(mailData));
    return urlmailPage;
  }

  escalateCertificate(projectInsuredId) {
    this.initLoadingSpinner();
    let deficiences = this.props.deficiences.filter(x => x.ProjectInsuredID != null && (x.DefTypeID == 1 || x.DefTypeID == 2));
    this.props.certificateActions.setFetchEscalateCertificate({ deficiences, projectInsuredId }, () => {
      this.closeLoadingSpinner();
    });
  }

  render() {
    const data = this.props.certificates.certificatesList && this.props.certificates.certificatesList.length > 0 ? this.props.certificates.certificatesList[this.state.currentPosition] : null;
    
    const opacityBtnBefore = { opacity: this.disableBtnBefore() ? '1' : '0.2' }
    const disableBtnBefore = this.disableBtnBefore();

    const opacityBtnAfter = { opacity: this.disableBtnAfter() ? '1' : '0.2' }
    const disableBtnAfter = this.disableBtnAfter();

    const opacityRejectBtn = { opacity: data && data.disabledRejectBtn ? '0.2' : '1' };
    const nameOnHoldBtn = data && data.disabledOnHoldBtn ? 'REMOVE HOLD' : 'ON-HOLD';

    return (
      <div className="certificates container-fluid">
        <section className="border p-1">
          <div className="col-md-12">
            <div className="row p-2">
              <div className="col-md-auto">
                <span>Viewing {this.state.currentPosition + 1} of {this.props.certificates.certificatesAmount} documents</span>
              </div>
              <div className="col-md-1">
                <button
                  className="documents-scroll linear-icon-chevron-left"
                  style={opacityBtnBefore}
                  disabled={!disableBtnBefore}
                  onClick={() => this.moveLeft()}
                />&nbsp;
                <button
                  className="documents-scroll linear-icon-chevron-right"
                  style={opacityBtnAfter}
                  disabled={!disableBtnAfter}
                  onClick={() => this.moveRight()}
                />
              </div>
              <div className="col-md-8">
                <div className="row justify-content-end">
                  <div className="col-md-auto mt-1">
                    <input type="checkbox" checked={data && data.enableEmailInsured} className="pretty-checkbox" onClick={() => this.toggleEmailInsured(data)} />&nbsp;
                    <span>Enable Insured Email (This Cert Only)</span>
                  </div>
                  <div className="col-md-auto">
                    <input type="text" name="emailInsured"
                      value={data && data.EmailInsured}
                      onChange={(e) => this.handleChangeEmailInsured(e)}
                      placeholder="Email" />
                  </div>
                  <button className="btn btn-primary" disabled={(!data || data.EmailInsured.length == 0)} onClick={() => this.saveEmailInsured(data)}>Save</button>
                </div>
                <div className="row justify-content-end mt-3">
                  <div className="col-md-auto mt-1">
                    <input type="checkbox" checked={data && data.enableEmailProcedure} className="pretty-checkbox" onClick={() => this.toggleEmailProcedure(data)} />&nbsp;
                    <span>Enable Producer Email (This Cert Only)</span>
                  </div>
                  <div className="col-md-auto">
                    <input type="text" name="email"
                      value={data && data.EmailProcedure}
                      onChange={(e) => this.handleChangeEmailProcedure(e, data)}
                      placeholder="Email" />
                  </div>
                  <button className="btn btn-primary" disabled={data && data.disabledEmailProcedureBtn} onClick={() => this.saveEmailProcedure(data)}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border">
          <div className="col-md-12">
            <div className="row buttons-section">
              <div className="col-md-auto mt-2">
                {this.renderLinkToDataEntry(data && data.CertificateID)}
              </div>
              <div className="col-md-auto">
                {this.renderLinkSendEmail()}
              </div>
              <div className="col-md-auto">
                <button
                  onClick={() => this.onHoldCertificate(data)}
                  className="bg-sky-blue-gradient bn bn-small">{nameOnHoldBtn}</button>
              </div>
              <div className="col-md-auto">
                <button
                  style={opacityRejectBtn}
                  onClick={() => this.rejectCertificate(data)}
                  disabled={data && data.disabledRejectBtn}
                  className="bg-sky-blue-gradient bn bn-small">REJECT</button>
              </div>
              <div className="col-md-auto">
                <button onClick={() => this.escalateCertificate(data && data.ProjectInsuredID)} className="bg-sky-blue-gradient bn bn-small">ESCALATE</button>
              </div>
              <div className="col-md-auto mt-2">
                {this.renderLinkToCoverage()}
              </div>
              <div className="col-md-auto mt-2">
                {this.renderLinkToViewInsured()}
              </div>
            </div>
          </div>
        </section>

        <section className="border">
          <div className="col-md-12">
            <div className="row info-section">
              <div className="col-md-auto">
                <span>Current Document ID: </span>
                <span style={{ display: 'inline-block' }}>
                  <input type="text" className="sm-input" name="documentId" value={data && data.DocumentId} disabled />
                </span>
              </div>
              <div className="col-md-auto">
                <span>Current Document Status: </span>
                <span style={{ display: 'inline-block' }}>
                  <input type="text" className="sm-input" name="documentStatus" value={data && data.DocumentStatus} disabled />
                </span>
              </div>
              <div className="col-md-auto">
                <span>Coverages: </span>
                <span style={{ display: 'inline-block' }}>
                  <input type="text" className="sm-input" name="coverageTypes" value={data && data.Codes} disabled />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border">
          <div className="container-fluid" style={{ marginTop: '20px' }}>
            <div className="row">
              <div className="col-6">
                {data && data.UrlFile ? (
                  <PDFViewer
                    pdf={data && data.UrlFile}
                    height="75vh"
                    width="100%"
                    position="sticky"
                    top="10px"
                    frameBorder="1p solid #000"
                  />
                ) : (
                    <div className="spinner-wrapper">
                      <div className="spinner" />
                    </div>
                  )}
              </div>
              <div className="col-6">
                <Deficiences params={this.props.match.params} />
              </div>
            </div>
          </div>
        </section>


      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    certificates: state.certificates,
    deficiences: state.deficiences.deficiencesList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    certificateActions: bindActionCreators(certificateActions, dispatch),
    mailComposerActions: bindActionCreators(mailComposerActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Certificates);
