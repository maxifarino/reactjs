import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import * as usersActions from '../users/actions';
import * as registerActions from '../register/actions';
import * as hcActions from '../hiringclients/actions';
import * as scActions from '../subcontractors/actions';
import * as loginActions from '../auth/login/actions';

import AddUser from '../users/adduser';
import PTable from '../common/ptable';
import Utils from '../../lib/utils';

import * as commonActions from './../common/actions';

import './profile.css';

class UserProfile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showEditUserModal: false,
      currentUser: null
    };
    
    props.registerActions.fetchResources();
    if (props.login.profile.Id) {
      const currentUser = this.loggedProfileToCurrentUser(props.login.profile);
      this.state.currentUser = currentUser;
      props.hcActions.fetchHiringClients({withoutPag:true});
      props.scActions.fetchSubcontractors({withoutPag:true, userId: currentUser.id});
      props.usersActions.fetchLogs({userId: currentUser.id});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.currentUser) {
      const currentUser = this.loggedProfileToCurrentUser(nextProps.login.profile);
      this.setState({ currentUser });
      this.props.hcActions.fetchHiringClients({withoutPag:true});
      this.props.scActions.fetchSubcontractors({withoutPag:true, userId: currentUser.id});
      this.props.usersActions.fetchLogs({userId: currentUser.id});
    }
  }
  
  componentDidMount(){
    // this.props.commonActions.addPage(
    //   {
    //     pathName: this.props.local.strings.breadcrumb.profile,
    //     hrefName: window.location.pathname
    //   }
    // );
  }

  loggedProfileToCurrentUser (profile) {
    //console.log(profile);
    const {
      Id, Mail, FirstName, LastName, Phone, TimeZone,
      RoleID, Role, CFRoleId, CFRole } = profile;
    const currentUser = {
      id: Id,
      email: Mail,
      role: Role,
      cfRole: CFRole,
      fullName: `${FirstName} ${LastName}`,
      phone: Phone,
      extraUserInfo: {
        firstName: FirstName,
        lastName: LastName,
        phone: Phone,
        timezone: TimeZone,
        roleId: RoleID,
        cfRoleId: CFRoleId
      }
    };
    return currentUser;
  }

  openEditUserModal = () => {
    this.setState({ showEditUserModal: true });
  }
  closeEditUserModal = () => {
    this.setState({ showEditUserModal: false });
  }
  refreshAndCloseModal = () => {
    this.props.loginActions.getProfile();
    this.setState({ currentUser:null });
    this.closeEditUserModal();
  }
  // Submit UserForm
  submitUserForm = values => {
    this.props.usersActions.sendUser(values, this.refreshAndCloseModal, this.state.currentUser.id);
  }

  renderLogsTable() {
    const { activityTitle } = this.props.local.strings.profile;
    const { Activity, TimeStamp } = this.props.local.strings.logs.tableHeader;

    const logsTableMetadata = {
      fields: [
        'readableDescription',
        'timeStamp'
      ],
      header: {
        readableDescription: Activity,
        timeStamp: TimeStamp,
      }
    };

    const logsTableBody = this.props.users.logs.map((log) => {
      const activity =  (
        <div>
          <span className="light-blue">{log.name} </span><span>{log.readableDescription}</span>
        </div>
      );
      const formattedDate = Utils.getFormattedDate(log.timeStamp);
      return {
        readableDescription: activity,
        timeStamp: formattedDate
      }
    });

    const logsTableData = {
      fields: logsTableMetadata.fields,
      header: logsTableMetadata.header,
      body: logsTableBody
    };

    let {logsPerPage, fetchingLogs} = this.props.users;
    const paginationSettings = {
      total: logsPerPage,
      itemsPerPage: logsPerPage,
      currentPageNumber: 1,
    };

    const colsWidth = [
      '70%',
      '30%',
    ];

    return (
      <div className="up-activity-container">
        <div className="up-activity-title">{activityTitle}</div>
        <PTable
          sorted={false}
          items={logsTableData}
          wrapperState={this.state}
          isFetching={fetchingLogs}
          customClass='templates-list'
          pagination={paginationSettings}
          colsConfig={colsWidth}
        />
      </div>
    );
  }

  renderAssociatedUser(user, idx) {
    return (
      <div key={idx} className="up-list-element">{user.name}</div>
    );
  }

  render() {
    const {
      updateButton,
      associatedHC,
      associatedSC
    } = this.props.local.strings.profile;

    const showModal = this.state.showEditUserModal && this.state.currentUser !== null;
    // general info
    const currentUser = this.state.currentUser || {} ;
    const userName = currentUser.fullName || "---";
    const userPhone = Utils.formatPhoneNumber(currentUser.phone);
    const userEmail = currentUser.email || "---";
    const hcList = this.props.hc.list;
    const scList = this.props.sc.list;
    const hcUser = this.props.login.profile.RoleID === 1;
    const scUser = this.props.login.profile.RoleID === 4;

    const { role, cfRole } = currentUser;
    let userRole;
    const prequalRole = role? role.Name:null;
    const certFocusRole = cfRole? cfRole.Name:null;
    if(prequalRole && certFocusRole) {
      userRole = `${prequalRole} - ${certFocusRole}`;
    } else if(prequalRole && !certFocusRole) {
      userRole = prequalRole;
    } else if(!prequalRole && certFocusRole) {
      userRole = certFocusRole;
    } else {
      userRole = '---';
    }

    return (
      <div className="user-profile-container">
        <Modal
          show={showModal}
          onHide={this.closeEditUserModal}
          className="add-item-modal add-user-modal" >
          <Modal.Body>
            <AddUser
              close={this.closeEditUserModal}
              onSubmit={this.submitUserForm}
              currentEditingUser={this.state.currentUser}
            />
          </Modal.Body>
        </Modal>

        {
          currentUser.fullName?
          <div className="row up-header-info">
            <div className="col col-lg-4 up-general-info">
              <div className="up-name-container">
                <label className="up-full-name">{userName}</label>
                <label>{userRole}</label>
              </div>
              <div className="up-phone-mail-container">
                <label>{userPhone}</label>
                <label>{userEmail}</label>
              </div>
              <button onClick={this.openEditUserModal}>{updateButton} - here </button>
            </div>

            <div className="col col-lg-8 up-hc-sc-info">
              <div className="row">

                {
                  hcUser
                  ? <div className={`col col-lg-${scUser ? '6' : '12'}`}>
                      <div className="up-list-title">{associatedHC}</div>
                      <div className="up-users-list">
                        { hcList.map(this.renderAssociatedUser) }
                      </div>
                    </div>
                  : ''
                }

                {
                  scUser
                  ? <div className={`col col-lg-${hcUser ? '6' : '12'}`}>
                      <div className="up-list-title">{associatedSC}</div>
                      <div className="up-users-list">
                        { scList.map(this.renderAssociatedUser) }
                      </div>
                    </div>
                  : ''
                }

              </div>
            </div>
          </div>
          :
          <div style={{ width:'100%', height:'200px', display: 'flex',
          alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-wrapper">
              <div className="spinner"></div>
            </div>
          </div>
        }

        {this.renderLogsTable()}

      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    login: state.login,
    hc: state.hc,
    sc: state.sc,
    users: state.users,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
    registerActions: bindActionCreators(registerActions, dispatch),
    hcActions: bindActionCreators(hcActions, dispatch),
    scActions: bindActionCreators(scActions, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
