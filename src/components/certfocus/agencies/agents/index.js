import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import PTable from '../../../common/ptable';
import Utils from '../../../../lib/utils';

import AddAgentsModal from '../../modals/addAgentsModal';
import * as actions from './../actions';
import * as commonActions from '../../../common/actions';

class AgentsList extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        pageNumber: 1
      },
      order: {
        firstName: 'asc',
        lastName: 'asc',
        mobileNumber: 'desc',
        phoneNumber: 'desc',
        emailAddress: 'desc',
      },
      tableOrderActive: 'AgentID',
      currentAgent: null,
    };
  }

  componentDidMount() {
    const { agencyId } = this.props;

    this.props.actions.fetchAgents({
      agencyId: agencyId,
      orderBy: 'AgentID',
      orderDirection: 'ASC',
    });
  }

  setPageFilter = (e, pageNumber, force) => {
    if (force || this.state.filter.pageNumber !== pageNumber) {
      // get base query
      const field = this.state.tableOrderActive;
      const orderDirection = this.state.order[field] === 'asc' ? 'ASC' : 'DESC'
      let query = Utils.getFetchQuery(field, pageNumber, orderDirection);
      // add search filters
      query = Utils.addSearchFiltersToQuery(query, { agencyId: this.props.agencyId });
      // fetch using query
      this.props.actions.fetchAgents(query);
      // save pagenumber
      this.setState({
        filter: {
          pageNumber
        }
      });
    }
  }

  openModal = () => {
    this.setState({ currentAgent: null });
    this.props.actions.setShowAddAgentsModal(true);
  }

  closeModal = () => {
    this.props.actions.setShowAddAgentsModal(false);
  }

  closeModalAndRefresh = () => {
    const { agencyId } = this.props;
    this.props.actions.setShowAddAgentsModal(false);
    this.props.actions.fetchAgents({
      agencyId: agencyId,
      orderBy: 'AgentID',
      orderDirection: 'ASC',
    });
  }

  editAgent = (agent) => {
    this.setState({ currentAgent: agent });
    this.props.actions.setShowAddAgentsModal(true);
  }

  render() {
    const {
      addButton,
      headers,
      editAgent,
    } = this.props.local.strings.agencies.agentsList;

    const {
      firstNameColumn,
      lastNameColumn,
      mobileNumberColumn,
      phoneNumberColumn,
      emailAddressColumn,
      agencyIdColumn,
      editAgentColumn,
    } = headers;
    
    const fields = [      
      'firstName',
      'lastName',
      // 'mobileNumber',
      // 'phoneNumber',
      'emailAddress',
      'agencyId',
      'edit',
    ];   

    const agentsTableMetadata = {
      fields: fields,
      header: {
        firstName: firstNameColumn,
        lastName: lastNameColumn,
        // mobileNumber: mobileNumberColumn,
        // phoneNumber: phoneNumberColumn,
        emailAddress: emailAddressColumn,
        agencyId: agencyIdColumn,
        edit: editAgentColumn,
      }
    };

    const agentsTableBody = this.props.agencies.agentsList.map((agent) => {
      const {
        AgentID,
        FirstName,
        LastName,
        MobileNumber,
        PhoneNumber,
        EmailAddress,
        AgencyID,
      } = agent;
      
      return {
        firstName: FirstName,
        lastName: LastName,
        // mobileNumber: MobileNumber,
        // phoneNumber: PhoneNumber,
        emailAddress: EmailAddress,
        agencyId: AgencyID,
        edit: (
          <a
            onClick={() => this.editAgent(agent)}
            className="cell-table-link icon-edit" 
            style={{ whiteSpace: 'nowrap' }}
          >
            {editAgent}
          </a>
        ),
      };
    });

    const agentsTableData = {
      fields: agentsTableMetadata.fields,
      header: agentsTableMetadata.header,
      body: agentsTableBody
    };

    let {
      totalAmountOfAgents, 
      agentsPerPage,
      fetchingAgents,
      showAddAgentsModal
    } = this.props.agencies;

    const paginationSettings = {
      total: totalAmountOfAgents,
      itemsPerPage: agentsPerPage,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };
    
    return (
      <div className="list-view" style={{ width: '100%'}}>
        <Modal
          show={showAddAgentsModal}
          onHide={this.closeModal}
          className="add-item-modal add-entity-small">
          <Modal.Body>
            <AddAgentsModal
              onHide={this.closeModal}
              close={this.closeModalAndRefresh}
              agent={this.state.currentAgent}
              agencyId={this.props.agencyId}
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
          items={agentsTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetchingAgents}
          customClass='projectInsureds-list'
          pagination={paginationSettings}
        />

      </div>
    )

  }
};

const mapStateToProps = (state) => {
  return {
    agencies: state.agencies,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AgentsList));