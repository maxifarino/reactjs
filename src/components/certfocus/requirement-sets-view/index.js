import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Utils from '../../../lib/utils';

import AddRequirementSetsModal from '../modals/addRequirementSetModal';
import RequirementGroupForm from '../requirement-sets/details/forms/RequirementGroupForm';
import RequirementForm from '../requirement-sets/details/forms/RequirementForm';
import AttachmentForm from './../requirement-sets/details/forms/AttachmentForm';
import EndorsementForm from './../requirement-sets/details/forms/EndorsementForm';

import * as reqSetsActions from '../requirement-sets/actions';
import * as commonActions from '../../common/actions';
import * as actions from './actions';

import './RequirementSetsView.css';


class RequirementSetsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      activeModal: null,
      currentData: null,
    };
  }

  openModal = (modal, data) => {
    this.setState({
      showModal: true,
      activeModal: modal,
      ...(data ? { currentData: data } : {}),
    });
  }

  closeModal = (success) => {
    if (success) {
      this.props.closeModal(success);
    }

    this.setState({
      showModal: false,
      activeModal: null,
      currentData: null,
    });
  }

  renderModal = () => {
    const { activeModal } = this.state;
    const { endorsements } = this.props.holderRequirementSets;
    const { requirementSet } = this.props;    

    const filteredNonVisibleEndorsements = endorsements 
      ? endorsements.filter(e => e.AlwaysVisible === false) 
      : [];

    switch (activeModal) {
      case 'basicInfo':
        return (
          <AddRequirementSetsModal
            requirementSet={this.props.requirementSet}
            close={this.closeModal}
            holderId={this.props.requirementSet.HolderId}
          />
        );
      case 'attachment':
        return (
          <AttachmentForm
            onSubmit={this.onSubmitAttachment}
            close={this.closeModal}
          />
        );
      case 'requirementGroup':
        return (
          <RequirementGroupForm
            onSubmit={this.onSubmitRequirementGroup}
            close={this.closeModal}
            group={this.state.currentData}
            holderId={(requirementSet.Template !== 1) ? this.props.holderId : undefined}
            isTemplate={(requirementSet.Template === 1) ? true : false}
          />
        );
      case 'requirement':
        return (
          <RequirementForm
            requirement={this.state.currentData}
            onSubmit={this.onSubmitRequirement}
            close={this.closeModal}
          />
        );
      case 'endorsements':
        return (
          <EndorsementForm
            onSubmit={this.onSubmitEndorsement}
            close={this.closeModal}
            filteredEndorsements={filteredNonVisibleEndorsements}
            holderId={this.props.holderId}
          />
        );  
      default:
        return null;
    }
  }

  onSubmitRequirementGroup = (data) => {
    const RuleGroupID = this.state.currentData ? this.state.currentData.RuleGroupID : undefined;

    const payload = {
      ruleGroupId: RuleGroupID,
      ruleGroupName: data.ruleGroupName,
      requirementSetId: this.props.requirementSet.Id,
      coverageTypeId: data.coverageType.value,
      coverageTypeName: data.coverageType.label,
    };

    this.props.commonActions.setLoading(true);
    this.props.reqSetsActions.sendRuleGroup(payload, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        this.setState({
          showModal: false,
          activeModal: null,
          currentData: null,
        });
      }
    });
  }

  onEditRequirementGroup = (data) => {
    const totalActiveProjects = Number(data.totalActiveProyects);
    if (totalActiveProjects > 0) {
      Swal({
        title: 'Are you sure?',
        text: `This requirement group has ${totalActiveProjects} active projects`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2E5965',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          this.openModal('requirementGroup', data);
        }
      });
    } else {
      this.openModal('requirementGroup', data);
    }
  }

  onDeleteRequirementGroup = (id, totalActiveProjects) => {
    const { rules } = this.props.holderRequirementSets;
    const groupRules = rules.filter(el => el.RuleGroupID === id).length;
    totalActiveProjects = Number(totalActiveProjects);

    // IF THERE ARE NO RULES JUST DELETE THE GROUP, IF THERE ARE RULES SHOW A CONFIRMATION PROMPT
    if (groupRules > 0) {
      let msg = `This group has ${groupRules} rule/s`
      if (totalActiveProjects > 0) msg = msg + ` and ${totalActiveProjects} active projects`;
      Swal({
        title: 'Are you sure?',
        text: msg,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2E5965',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          this.doDeleteRuleGroup(id, true);
        }
      });
    } else {
      if (totalActiveProjects > 0) {
        Swal({
          title: 'Are you sure?',
          text: `This rule has ${totalActiveProjects} active projects`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2E5965',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!'
        }).then((result) => {
          if (result.value) {
            this.doDeleteRuleGroup(id, false);
          }
        });
      } else {
        this.doDeleteRuleGroup(id, false);
      }
    }
  };

  doDeleteRuleGroup (ruleGroupId, deleteAllRules = false) {
    const payload = { ruleGroupId, deleteAllRules };
    this.props.commonActions.setLoading(true);
    this.props.reqSetsActions.deleteRuleGroup(payload, () => {
      this.props.commonActions.setLoading(false);
    });
  }

  onSubmitRequirement = (data) => {
    const { RuleGroupID, RuleID } = this.state.currentData;

    let conditionValue = data.conditionValue;
    if (data.conditionValue && (Number(data.conditionTypeId) > 3)) {
      conditionValue = Utils.normalizeCurrency(data.conditionValue);
    }

    const payload = {
      ruleGroupId: RuleGroupID ? RuleGroupID : undefined,
      attributeId: data.attribute.value,
      attributeName: data.attribute.label,
      conditionTypeId: data.conditionTypeId,
      conditionValue: conditionValue,
      deficiencyTypeId: data.deficiencyTypeId,
      deficiencyText: data.deficiencyText,
      ruleId: RuleID ? RuleID : undefined,
    };

    this.props.commonActions.setLoading(true);
    this.props.reqSetsActions.sendRule(payload, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        this.setState({
          showModal: false,
          activeModal: null,
          currentData: null,
        });
      }
    });
  }

  onDeleteRequirement = (data) => {
    this.props.commonActions.setLoading(true);
    this.props.reqSetsActions.deleteRule(data.RuleID, () => {
      this.props.commonActions.setLoading(false);
    });
  }
  
  downloadAttachment = (link) => {
    window.open(link, '_blank');
  }
  
  onSubmitAttachment = (data) => {
    const payload = {
      ...data,
      requirementSetId: this.props.requirementSet.Id,
    };

    this.props.commonActions.setLoading(true);
    this.props.reqSetsActions.sendAttachment(payload, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        this.setState({
          addAttachmentModal: false,
          activeModal: null,
          currentData: null,
        });
      }
    });
  }

  deleteAttachment = (id, documentId) => {
    this.props.commonActions.setLoading(true);
    this.props.reqSetsActions.deleteAttachment(id, documentId, (success) => {
      this.props.commonActions.setLoading(false);

      if (success) {
        this.setState({
          addAttachmentModal: false,
          activeModal: null,
          currentData: null,
        });
      }
    });
  }

  renderAttachments = (attachments) => {
    return (
      <section className="list-view-table">
        <div className="table-wrapper">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col"><span className="col-th-wrapper">Name</span></th>
                <th scope="col"><span className="col-th-wrapper">Actions</span></th>
              </tr>
            </thead>
            <tbody>
            { attachments.map((attachment) => (
              <tr key={attachment.RequirementSets_DocumentID}>
                <td>{attachment.FileName}</td> 
                <td className="attachments-icons">
                  <span
                    className="linear-icon-download"
                    title="Download Attachment"
                    onClick={() => this.downloadAttachment(attachment.Url)}
                  />
                  <span
                    className="linear-icon-cross"
                    title="Remove Attachment"
                    onClick={() => this.deleteAttachment(attachment.RequirementSets_DocumentID, attachment.DocumentID)}
                  />
                </td>
              </tr>
            ))}     
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  onSubmitEndorsement = (data) => {
    const endorsementId = parseInt(data.endorsement, 10);
    const payload = {
      endorsementId: endorsementId,
      requirementSetId: this.props.requirementSet.Id,
      holderId: this.props.holderId,
      checked: true
    };

    if (this.props.holderRequirementSets.reqSetEndorsements.some((e) => e.EndorsementID === endorsementId)) {
      Swal({
        title: 'Are you sure?',
        text: `This endorsement has already been selected`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#2E5965',
        confirmButtonText: 'Ok!'
      })
      return false;
    }   
    
    const selectedEndorsement = this.props.holderRequirementSets.endorsements.find((e) => e.Id === endorsementId);
    // console.log('selected', selectedEndorsement);
    if(selectedEndorsement) {
      payload.name = selectedEndorsement.Name;
      payload.alwaysVisible = false;
    } else {
      return false;
    }
    // console.log(payload);
    this.props.commonActions.setLoading(true);
    this.props.reqSetsActions.sendEndorsement(payload, (success) => {
      this.props.commonActions.setLoading(false);
      if (success) {
        this.setState({
          addEndorsementModal: false,
          activeModal: null,
          currentData: null,
        });
      }
    });
  }

  onDeleteEndorsement = (data) => {
    const {endorsementsList} = this.props.local.strings.endorsements;
    const payload = {
      endorsementId: data.Id,
      requirementSetId: this.props.requirementSet.Id,
      requirementSetEndorsementId: data.requirementSetEndorsementId,
      holderId: this.props.holderId,
      checked: false
    };
    // console.log(payload);

    if (!isNaN(Number(data.totalActiveProyects)) && Number(data.totalActiveProyects) !== 0) {
      Swal({
        title: endorsementsList.editAnchor,
        html: `Are you sure you want to delete the endorsement "<b>${data.Name}</b>"?<br/>`
          + `It has <b>${data.totalActiveProyects}</b> active projects related.`,
        // `<p>Are you sure you want to edit the endorsement "<b>${data.Name}</b>"?</p>. `,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2E5965',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          this.props.commonActions.setLoading(true);
          this.props.reqSetsActions.sendEndorsement(payload, (success) => {
            this.props.commonActions.setLoading(false);
            if (success) {
              this.setState({
                addEndorsementModal: false,
                activeModal: null,
                currentData: null,
              });
            }
          });
        }
      });
    } else {
      this.props.commonActions.setLoading(true);
      this.props.reqSetsActions.sendEndorsement(payload, (success) => {
        this.props.commonActions.setLoading(false);
        if (success) {
          this.setState({
            addEndorsementModal: false,
            activeModal: null,
            currentData: null,
          });
        }
      });
    }
  };

  renderEndorsements = (endorsements) => {
    return endorsements.map((endorsement) => {
      return (
        <div key={endorsement.Id}>
          <div className="card p-2">
            <div className="card-block">
              <div className="row mb-2 d-flex align-items-center">
                <div className="col-md-11">{endorsement.Name}</div>
                {!endorsement.AlwaysVisible && (
                  <div className="col-md-1 requirements-icons">
                    <span className="linear-icon-cross" onClick={() => this.onDeleteEndorsement(endorsement)}/>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
	}
	
	renderRequirementsGroups = (reqGroups) => {
    const {
      addRequirementBtn,
    } = this.props.local.strings.holderRequirementSets.details;
    const { rules } = this.props.holderRequirementSets;
    const { fromDownload } = this.props;

    return reqGroups.map((group) => {
      const groupRules = rules.filter(el => el.RuleGroupID === group.RuleGroupID);
      
      return (
        <div key={group.RuleGroupID}>
          <div className="card p-2">
            <div className="card-block">
              <div className="row mb-2 d-flex align-items-center">
                {!fromDownload && (
                  <div className="col-md-1 requirements-icons">
                    <span className="linear-icon-edit mr-3" onClick={() => this.onEditRequirementGroup(group)} />
                    <span className="linear-icon-cross" onClick={() => this.onDeleteRequirementGroup(group.RuleGroupID, group.totalActiveProyects)}/>
                  </div>
                )}
                <div className="col-md-9">
                  <h5 className="mb-0">{group.RuleGroupName}</h5>
                </div>
                <div className="col-md-2 d-flex justify-content-end">
                  {!fromDownload && (
                    <button
                      className="header-primary-button"
                      onClick={() => this.openModal('requirement', { 
                        RuleGroupID: group.RuleGroupID, 
                        CoverageTypeID: group.CoverageTypeID, 
                      })}
                    >
                      {addRequirementBtn}
                    </button>
                  )}
                </div>
              </div>
              {groupRules.map(this.renderRequirement)}
            </div>
          </div>
        </div>
      );
    });
  }

  renderRequirement = (requirement) => {
    const { conditionPossibleValues } = this.props.holderRequirementSets;
    const condition = conditionPossibleValues.find(el => el.value === requirement.ConditionTypeID);
    const { fromDownload } = this.props;

    return (
      <div className="row align-items-center" key={requirement.RuleID}>
        {!fromDownload && (
          <div className="col-md-1" />
        )}
        <div className={`col-md-${fromDownload ? '4' : '3'}`}>
          {requirement.AttributeName}
        </div>
        <div className="col-md-1 requirement-condition">
          {condition.label.slice(0, 2)}
        </div>
        <div className={`col-md-${fromDownload ? '2' : '1'}`}>
          {(Number(requirement.ConditionTypeID) > 3) ? Utils.formatCurrency(requirement.ConditionValue) : requirement.ConditionValue}
        </div>
        <div className="col-md-4">
          {requirement.DeficiencyText}
        </div>
        <div className="col-md-1">
          {Number(requirement.DeficiencyTypeID) === 1 ? 'Major' : 'Minor'}
        </div>
        {!fromDownload && (
          <div className="col-md-1 requirements-icons">
            <span className="linear-icon-edit mr-3" onClick={() => this.openModal('requirement', requirement)} />
            <span className="linear-icon-cross" onClick={() => this.onDeleteRequirement(requirement)}/>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { showModal } = this.state;
    const { fromDownload, fromHolderTab, requirementSet } = this.props;
    const { totalOfActiveProyects } = requirementSet;
    const isTemplate = requirementSet.Template === 1 ? true : false;    
    const {
      attachments, 
      endorsements, 
      reqSetEndorsements,
      rulesGroups,
    } = this.props.holderRequirementSets;    
    const {
      backToList,
      nameLabel,
      descriptionLabel,
      systemLabel,
      editInformationBtn,
      requirementsTitle,
      addRequirementGroupBtn,
      addEndorsementBtn,
      attachmentsTitle,
      addAttachmentBtn,
      endorsementsTitle,
      noEndorsements,
      noAttachment,
      noRequirementGroup,
    } = this.props.local.strings.holderRequirementSets.details;

    const endorsementList = [];

    if (reqSetEndorsements.length > 0) {
      reqSetEndorsements.forEach((e) => {
        if (! endorsementList.some((f) => f.Id === e.Id)) {
          endorsementList.push({
            Id: e.EndorsementID,
            Name: e.EndorsementName,
            requirementSetEndorsementId: e.RequirementSet_EndorsementID,
            AlwaysVisible: e.AlwaysVisible,
            totalActiveProyects: e.totalActiveProyects
          });
        }        
      });
    }
    
    if (endorsements.length > 0) {
      endorsements.forEach((e) => {
        if ((e.AlwaysVisible === true) && (! endorsementList.some((f) => f.Id === e.Id))) {
          endorsementList.unshift(e);
        }
      });
    }

    return (
      <div className="list-view admin-view-body holder-requirement-sets-list-view">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            {this.renderModal()}
          </Modal.Body>
        </Modal>

        <div className="back-to-header">
          <button className="header-primary-button" onClick={this.props.closeDetails}>
            {backToList}
          </button>
        </div>

        <div className="card mb-2 p-2">
          <div className="card-block">
            <div className="row">
              <div className="col-6">
                <p><strong>{nameLabel}:</strong>&nbsp; {this.props.requirementSet.Name}</p>
                <p><strong>{descriptionLabel}:</strong>&nbsp; {this.props.requirementSet.Description}</p>
              </div>
              <div className="col-6">
                <p>
                  <strong>{systemLabel}:</strong>&nbsp;
                </p>
                {!fromHolderTab && (
                  <button className="header-primary-button" onClick={() => this.openModal('basicInfo')}>
                    {editInformationBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mb-2 mt-3">
          <div className="col-12 d-flex align-items-center">
            <h4 className="mb-0 mr-3">{requirementsTitle}</h4>
            <button className="header-primary-button" onClick={() => this.openModal('requirementGroup')}>
              {addRequirementGroupBtn}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 requirements-groups">
            {rulesGroups.length > 0 ?
              this.renderRequirementsGroups(rulesGroups) :
              <h6>{noRequirementGroup}</h6>
            }
          </div>
        </div>

        {!isTemplate && (
          <div className="row">

            <div className="col-12">

              <div className="row mb-2 mt-3">
                <div className="col-6 d-flex align-items-center">
                  <h4 className="mb-0 mr-3">{endorsementsTitle}</h4>
                {!fromHolderTab && !isTemplate && (
                  <button className="header-primary-button" onClick={() => this.openModal('endorsements')}>
                    {addEndorsementBtn}
                  </button>
                )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  {endorsementList.length > 0 
                    ? this.renderEndorsements(endorsementList) 
                    : <h6>{noEndorsements}</h6>
                  }
                </div>
              </div>     

              <div className="row mb-2 mt-3">
                <div className="col-6 d-flex align-items-center">
                  <h4 className="mb-0 mr-3">{attachmentsTitle}</h4>
                {!fromHolderTab && !isTemplate && (  
                  <button className="header-primary-button" onClick={() => this.openModal('attachment')}>
                    {addAttachmentBtn}
                  </button>
                )}  
                </div>
              </div>
              <div className="row">              
                <div className="col-6">
                  {attachments.length > 0 
                    ? this.renderAttachments(attachments)
                    : <h6>{noAttachment}</h6>
                  }
                </div>
              </div>

            </div>
          </div>          
        )}
        
      </div>
    );
  }
  
};

const mapStateToProps = (state) => {
  return {
    holderRequirementSetsView: state.holderRequirementSetsView,
    holderRequirementSets: state.holderRequirementSets,
    local: state.localization,
    login: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    reqSetsActions: bindActionCreators(reqSetsActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequirementSetsView);
