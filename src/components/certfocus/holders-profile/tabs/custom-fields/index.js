import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../../../common/ptable';
import AddCustomFieldModal from '../../../modals/addCustomFieldModal';
import FilterCustomFields from './filter';
import Utils from '../../../../../lib/utils';
import * as actions from './actions';
import RolAccess from './../../../../common/rolAccess';

class CustomFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      filterBox: {
        customFieldName: '',
        fieldTypeId: '',
        archived: '',
      },
      tableOrderActive: 'customFieldName',
      order: {
        customFieldName: 'asc',
        fieldTypeId: 'desc',
        fieldOptions: 'desc',
        displayOrder: 'desc',
        archived: 'desc'
      },
      showFilterBox: false,
      currentCustomField: null,
      holderId: props.holderId
    };

    let query = Utils.getFetchQuery('customFieldName', 1, 'ASC');
    query.holderId = props.holderId;
    props.actions.fetchCustomFields(query);
  }

  addId = (query) => {
    const { holderId } = this.state;
    query.holderId = holderId;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'editCustomField') return;
    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);
    // add search filters
    query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
    // fetch using query
    this.props.actions.fetchCustomFields(query);
    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        customFieldName: field === 'customFieldName' ? 'asc' : 'desc',
        fieldTypeId: field === 'fieldTypeId' ? 'asc' : 'desc',
        fieldOptions: field === 'fieldOptions' ? 'asc' : 'desc',
        displayOrder: field === 'displayOrder' ? 'asc' : 'desc',
        archived: field === 'archived' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      this.addId(query);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, this.state.filterBox);
      // fetch using query
      this.props.actions.fetchCustomFields(query);
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  submitFilterForm = (values) => {
    // get base query
    console.log(values);
    const field = this.state.tableOrderActive;
    const pageNumber = 1;
    const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
    let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
    this.addId(query);
    // add search filters
    const filterBox = {
      customFieldName: values.name || "",
      fieldTypeId: values.inputType || "",
      archived: values.archived
    };
    query = Utils.addSearchFiltersToQuery(query, filterBox);
    // fetch using query
    this.props.actions.fetchCustomFields(query);
    // save searchterm and pagenumber
    this.setState({
      filterBox,
      filter: {
        pageNumber: 1
      }
    });
  }

  openModal = () => {
    this.setState({ currentCustomField: null });
    this.props.actions.setShowModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowModal(false);
  }

  closeModalAndRefresh = () => {
    this.props.actions.setShowModal(false);
    this.setPageFilter(null, 1, true);
  }

  editCustomField = (customField) => {
    this.setState({ currentCustomField: customField });
    this.props.actions.setShowModal(true);
  }

  renderButtonAddCustomField() {
    let component = (
      <li>
        <a onClick={this.openModal}
          className="list-view-nav-link nav-bn icon-add no-overlapping" >
          {this.props.local.strings.customFields.customFieldsList.addBtn}
        </a>
      </li>
    );
    return component;
  }

  renderButtonEditCustomField() {
    let component = (
      <li className="">
        <a
          className="list-view-nav-link nav-bn icon-login-door no-overlapping"
          onClick={() => { this.setState({ showFilterBox: !this.state.showFilterBox }) }}
        >
          {this.props.local.strings.customFields.customFieldsList.filterBtn}
        </a>
      </li>
    );
    return component;
  }

  render() {
    const {
      editField,
      filterBtn,
      addBtn,
      headers
    } = this.props.local.strings.customFields.customFieldsList;

    const {
      nameColumn,
      inputTypeColumn,
      inputValuesColumn,
      orderColumn,
      archivedColumn
    } = headers;

    const customFieldsTableMetadata = {
      fields: [
        'customFieldName',
        'fieldTypeId',
        'fieldOptions',
        'displayOrder',
        'archived',
        'editCustomField'
      ],
      header: {
        customFieldName: nameColumn,
        fieldTypeId: inputTypeColumn,
        fieldOptions: inputValuesColumn,
        displayOrder: orderColumn,
        archived: archivedColumn,
        editCustomField: ''
      }
    };

    const customFieldsTableBody = this.props.customFields.list.map((customField, idx) => {
      const {
        CustomFieldName, FieldTypeId, FieldOptions,
        DisplayOrder, Archived } = customField;
      const types = ['', 'Text', 'Dropdown', 'Decimal'];
      const typeIndex = parseInt(FieldTypeId || 0, 10);
      return {
        customFieldName: CustomFieldName,
        fieldTypeId: types[typeIndex],
        fieldOptions: FieldOptions,
        displayOrder: DisplayOrder,
        archived: Archived ? 'True' : 'False',
        editCustomField: (
          <a
            onClick={() => this.editCustomField(customField)}
            className="cell-table-link icon-edit" >
            {editField}
          </a>
        ),
      };
    });

    const templatesTableData = {
      fields: customFieldsTableMetadata.fields,
      header: customFieldsTableMetadata.header,
      body: customFieldsTableBody
    };

    let { totalAmountOfCustomFields, customFieldsPerPage, fetchingCustomFields, showModal } = this.props.customFields;
    const paginationSettings = {
      total: totalAmountOfCustomFields,
      itemsPerPage: customFieldsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body">
        <Modal
          show={showModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <AddCustomFieldModal
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              customField={this.state.currentCustomField}
              holderId={this.state.holderId}
            />
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <RolAccess
                    masterTab="custom_fields"
                    sectionTab="edit_custom_field"
                    component={() => this.renderButtonEditCustomField()}>
                  </RolAccess>

                  <RolAccess
                    masterTab="custom_fields"
                    sectionTab="add_custom_field"
                    component={() => this.renderButtonAddCustomField()}>
                  </RolAccess>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {
          this.state.showFilterBox &&
          <section className="list-view-filters">
            <FilterCustomFields onSubmit={this.submitFilterForm} />
          </section>
        }

        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingCustomFields}
          customClass='customFields-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    customFields: state.customFields,
    local: state.localization
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomFields));
