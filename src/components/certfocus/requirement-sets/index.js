import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

import PTable from '../../common/ptable';
import AddRequirementSetsModal from '../modals/addRequirementSetModal';
import FilterRequirementSets from './filter';
import Utils from '../../../lib/utils';
import RequirementSetDetails from './details';
import RequirementSetView from '../requirement-sets-view';

import * as commonActions from '../../common/actions';
import * as usersActions from '../../users/actions';
import * as actions from './actions';

import './RequirementSets.css';

class RequirementSets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        name: '',
        description: '',
        holderId: '',
        archived: '0',
        holderSetId: ''
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        description: 'desc',
        holderName: 'desc',
        holderSetId: 'desc',
        archived: 'desc'
      },
      currentModalSet: null,
      currentSet: null,
      showFilterBox: false,
      downloadData: false,
      isCurrentSetTemplate: false,
    };

    // TODO: REMOVE IF NOT NECESSARY
    if (!props.fromHolderTab) props.usersActions.fetchHiringClients();
  }

  componentDidMount() {
    const { actions, match } = this.props;

    const query = this.addId({
      orderBy: 'name',
      orderDirection:'ASC',
      archived: '0',
    });

    actions.fetchRequirementSets(query);
    actions.fetchHolderSetIdsPossibleValues();

    if (match.params.reqSetId) {
      this.openDetails({ Id: Number(match.params.reqSetId) });
    }
  }

  addId = (query) => {
    const { holderId } = this.props;

    if (holderId) {
      return { ...query, holderId };
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit'  || field === 'view' || field === 'download' || field === 'copy') {
      return;
    }

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchRequirementSets(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        description: field === 'description' ? 'asc' : 'desc',
        holderName: field === 'holderName' ? 'asc' : 'desc',
        holderSetId: field === 'holderSetId' ? 'asc' : 'desc',
        archived: field === 'archived' ? 'asc' : 'desc',
      },
    };

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if(force || this.state.filter.pageNumber !== pageNumber) {

      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
      let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.actions.fetchRequirementSets(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        }
      });
    }
  }

  submitFilterForm = (values)=> {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    const filterBox = {
      name: values.name || "",
      description: values.description || "",
      holderId: values.holderId || "",
      archived: values.archived || "",
      holderSetId: values.holderSetId || "",
    };
    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchRequirementSets(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1,
      },
    });
  }

  openDetails = (data) => {
    this.props.commonActions.setLoading(true);
    // Fetch set groups and then fetch all the rules and documents
    this.props.actions.fetchRuleGroup(data, (success) => {
      if (success) {
        const groupsId = this.props.holderRequirementSets.rulesGroups.map(el => el.RuleGroupID);
                
        return this.props.actions.fetchMultipleRulesAndDocuments(groupsId, data.Id, data.HolderId, (success) => {
          this.props.commonActions.setLoading(false);
          if (success) {
            this.setState({
              currentSet: data.Id,
              isCurrentSetTemplate: data.HolderId == null ? true : false,
            });
          }
        });

      } else {
        this.props.commonActions.setLoading(false);
      }
    });
  }

  openSettingsDetails = (data) => {
    // Fetch set groups and then fetch all the rules and documents
    this.props.actions.fetchRuleGroup(data, (success) => {
      if (success) {
        const groupsId = this.props.holderRequirementSets.rulesGroups.map(el => el.RuleGroupID);
        return this.props.actions.fetchMultipleRulesAndDocumentsForSettings(groupsId, data.Id, (success) => {
          this.props.commonActions.setLoading(false);
          if (success) {
            this.setState({
              currentSet: data.Id,
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

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  openEdit = (reqSet) => {
    this.setState({
      currentModalSet: reqSet,
    });

    this.props.actions.setShowModal(true);
  }

  closeModal = (update) => {
    if (update) {
      this.props.actions.setShowModal(false);
      this.setPageFilter(null, 1, true);
      this.setState({
        currentModalSet: null,
      });
    }
  }

  hideModal = () => {
    this.props.actions.setShowModal(false);

    this.setState({
      currentModalSet: null,
    });
  }

  onCopy = (reqSet) => {
    this.setState({
      currentModalSet: reqSet,
    });
    const { holderId } = this.props;
    const {
      title,
      description,
      confirmButton,
      cancelButton
    } = this.props.local.strings.holderRequirementSets.list.duplicate;

    Swal({
      title: title,
      text: description,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2E5965',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButton
    }).then((result) => {
      console.log('ALERT:', result);
      if (result.value) {
        this.props.actions.duplicateReqSet({ holderId: holderId, reqSetId: this.state.currentModalSet.Id }, (success) => {
          this.closeModal(true);
        });
      }
    });

  }

  onDownload = (data) => {
    this.props.commonActions.setLoading(true);

    // Fetch set groups and then fetch all the rules and documents
    this.props.actions.fetchRuleGroup(data, (success) => {
      if (success) {
        const groupsId = this.props.holderRequirementSets.rulesGroups.map(el => el.RuleGroupID);

        return this.props.actions.fetchMultipleRulesAndDocuments(groupsId, data.Id, this.props.holderId, (success) => {
          this.props.commonActions.setLoading(false);

          if (success) {
            this.setState({
              downloadData: true,
              currentSet: data.Id,
            }, () => {
              const input = document.getElementById('divToPrint');
              const pdfOptions = {
                margin:       0.1,
                filename:     'myfile.pdf',
                image:        { type: 'jpeg', quality: 0.5 },
                html2canvas:  { scale: 1 },
                jsPDF:        { unit: 'in', orientation: 'portrait', format: 'letter' },
                pagebreak:    { mode: 'avoid-all' }
              };

              html2pdf().set(pdfOptions).from(input).save();
            });
          }
        });
      } else {
        this.props.commonActions.setLoading(false);
      }
    });
  }

  render() {
    const {
      nameColumn,
      descriptionColumn,
      viewLinkColumn,
      editLinkColumn,
      downloadLinkColumn,
      copyLinkColumn,
      holderColumn,
      holderSetIdColumn,
      archivedColumn,
      addBtn,
      filterBtn,
    } = this.props.local.strings.holderRequirementSets.list;
    const { fromHolderTab, fromSettingsTab } = this.props;

    const TableMetadata = {
      fields: [
        'name',
        ...(fromHolderTab ? [
            'description',
            'archived',
            'view',
            'edit',
            'download',
            'copy',
          ] : [
            'holderName',
            'holderSetId',
            'archived',
            'view',
            'edit',
          ]
        ),

      ],
      header: {
        name: nameColumn,
        ...(fromHolderTab ? {
          description: descriptionColumn,
          archived: archivedColumn,
          view: '',
          edit: '',
          download: '',
          copy: '',
        } : {
          holderName: holderColumn,
          holderSetId: holderSetIdColumn,
          archived: archivedColumn,
          view: '',
          edit: ''
        }),
      },
    };

    const TableBody = this.props.holderRequirementSets.list.map((reqSet) => {
      const {
        Name,
        Description,
        HolderName,
        HolderSetID,
				Archived,
				totalOfActiveProyects,
      } = reqSet;

      return {
        name: Name,
        ...(fromHolderTab ? {
          description: Description,
          archived: Archived ? 'True' : 'False',
          view: (
            <a
              className="cell-table-link icon-quick_view"
              onClick={() => this.openDetails(reqSet)}
            >
              {viewLinkColumn}
            </a>
          ),
          edit: (HolderSetID && (totalOfActiveProyects === 0)) ? (
            <a
              className="cell-table-link icon-edit"
              onClick={() => this.openEdit(reqSet)}
            >
              {editLinkColumn}
            </a>
          ) : (<span></span>),
          download: (
            <a
              className="cell-table-link icon-save"
              onClick={() => this.onDownload(reqSet)}
            >
              {downloadLinkColumn}
            </a>
          ),
          copy: (
            <a
              className="cell-table-link icon-duplicate"
              onClick={() => this.onCopy(reqSet)}
            >
              {copyLinkColumn}
            </a>
          ),
        } : {
          holderName: HolderName,
          holderSetId: HolderSetID,
          archived: Archived ? 'True' : 'False',
          view: (
            <a onClick={fromSettingsTab ? () => this.openSettingsDetails(reqSet) : () => this.openDetails(reqSet)}
              className="cell-table-link icon-quick_view" >
              {viewLinkColumn}
            </a>
          ),
          edit: (totalOfActiveProyects === 0) ? (
            <a onClick={() => this.openEdit(reqSet)}
              className="cell-table-link icon-edit" >
              {editLinkColumn}
            </a>
          ) : (<span></span>),
        }),
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfRequirementSets,
      requirementSetsPerPage,
      fetching,
      showModal,
    } = this.props.holderRequirementSets;

    const paginationSettings = {
      total: totalAmountOfRequirementSets,
      itemsPerPage: requirementSetsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    const { currentSet, downloadData, isCurrentSetTemplate } = this.state;
    const currentResult = this.props.holderRequirementSets.list.filter(el => el.Id === currentSet);
    
    if (currentSet && !this.props.holderRequirementSets.fetching && !downloadData) {
      if (fromSettingsTab || isCurrentSetTemplate) {
        return (
          <RequirementSetView
            requirementSet={currentResult[0]}
            closeDetails={this.closeDetails}
            closeModal={this.closeModal}
            fromHolderTab={this.props.fromHolderTab}
          />
        );
      } else {
        return (
          <RequirementSetDetails
            requirementSet={currentResult[0]}
            fromHolderTab={this.props.fromHolderTab}
            closeDetails={this.closeDetails}
            holderId={this.props.holderId}
            closeModal={this.closeModal}
          />
        );
      }
    }
    
    return (
      <div className="list-view admin-view-body holder-requirement-sets-list">
        <Modal
          show={showModal}
          onHide={this.hideModal}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <AddRequirementSetsModal
              fromHolderTab={this.props.fromHolderTab}
              requirementSet={this.state.currentModalSet}
              close={this.closeModal}
              onHide={this.hideModal}
              holderId={this.props.holderId}
            />
          </Modal.Body>
        </Modal>

        <div className="holder-requirement-sets-list-header">
          <div>
            <a
              onClick={() => this.setState({ showFilterBox: !this.state.showFilterBox })}
              className="nav-btn icon-login-door"
            >
              {filterBtn}
            </a>
          </div>

          <div>
            <a onClick={this.openModal}
              className="nav-btn nav-bn icon-add"
            >
              {addBtn}
            </a>
          </div>
        </div>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterRequirementSets
              hiringClients={this.props.users.hiringClientsOptions}
              fromHolderTab={this.props.fromHolderTab}
              onSubmit={this.submitFilterForm}
              availableHolderSetIds={this.props.holderRequirementSets.holderSetIdsPossibleValuesResults || []}
            />
          </section>
        }

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetching}
          pagination={paginationSettings}
        />

        {/* HIDDEN DIV FOR HTML2CANVAS */}
        <div style={{ overflow: 'hidden', height: 0}}>
          <div id="divToPrint" className="mt4" style={{
            backgroundColor: '#f5f5f5',
            width: '210mm',
            minHeight: '297mm',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {downloadData &&
              <RequirementSetDetails
                requirementSet={currentResult[0]}
                fromHolderTab={this.props.fromHolderTab}
                fromDownload
                closeDetails={this.closeDetails}
                holderId={this.props.holderId}
                closeModal={this.closeModal}
              />
            }
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    holderRequirementSets: state.holderRequirementSets,
    local: state.localization,
    login: state.login,
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    usersActions: bindActionCreators(usersActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequirementSets));
