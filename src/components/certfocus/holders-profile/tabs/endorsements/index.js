import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../../../common/ptable';
import AddEndorsementsModal from '../../../modals/addEndorsementsModal';
import FilterEndorsements from './filter';
import Utils from '../../../../../lib/utils';

import * as commonActions from '../../../../common/actions';
import * as actions from './actions';
import RolAccess from './../../../../common/rolAccess';

import './Endorsements.css';
import Swal from "sweetalert2";

class Endorsements extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        name: '',
        url: '',
        code: '',
        alwaysVisible: '',
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
        url: 'desc',
        code: 'desc',
        alwaysVisible: 'desc',
      },
      currentEndorsement: null,
			showFilterBox: false,
			showNoEditModal: false,
    };
  }

  componentDidMount() {
    const { actions, holderId } = this.props;

    actions.fetchEndorsements({
      orderBy: 'name',
      orderDirection: 'ASC',
      ...(holderId && { holderId }),
    });
  }

  addId = (query) => {
    const { holderId } = this.props;

    if (holderId) {
      return { ...query, holderId };
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchEndorsements(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        url: field === 'url' ? 'asc' : 'desc',
        code: field === 'code' ? 'asc' : 'desc',
        alwaysVisible: field === 'code' ? 'asc' : 'desc',
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

      // add search filters
      preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

      const query = this.addId(preQuery);

      // fetch using query
      this.props.actions.fetchEndorsements(query);

      // save page number
      this.setState({
        filter: {
          pageNumber,
        }
      });
    }
  }

  submitFilterForm = (values) => {
    // get base query
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    const filterBox = {
      name: values.name || "",
      url: values.url || "",
      code: values.code || "",
      alwaysVisible: values.alwaysVisible || "",
    };

    preQuery = Utils.addSearchFiltersToQuery(preQuery, filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchEndorsements(query);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openEdit = (data, totalActiveProyects) => {
    const {endorsementsList} = this.props.local.strings.endorsements;
    if (totalActiveProyects !== 0) {
      Swal({
        title: endorsementsList.editAnchor,
        html: `Are you sure you want to edit the Additional Requirement "<b>${data.Name}</b>"?<br/>`
        + `It has <b>${totalActiveProyects}</b> active projects related.`,
          // `<p>Are you sure you want to edit the endorsement "<b>${data.Name}</b>"?</p>. `,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2E5965',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then((result) => {
        if (result.value) {
          this.setState({
            currentEndorsement: data,
          }, this.openModal);
        }
      });
    } else {
      this.setState({
        currentEndorsement: data,
      }, this.openModal);
    }
  };

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModalAndRefresh = (update) => {
    this.props.actions.setShowModal(false);

    if (update) this.setPageFilter(null, 1, true);

    this.setState({
      currentEndorsement: null
    });
  }

  renderButtonAddEndorsement() {
    let component = (
      <a onClick={this.openModal}
        className="nav-btn nav-bn icon-add"
      >
        {this.props.local.strings.endorsements.endorsementsList.addBtn}
      </a>
    );

    return component;
  }

  renderButtonEditEndorsement(endorse, totalActiveProyects) {
    let component = (
      <a
        onClick={() => this.openEdit(endorse, totalActiveProyects)}
        className="cell-table-link icon-edit"
      >
        {this.props.local.strings.endorsements.endorsementsList.editAnchor}
      </a>
    );
    return component;
	}
	
	openNoEditModal = () => {
		this.setState({ showNoEditModal: true });
	}
	
	closeNoEditModal = () => {
		this.setState({ showNoEditModal: false });
	}

  render() {
    const {
      nameColumn,
      urlColumn,
      codeColumn,
      alwaysVisibleColumn,
      editAnchor,
      filterBtn,
      addBtn,
    } = this.props.local.strings.endorsements.endorsementsList;

    const TableMetadata = {
      fields: [
        'name',
        'url',
        'code',
        'alwaysVisible',
        'edit',
      ],
      header: {
        name: nameColumn,
        url: urlColumn,
        code: codeColumn,
        alwaysVisible: alwaysVisibleColumn,
        edit: '',
      },
    };

    const TableBody = this.props.endorsements.list.map((endorse) => {
      const {
        Name,
        URL,
        Code,
				AlwaysVisible,
				totalActiveProyects,
      } = endorse;

      return {
        name: Name,
        url: URL,
        code: Code,
        alwaysVisible: (AlwaysVisible) ? 'Yes' : 'No',
        edit: (
          <RolAccess
            masterTab="endorsements"
            sectionTab="edit_endorsement"
            component={() => this.renderButtonEditEndorsement(endorse, totalActiveProyects)}>
          </RolAccess>
        ),
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalAmountOfEndorsements,
      endorsementsPerPage,
      fetching,
      showModal,
    } = this.props.endorsements;

    const paginationSettings = {
      total: totalAmountOfEndorsements,
      itemsPerPage: endorsementsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body endorsements-list">
        <Modal
          show={showModal}
          onHide={this.closeModalAndRefresh}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <AddEndorsementsModal
              endorsement={this.state.currentEndorsement}
              holderId={this.props.holderId}
              close={this.closeModalAndRefresh}
            />
          </Modal.Body>
        </Modal>

        <div className="endorsements-list-header">
          <div>
            <a
              onClick={() => this.setState({ showFilterBox: !this.state.showFilterBox })}
              className="nav-btn icon-login-door"
            >
              {filterBtn}
            </a>
          </div>

          <div>
            <RolAccess
              masterTab="endorsements"
              sectionTab="add_endorsement"
              component={() => this.renderButtonAddEndorsement()}>
            </RolAccess>

          </div>
        </div>

        {this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterEndorsements
              onSubmit={this.submitFilterForm}
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
					<Modal
          show={this.state.showNoEditModal}
          onHide={this.closeNoEditModal}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
						<div className="add-item-view add-entity-form-small">
							<div style={{ display: 'inline-block', color: '#FF0000' }}>
								<h1>{'Action not allowed'}</h1>
							</div>
							<section className="white-section">
								<div style={{ display: 'inline-block', color: '#FF0000' }}>
									{`The item has an associated active proyect`}
								</div>
							</section>
						</div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    endorsements: state.endorsements,
    local: state.localization,
    login: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Endorsements);
