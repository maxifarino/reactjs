import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Modal } from 'react-bootstrap';
import renderField from '../customInputs/renderField';
import PTable from '../common/ptable';
import Utils from '../../lib/utils';

import * as actions from './actions';
import ViewAnswersModal from './modals/viewAnswers';

import './ReviewApplications.css';

const Alerts = require ('../alerts');

class ReviewApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {
        pageNumber: 1
      },
      tableOrderActive: 'subcontractorName',
      order: {
        subcontractorName: 'asc',
      },
      showFilterBox: false,
      checkboxes: [],
      allChecked: false,
      selectedApplicationId: null,
    };

  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const query = this.addId({
      orderBy: 'ApplicationID',
      orderDirection:'ASC',
      pageNumber: this.state.filter.pageNumber,
    });

    console.log('query', query);    
    this.props.actions.fetchReviewApplications(query);    
  }

  addId = (query) => {
    const hiringClientId = this.props.hcId;
    //console.log(this.props);    

    if (hiringClientId) {
      return { ...query, hiringClientId };
    }

    return query;
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'remove') return;

    // get base query
    const pageNumber = this.state.filter.pageNumber;
    const orderDirection = this.state.order[field] === 'asc' ? 'DESC' : 'ASC';
    let preQuery = Utils.getFetchQuery(field, pageNumber, orderDirection);

    // add search filters
    preQuery = Utils.addSearchFiltersToQuery(preQuery, this.state.filterBox);

    const query = this.addId(preQuery);

    // fetch using query
    this.props.actions.fetchReviewApplications(query);

    // save new active tab and order
    let newState = {
      tableOrderActive: field,
      order: {
        name: field === 'name' ? 'asc' : 'desc',
        code: field === 'code' ? 'asc' : 'desc',
        displayOrder: field === 'displayOrder' ? 'asc' : 'desc',
        deficiencyMessage: field === 'deficiencyMessage' ? 'asc' : 'desc',
        deficiencyCode: field === 'deficiencyCode' ? 'asc' : 'desc',
        archive: field === 'archive' ? 'asc' : 'desc',
      },
    };

    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  
  handleCheckAll = (e) => {
    let allChecked = this.state.allChecked;
    let checkboxes = [];
    console.log("CHECK ALL", allChecked);
    if (!allChecked) {
      checkboxes = this.props.reviewApplications.list.map((item, idx) => {
        const {
          ApplicationID, 
        } = item;
        return {applID: ApplicationID, checked: true};
      });
    }

    this.setState({
      checkboxes: checkboxes,
      allChecked: !allChecked,
    });        
    console.log("checkboxes", checkboxes);
  };

  handleChange = (e) => {
    let checkboxes = this.state.checkboxes;
    let applID = TryParseInt(e.target.name.split('_')[1], 0);

    let filterCheck = checkboxes.filter(function(e){
      return applID !== e.applID;
    });
    filterCheck.push({applID: applID, checked: e.target.checked});
    this.setState({
      checkboxes: filterCheck,
    });    
  };
  
  handleChangeApprove = (e) => {
    console.log("handleChangeApprove",this.state.checkboxes.length);
    console.log("props", this.props);
    if (this.state.checkboxes.length > 0) {
      let selected = this.state.checkboxes.filter(function(i){
        return i.checked;
      }).map((i) => {
        return i.applID;
      });
      console.log("selected", selected);
      let data = {
        applIDs: selected,
        hcId: this.props.hcId,
      };
      this.props.actions.approveApplications(data, (success) => {
        console.log("response", success);
        if (success) {
          this.getData();
        } else {
          //TODO add alert
        }
        this.setState({
          checkboxes: [],
          allChecked: false,
        });    
      });
    }
  };

  handleChangeDecline = (e) => {
    console.log("handleChangeDecline",this.state.checkboxes.length);
    if (this.state.checkboxes.length > 0) {

      let selected = this.state.checkboxes.filter(function(i){
        return i.checked;
      }).map((i) => {
        return i.applID;
      });
      console.log("selected", selected);
      const onDeclineConfirmation = (confirmed) => {
        if(!confirmed) return;
          let data = {
            applIDs: selected,
            hcId: this.props.hcId,
          };
          this.props.actions.declineApplications(data, (success) => {
            console.log("response", success);
            if (success) {
              this.getData();
            } else {
              //TODO add alert
            }
            this.setState({
              checkboxes: [],
              allChecked: false,
            });    
          });
    
      }
    
      const alertContent = {
        title: 'Warning',
        text: `Your are declining ${selected.length} Applications. Are you sure?`,
        btn_no: 'Cancel',
        btn_yes: 'Accept',      
      }
      Alerts.showActionConfirmation(alertContent, onDeclineConfirmation);
  
    }
  };

  openViewAnswersModal = (applicationId) => {
    this.setState({
      selectedApplicationId: applicationId
    });
    const query = {
      scApplicationId: applicationId,
    };

    console.log('query', query);    
    this.props.actions.fetchReviewApplications(query);
    this.props.actions.setShowModal(true);
  }

  closeViewAnswersModal = () => {
    console.log('close');
    this.getData();
    this.props.actions.setShowModal(false);
  }

  render() {
    const {
      subcontractorNameColumn,
      primaryTradeColumn,
      addressColumn,
      cityColumn,
      stateColumn,
      zipCodeColumn,
      previousWorkedForHCColumn,
      hiringClientProjectColumn,
      hiringClientContactNameColumn,
      selectAllBtn,
      deSelectAllBtn,
      approveBtn,
      declineBtn
    } = this.props.local.strings.reviewApplications.reviewApplicationsList;

    const TableMetadata = {
      fields: [
        'check',
        'subcontractorName',
        'primaryTrade',
        'address',
        'city',
        'state',
        'zipCode',
        'previousWorkedForHC',
        'hiringClientProject',
        'hiringClientContactName',
        'view'
      ],
      header: {
        subcontractorName: subcontractorNameColumn,
        primaryTrade: primaryTradeColumn,
        address: addressColumn,
        city: cityColumn,
        state: stateColumn,
        zipCode: zipCodeColumn,
        previousWorkedForHC: previousWorkedForHCColumn,
        hiringClientProject: hiringClientProjectColumn,
        hiringClientContactName: hiringClientContactNameColumn,
      },
    };

    const TableBody = this.props.reviewApplications.list.map((item, idx) => {
      const {
        ApplicationID, 
        SubcontractorID,
        HiringClientID, 
        Timestamp,
        SubcontractorName,
        Address,
        City,
        StateID,
        ZipCode,
        CountryId,
        SubcontractorPhone, 
        SubcontractorFax,
        SubcontractorContactName,
		    SubcontractorContactPhone,
		    SubcontractorContactEmail,
		    SubcontractorTaxID,
		    HiringClientContactName,
		    HiringClientProject,
	      PreviousWorkedForHC,
		    GeneralComment,
        PrimaryTrade,
        Description
      } = item;

      let applRow = this.state.checkboxes.find(function(e){
        return ApplicationID === e.applID;
      });
      if (typeof applRow !== 'undefined' ) {
        item.isChecked = applRow.checked
      } else {
        item.isChecked = false;
      }
      // console.log("applRow", applRow, ApplicationID, item.isChecked);

      return {
        check: (
          <div>
          <input
            name={`check_${ApplicationID}`}
            type="checkbox"
            component={renderField} 
            checked={item.isChecked}
            onChange={this.handleChange}
            />
          </div>  
        ),
        subcontractorName: SubcontractorName,
        primaryTrade: Description,
        address: Address,
        city: City,
        state: StateID,
        zipCode: ZipCode,
        previousWorkedForHC: PreviousWorkedForHC === true ? 'YES' : 'NO',
        hiringClientProject: HiringClientProject,
        hiringClientContactName: HiringClientContactName,
        view: (
          <a
            onClick={() => this.openViewAnswersModal(ApplicationID)}
            className="cell-table-link">
            View All Answers
          </a>
        ),
      };
    });

    const templatesTableData = {
      fields: TableMetadata.fields,
      header: TableMetadata.header,
      body: TableBody
    };

    let {
      totalCount,
      itemsPerPage,
      fetching,
      showModal,
    } = this.props.reviewApplications;

    const paginationSettings = {
      total: totalCount,
      itemsPerPage: itemsPerPage,
      // setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body tab-list">
        <div className="tab-list-header">
          <div className="row">
            <div className="col-sm-6 checks">
              <div>
                <a onClick={this.handleCheckAll} className="nav-btn nav-bn">{this.state.allChecked ? deSelectAllBtn : selectAllBtn}</a>
              </div>
            </div>
            <div className="col-sm-6 buttons">
              <nav className="list-view-nav">
                <ul>
                  <li>
                    <a onClick={this.handleChangeApprove} className="nav-btn nav-bn">{approveBtn}</a>
                  </li>
                  <li>
                    <a onClick={this.handleChangeDecline} className="nav-btn nav-bn">{declineBtn}</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <PTable
          sorted={true}
          items={templatesTableData}
          wrapperState={this.state}
          tableOrderActive={this.state.tableOrderActive}
          clickOnColumnHeader={this.clickOnColumnHeader}
          isFetching={fetching}
          pagination={paginationSettings}
        />
        <Fragment>
          <Modal
            show={showModal}
            onHide={this.closeViewAnswersModal}            
            className="add-item-modal"
          >
            <Modal.Body>
              <ViewAnswersModal
                onHide={this.closeViewAnswersModal}
                close={this.closeViewAnswersModal}
                application={(this.props.reviewApplications && this.props.reviewApplications.list) ? this.props.reviewApplications.list[0] : ''}
              />
            </Modal.Body>
          </Modal>
        </Fragment>
      </div>
    );
  }
  
};

const TryParseInt = (str, defaultValue) => {
  var retValue = defaultValue;
  if(str !== null) {
      if(str.length > 0) {
          if (!isNaN(str)) {
              retValue = parseInt(str);
          }
      }
  }
  return retValue;
}  

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login,
    reviewApplications: state.reviewApplications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewApplications);
