import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import * as actions from "./actions";
import * as commonActions from "../../../common/actions";

import './departments.css';
import {Modal} from "react-bootstrap";
import AddDepartmentModal from "../../modals/addDepartmentModal";
import {showQuickConfirmation} from "../../../alerts";
import RolAccess from "../../../common/rolAccess";
import PTable from "../../../common/ptable";
import Utils from "../../../../lib/utils";
import FilterDepartments from "./filter";
import DepartmentsUsersList from "./departmentsUsers";
import Swal from "sweetalert2";

class Departments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        name: '',
        archived: 0,
      },
      tableOrderActive: 'name',
      order: {
        name: 'asc',
      },
      showFilterBox: false,
      showNoEditModal: false,
      currentDepartment: null,
      showDepartmentUsers: false,
    };

  }

  componentDidMount() {
    const {actions} = this.props;

    actions.getDepartments({
      orderBy: this.state.tableOrderActive,
      orderDirection: 'ASC',
      archived: 0,
    });
  }

  openModal = () => {
    this.props.actions.setShowModal(true);
  }

  closeModalAndRefresh = () => {
    this.props.actions.setShowModal(false);
    this.setState({
      currentDepartment: null
    });
    this.props.actions.getDepartments({
      orderBy: this.state.tableOrderActive,
      orderDirection: 'ASC',
      archived: 0,
    });
    this.setPageFilter(null,1, true);
  }
  closeModal = () => {
    this.props.actions.setShowModal(false);
    this.setState({
      currentDepartment: null
    });
  }

  handleSubmit = (values) => {
    this.props.actions.setFetchingDepartments(true);

    const callback = (success) => {
      this.props.actions.setFetchingDepartments(false);
      if (success) {
        showQuickConfirmation({
          title: this.props.locale.form.success,
          timer: 1500,
        });
        this.closeModalAndRefresh();
      } else {
        showQuickConfirmation({
          title: this.props.locale.form.fail,
          timer: 3000,
        });
      }
    }
    let payload = {
      name: values.name,
    };

    if (this.state.currentDepartment) {
      payload.id = this.state.currentDepartment.id
    };

    this.props.actions.sendDepartment(payload, callback)
  }

  renderAddButton = () => {
    return (
      <div>
        <a onClick={this.openModal}
           className="nav-btn nav-bn icon-add"
        >
          {this.props.locale.buttonAdd}
        </a>
      </div>
    )
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'edit' || field === 'users' || field === 'archived' ) return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let queryFilters = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    queryFilters = Utils.addSearchFiltersToQuery(queryFilters, this.state.filterBox);

    // fetch using query
    this.props.actions.getDepartments(queryFilters);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
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
      let queryParams = Utils.getFetchQuery(field, pageNumber, orderDirection);

      // add search filters
      queryParams = Utils.addSearchFiltersToQuery(queryParams, this.state.filterBox);

      // fetch using query
      this.props.actions.getDepartments(queryParams);

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
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let queryParams = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    let filterBox = {
      name: values.name || "",
    };
    if (values.archived === '-1') {
      filterBox.archived = '';
    } else if (values.archived === "1") {
      filterBox.archived = 1;
    } else {
      filterBox.archived = 0;
    }
    queryParams = Utils.addSearchFiltersToQuery(queryParams, filterBox);

    // fetch using query
    this.props.actions.getDepartments(queryParams);

    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1,
      }
    });
  }

  openEditModal = (data) => {
    this.setState({
      currentDepartment: data,
    }, this.openModal)
  }

  renderButtonEditDepartment = (data) => {
    if (!data.archived) {
      return (
        <a onClick={() => this.openEditModal(data)}
           className={'cell-table-link icon-edit'}
        >{this.props.locale.table.actions.edit}</a>
      )
    }
    return false;
  }

  renderButtonArchiveDepartment = (data) => {
    return (
      <a onClick={() => this.toogleDepartmentStatus(data)}
         className={'cell-table-link icon-delete'}
      >{this.props.locale.table.actions.archive}</a>
    )
  }

  toogleDepartmentStatus = (data) => {
    const payload = {
      id: data.id,
      archived: (data.archived === true)? 0 : 1
    }

    const {
      alertTitle,
      alertHTML,
      archiveSuccess,
      archiveFail,
      restoreSuccess,
      restoreFail,
    } = this.props.locale.archiveDepartment;

    if (data.activeHolders >= 1) {
      Swal({
        title: alertTitle,
        html: alertHTML,
        type: 'error',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        showConfirmButton: false,
      }).then( (result) => {
        //DO NOTHING
      });
    } else {

      //DEFAULT IS ARCHIVE A DEPARTMENT
      let actionSuccess = archiveSuccess;
      let actionFail = archiveFail;
      if (payload.archived === 0) {
        actionSuccess = restoreSuccess;
        actionFail = restoreFail;
      }

      this.props.actions.sendDepartment(payload, (success) => {
        if (success) {
          showQuickConfirmation({
            title: actionSuccess,
            timer: 1500,
          });
          let queryFilters = Utils.getFetchQuery(this.state.tableOrderActive, this.state.pageNumber, 'asc');
          queryFilters = Utils.addSearchFiltersToQuery(queryFilters, this.state.filterBox);
          this.props.actions.getDepartments(queryFilters);
        } else {
          showQuickConfirmation({
            title: actionFail,
            timer: 3000,
          });
        }
      });
    }


  }

  renderButtonRestoreDepartment = (data) => {
    return (
      <a
        onClick={() => this.toogleDepartmentStatus(data)}
        className="cell-table-link icon-if_upload_103738"
      >{this.props.locale.table.actions.restore}</a>
    )
  }

  openDepartmentUsersModal = (data) => {

    const queryParams = {
      departmentId:data.id,
    }
    this.props.actions.getDepartmentUsers(queryParams)
      .then( () => {
        this.setState({
          currentDepartment: data,
          showDepartmentUsers: true,
        });
      })




  }

  closeDepartmentUsersModal = () => {
    this.setState({
      currentDepartment: null,
      showDepartmentUsers: false,
    })
  }

  renderButtonDepartmentUsers = (data) => {
    return (
      <a
        onClick={() => this.openDepartmentUsersModal(data)}
        className="cell-table-link icon-quick_view"
      >{this.props.locale.table.actions.users}</a>
    )
  }

  renderDepartmentActionLink = (data) => {
    if (data.archived) {
      return this.renderButtonRestoreDepartment(data);
    } else {
      return this.renderButtonArchiveDepartment(data);
    }
  }

  render() {

    const {
      locale
    } = this.props;

    // MODAL CONFIGURATION -- START
    const {
      showModal,
      showUsersModal,
    } = this.props.departments;

    const titleText = locale.modal.title;
    // MODAL CONFIGURATION -- END

    // DEPARTMENTS TABLE CONFIGURATION -- START
    const {columns, actions} = locale.table;

    const TableMetadata = {
      fields: ['name', 'created', 'archived', 'edit', 'archive', 'users'],
      header: {
        name: columns.name,
        created: columns.created,
        archived: columns.archived,
        edit: '',
        archive: '',
        users: '',
      },
    };

    const TableBody = this.props.departments.list.map((definition) => {
      const {id, name, created, archived,} = definition;

      return {
        name: name,
        created: Utils.getFormattedDate(created, true),
        archived: (archived) ? 'Yes' : 'No',
        edit: this.renderButtonEditDepartment(definition),
        archive: this.renderDepartmentActionLink(definition),
        users: this.renderButtonDepartmentUsers(definition),
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    const paginationSettings = {
      total: this.props.departments.totalCount,
      itemsPerPage: this.props.departments.itemsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };
    // DEPARTMENTS TABLE CONFIGURATION -- END


    return (
      <div className="list-view admin-view-body">

        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small"
        >
          <Modal.Body>
            <AddDepartmentModal
              title={titleText}
              handleSubmit={this.handleSubmit}
              onClose={this.closeModal}
              currentItem={(this.state.currentDepartment)}
            />
          </Modal.Body>
        </Modal>

        {(this.state.currentDepartment)? (
          <Modal
            show={this.state.showDepartmentUsers}
            onHide={this.closeDepartmentUsersModal}
            className="add-item-modal add-entity-large">
            <Modal.Body>
              <DepartmentsUsersList
                currentItem={this.state.currentDepartment}
                onclose={this.closeDepartmentUsersModal}/>
            </Modal.Body>
          </Modal>
        ) : ''}

        <div className="departments-list-header">

          <div>
            <a
              onClick={() => this.setState({showFilterBox: !this.state.showFilterBox})}
              className="nav-btn icon-login-door"
            >
              {locale.buttonFilter}
            </a>
          </div>

          <RolAccess
            masterTab={'departments'}
            sectionTab={'add_departments'}
            component={() => this.renderAddButton()}>
          </RolAccess>
        </div>

        {this.state.showFilterBox &&
        <section className="list-view-filters">
          <FilterDepartments
            onSubmit={this.submitFilterForm}
            locale={this.props.locale}
          />
        </section>
        }

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={this.props.departments.fetching}
          pagination={paginationSettings}
        />

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locale: state.localization.strings.departments,
    login: state.login,
    departments: state.departments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Departments);