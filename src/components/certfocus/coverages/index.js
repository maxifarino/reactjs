import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Col,
  Collapse,
  Container,
  Row,
} from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Utils from '../../../lib/utils';

import ViewLayersModal from '../modals/viewLayersModal';

import * as commonActions from '../../common/actions';
import * as coverageActions from './actions';
import * as projectInsuredsActions from './../project-insureds/actions';
import * as documentsActions from './../documents/actions';

import './Coverages.css';

class Coverages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      currentData: null,
      isCurrentSetTemplate: false,
      shown: {},
      projectInsuredData: {},
      coveragesData: [],
      fetching: true,
    };
  }


  componentDidMount() {
    const { projectInsuredId } = this.props.match.params;

    this.props.projectInsuredsActions.fetchProjectInsureds({
      projectInsuredId: projectInsuredId,
      getOne: true,
    });

    if (projectInsuredId) {
      this.props.commonActions.setLoading(true);
      this.props.coverageActions.fetchRuleGroups({ projectInsuredId: projectInsuredId, detail: true }, (success) => {
        if (success) this.props.commonActions.setLoading(false);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectInsureds.list !== this.props.projectInsureds.list) {
      if (nextProps.projectInsureds.list.length > 0) {
        this.setState({ projectInsuredData: nextProps.projectInsureds.list[0] });
      }
    }

    if (nextProps.mainCoverages.ruleGroupsList !== this.props.mainCoverages.ruleGroupsList) {
      if (nextProps.mainCoverages.ruleGroupsList.length > 0) {
        this.setState({ coveragesData: nextProps.mainCoverages.ruleGroupsList, fetching: false });
      }
    }
  }

  fetchRuleGroups = () => {
    const { projectInsuredId } = this.props.match.params;
    if (projectInsuredId) {
      this.props.commonActions.setLoading(true);
      this.props.coverageActions.fetchRuleGroups({ projectInsuredId: projectInsuredId, detail: true }, (success) => {
        if (success) this.props.commonActions.setLoading(false);
      });
    }
  }

  openModal = (e, data) => {
    e.preventDefault();
    this.setState({
      showModal: true,
      ...(data ? { currentData: data } : {}),
    });
  }

  closeModal = (success) => {
    if (success) {
      this.props.closeModal(success);
    }

    this.setState({
      showModal: false,
      currentData: null,
    });
  }

  downloadAttachment = (link) => {
    window.open(link, '_blank');
  }

  assignColorToStatus = (statusId) => {
    switch (statusId) {
      case 1:
        return (<div className="attributes-status non-submitted"></div>);
      case 2:
        return (<div className="attributes-status pending"></div>);
      case 3:
        return (<div className="attributes-status accepted"></div>);
      case 4:
        return (<div className="attributes-status minor"></div>);
      case 5:
        return (<div className="attributes-status rejected"></div>);
      case 6:
        return (<div className="attributes-status rejected"></div>);
      case 7:
        return (<div className="attributes-status escalated"></div>);
      case 8:
        return (<div className="attributes-status escalated"></div>);
      case 9:
        return (<div className="attributes-status escalated"></div>);
      case 10:
        return (<div className="attributes-status waived"></div>);
      case 11:
        return (<div className="attributes-status exempt"></div>);
      default:
        return (<div className="attributes-status non-submitted"></div>);
    }
  }

  assignColorToProjectInsuredComplianceStatus = (statusId) => {
    switch (statusId) {
      case 1:
        return (<div className="compliance-status compliant">Compliant</div>);
      case 2:
        return (<div className="compliance-status escalated">Escalated</div>);
      case 6:
        return (<div className="compliance-status non-compliant">Non Compliant</div>);
      case 15:
        return (<div className="compliance-status minor">Compliant w/minor Deficiencies</div>);
      case 16:
        return (<div className="compliance-status on-hold">On Hold</div>);
      default:
        return (<div className="compliance-status">Pending</div>);
    }
  }

  renderRequirementSet = () => {
    const {
      noRequirementGroup,
    } = this.props.local.strings.holderRequirementSets.details;
    const { coveragesData } = this.state;
    
    const ruleGroups = coveragesData.reduce((acc, obj) => {
      var key = obj['RuleGroupID'];
      if (!acc[key]) {
        acc[key] = {
          RuleGroupID: obj.RuleGroupID,
          RuleGroupName: obj.Name,
          CertificateID: obj.CertificateID,
          DocumentID: obj.DocumentId,
          ProjectID: obj.ProjectID,
          InsuredID: obj.InsuredID,
          ProjectInsuredID: obj.ProjectInsuredID,
          RequirementSetID: obj.RequirementSetID,
          CoverageTypeID: obj.CoverageTypeId,
          CoverageType: obj.CoverageType,
          CoverageStatusID: obj.CoverageStatusID,
          CoverageStatus: obj.CoverageStatus,
          ComplianceStatus: obj.ComplianceStatus,
          ComplianceStatusID: obj.ComplianceStatusID,
        };
        acc[key]['rules'] = [];
      }
      acc[key]['rules'].push({
        RuleGroupID: obj.RuleGroupID,
        RuleID: obj.RuleID,
        AttributeID: obj.RuleAttributeId,
        AttributeName: obj.AttributeName,
        AttributeValue: obj.AttributeValue,
        CoverageAttributeStatusID: obj.CoverageAttributeStatusID,
        CoverageAttributeStatus: obj.CoverageAttributeStatus,
        ConditionTypeID: obj.ConditionTypeID,
        ConditionValue: obj.ConditionValue,
      });
      return acc;
    }, []);

    return (
      <div className="row">
        <div className="col-12 requirements-groups">
          {ruleGroups.length > 0 ?
            this.renderRequirementsGroups(ruleGroups) :
            <h6>{noRequirementGroup}</h6>
          }
        </div>
      </div>
    );
  }

  toggleAttributes = (ruleGroupId) => {
    this.setState({
      shown: {
        ...this.state.shown,
        [ruleGroupId]: !this.state.shown[ruleGroupId]
      }
    });
  }

  openDocument = (e, documentId) => {
    e.preventDefault();
    this.props.commonActions.setLoading(true);
    this.props.documentsActions.fetchDocumentData({ documentId: documentId }, (err, data) => {
      this.props.commonActions.setLoading(false);
      if (!err) {
        window.open(data.DocumentUrl, '_blank','left=700, top=150, height=500, width=650, scrollbars=yes');
      }      
    });
  }

  renderRequirementsGroups = (reqGroups) => {
    const { projectInsuredData } = this.state;
    return (
      <div className="coverages-table table-bordered">
        <Container fluid>
          <Row>
            <Col className="coverages-headers" style={{ minWidth: '165px' }}>&nbsp;</Col>
            <Col className="coverages-headers" style={{ minWidth: '175px' }}>Coverage Status</Col>
            <Col className="coverages-headers" sm={3}>Coverage Type</Col>
            <Col className="coverages-headers">Last Action</Col>
            <Col className="coverages-headers">Last Action Date</Col>
            <Col className="coverages-headers">Next Action Type</Col>
            <Col className="coverages-headers" sm={2}>&nbsp;</Col>
          </Row>
          {reqGroups.map((group) => {            
            const isCollapsed = this.state.shown[group.RuleGroupID] ? 'show' : '';
                        
            return (
              <React.Fragment key={group.RuleGroupID}>
                <Row key={group.RuleGroupID}>
                  <Col style={{ padding: 0, whiteSpace: 'nowrap' }}>
                    <span style={{ padding: '5px', verticalAlign: 'middle' }}>
                      {this.assignColorToStatus(group.CoverageStatusID)}
                    </span>
                    <span>
                      <a
                        onClick={() => this.toggleAttributes(group.RuleGroupID)}
                        aria-controls="collapse-text"
                        aria-expanded={isCollapsed}
                        className="cell-table-link icon-quick_view"
                      >
                        View Attributes
                    </a>
                    </span>
                  </Col>
                  <Col style={{ minWidth: '175px', whiteSpace: 'nowrap' }}>{group.CoverageStatus}</Col>
                  <Col sm={3} style={{ whiteSpace: 'nowrap' }}><strong>{group.CoverageType}</strong></Col>
                  <Col> - </Col>
                  <Col> - </Col>
                  <Col> - </Col>
                  <Col style={{ textAlign: 'end' }}>
                    {(group.DocumentID) && (
                    <a
                      onClick={(e) => this.openDocument(e, group.DocumentID)}
                      className="cell-table-link icon-quick_view"
                    >
                      VIEW CERT
                    </a>
                    )}
                  </Col>
                  <Col style={{ textAlign: 'end' }}>
                    <a
                      className="cell-table-link icon-quick_view"
                      onClick={(e) => this.openModal(e, {
                        holderId: projectInsuredData.HolderID,
                        projectId: projectInsuredData.ProjectID,
                        insuredId: projectInsuredData.InsuredID,
                        projectInsuredId: projectInsuredData.ProjectInsuredID,
                        coverageTypeId: group.CoverageTypeID,
                        coverageTypeName: group.CoverageType,                       
                      })}
                    >
                      View Layers
                  </a>
                  </Col>
                </Row>
                <Container fluid>
                  <Collapse in={Boolean(isCollapsed)}>
                    <div id="collapse-text">
                      <Row>
                        <Col sm={4}>&nbsp;</Col>
                        <Col>&nbsp;</Col>
                        <Col sm={4} className="coverages-attr-headers">Attribute</Col>
                        <Col className="coverages-attr-headers">Required</Col>
                        <Col className="coverages-attr-headers">Provided</Col>
                      </Row>
                      {group.rules.map((requirement, index) => this.renderRequirement(requirement, index))}
                    </div>
                  </Collapse>
                </Container>
              </React.Fragment>
            )
          })}
        </Container>
      </div>
    )
  }

  renderRequirement = (requirement, index) => {
    const key = requirement.RuleGroupID + '-' + index;    
    return (
      <Row key={key}>
        <Col sm={5}>&nbsp;</Col>
        <Col className="col-md-auto"><span style={{ paddingLeft: '5px', verticalAlign: 'middle' }}>{this.assignColorToStatus(requirement.CoverageAttributeStatusID)}</span></Col>
        <Col sm={4} style={{ whiteSpace: 'nowrap' }}>{requirement.AttributeName}</Col>
        <Col>
          {(Number(requirement.ConditionTypeID) > 3) ? Utils.formatCurrency(requirement.ConditionValue) : requirement.ConditionValue}
        </Col>
        <Col>
          {((Number(requirement.ConditionTypeID) > 3) && (requirement.AttributeValue)) ? Utils.formatCurrency(requirement.AttributeValue) : requirement.AttributeValue}
        </Col>
      </Row>
    );
  }

  render() {
    const fromSection = (this.props.location && this.props.location.state) ? this.props.location.state.fromSection : 'Project';
    const { projectInsuredData, showModal } = this.state;
    const {
      holderNameLabel,
      projectNumberLabel,
      projectNameLabel,
      insuredNameLabel,
    } = this.props.local.strings.coverages;

    return (
      <div className="list-view admin-view-body holder-requirement-sets-list-view">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <ViewLayersModal
              layersData={this.state.currentData}
              close={this.closeModal}
            />
          </Modal.Body>
        </Modal>

        <div className="back-to-header">
          <button
            className="header-primary-button"
            onClick={() => (fromSection === 'Project')
              ? this.props.history.push(`/certfocus/projects/${projectInsuredData.ProjectID}`)
              : this.props.history.push(`/certfocus/insureds/${projectInsuredData.InsuredID}`)
            }
          >
            Back to {fromSection}
          </button>
        </div>
        <div className="row">
          <div className="col-12 requirements-groups">
            <div className="card mb-2 p-2">
              <div className="card-block">
                <div className="row">
                  <div className="col-4">
                    {(projectInsuredData && projectInsuredData.ComplianceStatusID)
                      ? this.assignColorToProjectInsuredComplianceStatus(projectInsuredData.ComplianceStatusID)
                      : (<div className="spinner-wrapper mt-0"><div className="spinner" /></div>)
                    }
                  </div>
                  <div className="col-5">
                    <p><strong>{holderNameLabel}:</strong>&nbsp; {projectInsuredData.HolderName}</p>
                    <p><strong>{projectNumberLabel}:</strong>&nbsp; {projectInsuredData.ProjectNumber}</p>
                    <p><strong>{projectNameLabel}:</strong>&nbsp; {projectInsuredData.ProjectName}</p>
                    <p><strong>{insuredNameLabel}:</strong>&nbsp; {projectInsuredData.InsuredName}</p>
                  </div>
                  <div className="col-3" style={{ textAlign: 'end' }}>
                    {/* <p>
                      <strong>Filter:</strong>&nbsp; Show only deficiencies
                      <input
                        type="checkbox"
                        className='def-checkbox'
                      />
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(this.state.coveragesData && !this.state.fetching) && (
          <div className="row">
            <div className="col-12 requirements-groups">
              {this.state.coveragesData.length > 0 ?
                this.renderRequirementSet() :
                <h6>No RequirementSet</h6>
              }
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projectRequirements: state.projectRequirements,
    projectInsureds: state.projectInsureds,
    holderRequirementSets: state.holderRequirementSets,
    mainCoverages: state.mainCoverages,
    documents: state.documents,
    local: state.localization,
    login: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    coverageActions: bindActionCreators(coverageActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    projectInsuredsActions: bindActionCreators(projectInsuredsActions, dispatch),
    documentsActions: bindActionCreators(documentsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Coverages);