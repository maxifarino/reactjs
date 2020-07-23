import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import PTable from '../../../../common/ptable';
import Utils from '../../../../../lib/utils';

import AddAttributesModal from '../../../modals/addAttributesModal';

import * as actions from './../actions';
import * as commonActions from '../../../../common/actions';

class AttributesList extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      order: {
        AttributeName: 'asc',
        Archived: 'asc',
      },
      tableOrderActive: 'AttributeName',
      currentAgent: null,
    };
  }

  componentDidMount() {
    const { coverageTypeId } = this.props;

    this.props.actions.fetchAttributes({
      coverageTypeId: coverageTypeId,
      orderBy: 'AttributeName',
      orderDirection: 'ASC',
      settings: true,
    });
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, { settings: true, coverageTypeId: this.props.coverageTypeId });
      // fetch using query
      this.props.actions.fetchAttributes(query);
      // save pagenumber
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  openModal = () => {
    this.setState({ currentAttribute: null });
    this.props.actions.setShowAddAttributesModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowAddAttributesModal(false);
  }

  closeModalAndRefresh = () => {
    const { coverageTypeId } = this.props;
    this.props.actions.setShowAddAttributesModal(false);
    this.props.actions.fetchAttributes({
      coverageTypeId: coverageTypeId,
      orderBy: 'AttributeName',
      orderDirection: 'ASC',
      settings: true,
    });
  }

  editAttribute = (attribute) => {
    this.setState({ currentAttribute: attribute });
    this.props.actions.setShowAddAttributesModal(true);
  }

  render() {
    const {
      addButton,
      headers,
      editAttribute,
    } = this.props.local.strings.coverageTypes.attributes.attributesList;

    const {
      attributeNameColumn,
      archivedColumn,
      editColumn,
    } = headers;
    
    const fields = [      
      'attributeName',
      'archived',
      'edit',
    ];   

    const attributesTableMetadata = {
      fields: fields,
      header: {
        attributeName: attributeNameColumn,
        archived: archivedColumn,
        edit: editColumn,
      }
    };
    
    const attributesTableBody = this.props.coverageTypes.attributesList.map((attribute) => {      
      const {
        AttributeID,
        AttributeName,
        Archived,
      } = attribute;
      
      return {
        attributeName: AttributeName,
        archived: (Archived) ? 'Yes' : 'No',
        edit: (
          <a
            onClick={() => this.editAttribute(attribute)}
            className="cell-table-link icon-edit" 
            style={{ whiteSpace: 'nowrap' }}
          >
            {editAttribute}
          </a>
        ),
      };
    });

    const attributesTableData = {
      fields: attributesTableMetadata.fields,
      header: attributesTableMetadata.header,
      body: attributesTableBody
    };

    let {
      totalAmountOfAttributes, 
      attributesPerPage,
      fetchingAttributes,
      showAddAttributesModal
    } = this.props.coverageTypes;

    const paginationSettings = {
      total: totalAmountOfAttributes,
      itemsPerPage: attributesPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };
    
    return (
      <div className="list-view" style={{ width: '100%'}}>
        <Modal
          show={showAddAttributesModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <AddAttributesModal
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              attribute={this.state.currentAttribute}
              coverageTypeId={this.props.coverageTypeId}
            />
          </Modal.Body>
        </Modal>

        <section className="list-view-header">
          <div className="row">
            <div className="col-sm-12">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a
                      onClick={() => this.openModal()}
                      className="list-view-nav-link nav-bn icon-add" >
                      {addButton}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <PTable
          sorted={true}
          items={attributesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingAttributes}
          customClass='projectInsureds-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    coverageTypes: state.coverageTypesSettings,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AttributesList));