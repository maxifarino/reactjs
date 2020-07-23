import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import PTable from '../../../../common/ptable';
import Utils from '../../../../../lib/utils';

import AddDocumentQueueUsersModal from '../../../modals/addDocumentQueueUsersModal';
import * as actions from './../actions';
import * as commonActions from '../../../../common/actions';

class DocumentQueueUsersList extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      order: {
        DocumentQueueUserName: 'asc',
        Archived: 'asc',
      },
      tableOrderActive: 'UserId',
      currentAgent: null,
    };
  }

  componentDidMount() {
    const { queueId } = this.props;

    this.props.actions.fetchDocumentQueueUsers({
      queueId: queueId,
      orderBy: 'UserId',
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
      query = Utils.addSearchFiltersToQuery(query, { settings: true, queueId: this.props.queueId });
      // fetch using query
      this.props.actions.fetchDocumentQueueUsers(query);
      // save pagenumber
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  openModal = () => {
    this.props.actions.setShowAddDocumentQueueUsersModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowAddDocumentQueueUsersModal(false);
  }

  closeModalAndRefresh = () => {
    const { queueId } = this.props;
    this.props.actions.setShowAddDocumentQueueUsersModal(false);
    this.props.actions.fetchDocumentQueueUsers({
      queueId: queueId,
      orderBy: 'UserId',
      orderDirection: 'ASC',
      settings: true,
    });
  }

  onDeleteDocumentQueueUser = (data) => {    
    this.props.commonActions.setLoading(true);
    this.props.actions.deleteDocumentQueueUser({ queueId: data.QueueId, userId: data.UserId }, (success) => {
      this.props.commonActions.setLoading(false);
      if (success) {
        this.setPageFilter(null, 1, true);
      }
    });
  }

  render() {
    const {
      addBtn,
      headers,
      deleteDocumentQueueUser,
    } = this.props.local.strings.documentQueueDefinitions.documentQueueUsers.documentQueueUsersList;

    const {
      userNameColumn,
      userRoleColumn,
      deleteColumn,
    } = headers;
    
    const fields = [      
      'userName',
      'userRole',
      'delete',
    ];   

    const documentQueueUsersTableMetadata = {
      fields: fields,
      header: {
        userName: userNameColumn,
        userRole: userRoleColumn,
        delete: deleteColumn,
      }
    };    
    
    const documentQueueUsersTableBody = this.props.documentQueueDefinitions.documentQueueUsersList.map((documentQueueUser) => {      
      const {
        UserId,
        UserName,
        UserRole,
      } = documentQueueUser;
      
      return {
        userName: UserName,
        userRole: (UserRole === 14) ? 'Processor' : 'Data Entry Clerk',
        delete: (
          <a
            onClick={() => this.onDeleteDocumentQueueUser(documentQueueUser)}
            className="cell-table-link icon-delete"
          >
            {deleteDocumentQueueUser}
          </a>
        ),
      };
    });

    const documentQueueUsersTableData = {
      fields: documentQueueUsersTableMetadata.fields,
      header: documentQueueUsersTableMetadata.header,
      body: documentQueueUsersTableBody
    };

    let {
      totalAmountOfDocumentQueueUsers, 
      documentQueueUsersPerPage,
      fetchingDocumentQueueUsers,
      showAddDocumentQueueUsersModal
    } = this.props.documentQueueDefinitions;

    const paginationSettings = {
      total: totalAmountOfDocumentQueueUsers,
      itemsPerPage: documentQueueUsersPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };
    
    return (
      <div className="list-view" style={{ width: '100%'}}>
        <Modal
          show={showAddDocumentQueueUsersModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <AddDocumentQueueUsersModal
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              queueId={this.props.queueId}
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
                      {addBtn}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <PTable
          sorted={true}
          items={documentQueueUsersTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingDocumentQueueUsers}
          customClass='projectInsureds-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    documentQueueDefinitions: state.documentQueueDefinitions,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentQueueUsersList));