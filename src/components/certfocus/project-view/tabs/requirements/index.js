import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import PTable from '../../../../common/ptable';
import Utils from '../../../../../lib/utils';

import RequirementSetView from '../../../requirement-sets-view';
import * as commonActions from '../../../../common/actions';
import * as actions from './actions';
import * as requirementSetsActions from './../../../requirement-sets/actions';
import * as projectDetailsActions from './../../../project-view/actions';
import {Modal} from 'react-bootstrap';
import AddReqSetFromProyectModal from '../../../modals/addReqSetFromProyectModal';

import './Requirements.css';

class Requirements extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1,
      },
      tableOrderActive: 'ruleGroupName',
      order: {
        ruleGroupName: 'asc',
        attributeName: 'desc',
        conditionTypeID: 'desc',
        conditionValue: 'desc',
        deficiencyTypeID: 'desc',
      },
      currentSet: null,
      openRequirementSetModal: false,
    };
  }

  componentDidMount() {
    const {actions, projectDetails} = this.props;

    if (projectDetails.projectData.RequirementSetID) {
      actions.fetchRequirements({
        orderBy: 'DisplayOrder',
        orderDirection: 'ASC',
        coverageArchived: 0,
        ...(projectDetails && {requirementSetId: projectDetails.projectData.RequirementSetID}),
      });
    }
  }

  addId = (query) => {
    const {projectDetails} = this.props;

    if (projectDetails) {
      return {...query, requirementSetId: projectDetails.projectData.RequirementSetID};
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchRequirements(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        ruleGroupName: field === 'ruleGroupName' ? 'asc' : 'desc',
        attributeName: field === 'attributeName' ? 'asc' : 'desc',
        conditionTypeID: field === 'conditionTypeID' ? 'asc' : 'desc',
        conditionValue: field === 'conditionValue' ? 'asc' : 'desc',
        deficiencyTypeID: field === 'deficiencyTypeID' ? 'asc' : 'desc',
      },
    };

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {

      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.actions.fetchRequirements(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        },
      });
    }
  }

  openDetails = () => {
    const data = this.props.projectDetails.projectData;
    const requirementSetId = data.RequirementSetID;
    const holderId = data.holderId;
    const payload = {
      Id: requirementSetId,
      HolderId: holderId
    };

    this.props.commonActions.setLoading(true);
    // Fetch set groups and then fetch all the rules and documents
    this.props.requirementSetsActions.fetchRuleGroup(payload, (success) => {
      if (success) {
        const groupsId = this.props.holderRequirementSets.rulesGroups.map(el => el.RuleGroupID);

        return this.props.requirementSetsActions.fetchMultipleRulesAndDocuments(groupsId, requirementSetId, holderId, (success) => {
          this.props.commonActions.setLoading(false);
          if (success) {
            this.setState({
              currentSet: requirementSetId,
              isCurrentSetTemplate: holderId == null ? true : false,
            });
          }
        });

      } else {
        this.props.commonActions.setLoading(false);
      }
    });
  }

  closeDetails = () => {
    this.setState({
      currentSet: null,
    });
  }

  openRequirementSetModal = () => {
    this.setState({openRequirementSetModal: true});
  }

  closeRequirementSetModal = () => {
    this.setState({openRequirementSetModal: false});
  }

  onCloseRequirementSetModalAndRefresh = () => {
    const {id} = this.props.projectDetails.projectData;
    this.props.projectDetailsActions.fetchProject(id);

    this.setState({openRequirementSetModal: false});
  }

  render() {
    const {
      nameColumn,
      attributeColumn,
      conditionColumn,
      valueColumn,
      typeColumn,
      requirementDocumentTitle,
      inherittedFlagTitle,
      noReqSetMessage,
    } = this.props.local.strings.projectRequirements.list;

    const {deficiencyTypeOptions, conditionPossibleValues} = this.props.holderRequirementSets;

    const TableMetadata = {
      fields: [
        'ruleGroupName',
        'attributeName',
        'conditionTypeID',
        'conditionValue',
        'deficiencyTypeID',
      ],
      header: {
        ruleGroupName: nameColumn,
        attributeName: attributeColumn,
        conditionTypeID: conditionColumn,
        conditionValue: valueColumn,
        deficiencyTypeID: typeColumn,
      },
    };

    const TableBody = this.props.projectRequirements.list.map((requirement) => {
      const {
        RuleGroupName,
        AttributeName,
        ConditionTypeID,
        ConditionValue,
        DeficiencyTypeID,
      } = requirement;

      const deficiencyValue = deficiencyTypeOptions.find(deficiency => deficiency.value === DeficiencyTypeID);
      const conditionValue = conditionPossibleValues.find(condition => condition.value === ConditionTypeID);

      return {
        ruleGroupName: RuleGroupName,
        attributeName: AttributeName,
        conditionTypeID: conditionValue.label,
        conditionValue: isNaN(ConditionValue) ? ConditionValue : Utils.formatCurrency(ConditionValue),
        deficiencyTypeID: deficiencyValue.label,
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfRequirements,
      requirementsPerPage,
      fetching,
    } = this.props.projectRequirements;

    const paginationSettings = {
      total: totalAmountOfRequirements,
      itemsPerPage: requirementsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    if (!this.props.projectDetails.projectData.RequirementSetID) {
      return (
        <div className="list-view admin-view-body project-requirements-list">
          <div className="text-center">
            <div className="col-md-6" style={{justifyContent: 'flex-end'}}>
              <button className="header-primary-button" onClick={this.openRequirementSetModal}>Add Requirement Set
              </button>
            </div>
            <h5>{noReqSetMessage}</h5>
            <Modal
              show={this.state.openRequirementSetModal}
              onHide={this.closeRequirementSetModal}
              className="add-item-modal add-hc">
              <Modal.Body className="add-item-modal-body mt-0">
                <AddReqSetFromProyectModal
                  close={this.onCloseRequirementSetModalAndRefresh}
                  onHide={this.closeRequirementSetModal}
                  project={this.props.projectDetails.projectData}
                />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      );
    }

    // for requirementSet edition
    const {currentSet, isCurrentSetTemplate} = this.state;
    const currentResult = this.props.projectRequirements.list.filter(el => el.Id === currentSet);

    return (
      <div className="list-view project-requirements-list">

        {(this.props.projectRequirements.list.length === 0) ?
          (<div className="row mb-3" style={{ paddingTop: '30px'}}>
              <div className="col" style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button className="header-primary-button" onClick={this.openRequirementSetModal}>Add Requirement Set
                </button>
              </div>
            </div>) :
          (!currentSet) && (
            <div className="row mb-3" style={{ paddingTop: '30px'}}>
              <div className="col" style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button className="header-primary-button" onClick={() => this.openDetails()}>Edit Requirement Set</button>
              </div>
            </div>
          )}

        {(currentSet && !this.props.holderRequirementSets.fetching) ? (
          <RequirementSetView
            requirementSet={currentResult[0]}
            closeDetails={this.closeDetails}
            closeModal={this.closeModal}
            fromHolderTab={this.props.fromHolderTab}
          />
        ) : (
          <PTable
            sorted={true}
            items={templatesTableData}
            wrapperState={this.state}
            tableOrderActive={this.state.tableOrderActive}
            clickOnColumnHeader={this.clickOnColumnHeader}
            isFetching={fetching}
            pagination={paginationSettings}
          />
        )}
        <Modal
          show={this.state.openRequirementSetModal}
          onHide={this.closeRequirementSetModal}
          className="add-item-modal add-hc">
          <Modal.Body className="add-item-modal-body mt-0">
            <AddReqSetFromProyectModal
              close={this.onCloseRequirementSetModalAndRefresh}
              onHide={this.closeRequirementSetModal}
              project={this.props.projectDetails.projectData}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    projectRequirements: state.projectRequirements,
    local: state.localization,
    login: state.login,
    projectDetails: state.projectDetails,
    holderRequirementSets: state.holderRequirementSets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    requirementSetsActions: bindActionCreators(requirementSetsActions, dispatch),
    projectDetailsActions: bindActionCreators(projectDetailsActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Requirements);
