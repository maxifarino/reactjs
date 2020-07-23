import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';

import { setSearchSCShowModal } from '../../subcontractors/actions';
import { setHiringClientId } from '../../sc-profile/actions';
import SearchSCModal from './../../subcontractors/searchSCModal';
import SearchBar from './../../subcontractors/searchSCModal/searchBar';

import * as loginActions from '../../../components/auth/login/actions';
import * as commonActions from '../actions/index';
import RolAccess from './../../common/rolAccess';

let TimeOut = null;
const canSeeHCsAndExago = new Set([1, 2, 3, 5, 6])
const canSeeUsersAndMail = new Set([1, 2, 5, 8])
const prequalAdminHcsAndSubs = new Set([1, 2, 3, 4, 5, 6])

class UserNotifications extends React.Component {
  constructor(props) {
    super(props);

    const userName = props.login.profile &&
      props.login.profile.FirstName
      ? props.login.profile.FirstName
      : ''

    const currentUserRoleId = props.login.profile &&
      props.login.profile.RoleID
      ? props.login.profile.RoleID
      : 0

    const currentUserCFRoleId = props.login.profile &&
      props.login.profile.CFRoleId
      ? props.login.profile.CFRoleId
      : 0

    const isCertFocusUser = props.login.profile &&
      props.login.profile.CFRole
      ? true
      : false

    const isPrequalUser = prequalAdminHcsAndSubs.has(currentUserRoleId)

    const {
      hiringClientsHoldersTitle,
      hiringClientsTitle,
      holdersTitle,
    } = props.localization.strings.common.sidebar.headerIcons;

    const title = (isPrequalUser && isCertFocusUser) ? hiringClientsHoldersTitle : (isPrequalUser ? hiringClientsTitle : holdersTitle)

    this.state = {
      showOptions: false,
      showNotifications: false,
      notifications: 0,
      currentUserRoleId,
      currentUserCFRoleId,
      isCertFocusUser,
      title: title ? title : '',
      showSSO: false,
      userName
    }

    this.getNotifications = this.getNotifications.bind(this);
    this.renderUserNameAndLogut = this.renderUserNameAndLogut.bind(this);
    this.logout = this.logout.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.viewSubcontractor = this.viewSubcontractor.bind(this);

    if (props.login.profile.Id) {
      this.getNotifications(props.login.profile.Id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login.profile.Id !== this.props.login.profile.Id) {
      this.getNotifications(nextProps.login.profile.Id);
    }

    if (nextProps.common.notifications >= 0) {
      this.setState({ notifications: nextProps.common.notifications });
    }

    const { CFRole, RoleID, CFRoleId } = this.props.login.profile
    const newCFRoleId = nextProps.login.profile.CFRoleId
    const newCFRole = nextProps.login.profile.CFRole
    const newRoleID = nextProps.login.profile.RoleID
    const newUserName = nextProps.login.profile.FirstName
    const multipleHiringClients = nextProps.login.profile.multipleHiringClients
    const SSO = nextProps.login.profile.SSO ? nextProps.login.profile.SSO : this.props.login.profile.SSO

    let showSSO = (newRoleID === 3 ||
      newRoleID === 6) &&
      (multipleHiringClients.find(
        association => (
          Number(association) === 1144 ||
          Number(association) === 1145
        )
      ) || false
      )
      && SSO
    // console.log('newRoleID = ',(newRoleID === 3 || newRoleID === 6));
    // console.log('multipleHiringClients = ',multipleHiringClients.find(association => Number(association) === 1144 || Number(association) === 1145) || false);
    // console.log('multipleHiringClients = ',multipleHiringClients);
    // console.log('SSO = ',SSO);
    // console.log('showSSO = ',showSSO)

    const { userName } = this.state

    if (newUserName && newUserName != userName) {
      this.setState({
        userName: newUserName
      })
    }

    if (showSSO) {
      this.setState({
        SSO,
        showSSO: true
      })
    }

    if (newCFRoleId && newCFRoleId != CFRoleId) {
      this.setState({
        isCertFocusUser: true,
        currentUserCFRoleId: newCFRoleId,
      })
    }
    if (newRoleID && newRoleID != RoleID) {
      this.setState({
        currentUserRoleId: newRoleID
      })
    }

    const isCertFocusUser = CFRole
    const isPrequalUser = prequalAdminHcsAndSubs.has(RoleID)

    const newIsCertFocusUser = newCFRole
    const newIsPrequalUser = prequalAdminHcsAndSubs.has(newRoleID)

    const shouldUpdateTitle = (newIsPrequalUser
      &&
      newIsPrequalUser != isPrequalUser) ||
      (newIsCertFocusUser
        &&
        newIsCertFocusUser != isCertFocusUser)

    if (shouldUpdateTitle) {

      const {
        hiringClientsHoldersTitle,
        hiringClientsTitle,
        holdersTitle,
      } = this.props.localization.strings.common.sidebar.headerIcons;

      const title = (newIsPrequalUser && newIsCertFocusUser) ? hiringClientsHoldersTitle : (newIsPrequalUser ? hiringClientsTitle : holdersTitle)
      this.setState({
        title
      })
    }

  }

  closeSearchSCModal = (e) => {
    this.props.setSearchSCShowModal(false);
  }

  getNotifications(userId) {
    if (TimeOut) {
      clearTimeout(TimeOut);
      TimeOut = null;
    }
    const minutes = 5;
    const self = this;
    if (userId) self.props.commonActions.fetchNotifications(userId);
    TimeOut = setTimeout(function () {
      self.getNotifications(userId);
    }, minutes * 60 * 1000);
  }

  goTo(e, urlSnippet) {
    this.props.history.push(urlSnippet);
  }

  logout() {
    const { loginActions, history } = this.props;

    localStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-token');
    loginActions.setProfile({});
    loginActions.setIsLoggedIn(false);
    loginActions.setAuthToken('');
    loginActions.setLoginExtraMsj('');

    history.push('/login');
  }

  markAsRead() {
    this.props.history.push('/tasks');

    if (this.state.notifications > 0) {
      this.props.commonActions.updateNotificationsStatus();
    }
  }

  renderUserNameAndLogut() {
    return (
      <div className="profile-container">
        <Link to='/profile' className="pl-user-name">
          {this.state.userName}
        </Link>
        <span className="linear-icon-exit pl-btn-logout" onClick={this.logout}></span>
      </div>
    );
  }

  viewSubcontractor(e, hcId, scId) {
    //console.log(this.props.history)
    let url = `/subcontractors/${scId}`
    this.props.setHiringClientId(hcId);
    this.props.setSearchSCShowModal(false);
    this.props.history.push(url);
    // window.open(url);
    window.location.reload(true)
  }

  viewInsured = (scId) => {
    let url = `/certfocus/insureds/${scId}`

    this.props.setSearchSCShowModal(false);
    this.props.history.push(url);

    // TODO: this shouldn't be used, must be removed in the future
    window.location.reload(true)
  }

  openSSO = () => {
    // console.log('SSO',this.state.SSO);
    if (this.state.SSO) {
      var winName = 'MyWindow';
      var winURL = 'https://www.certfocus.com/public/LoginPOST.aspx';
      var params = { 'cf_username': this.state.SSO.CFUsername, 'cf_password': this.state.SSO.CFPassword };
      var form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action", winURL);
      form.setAttribute("target", winName);
      for (var i in params) {
        if (params.hasOwnProperty(i)) {
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = i;
          input.value = params[i];
          form.appendChild(input);
        }
      }
      document.body.appendChild(form);
      window.open('', winName);
      form.target = winName;
      form.submit();
      document.body.removeChild(form);
    }
  }

  renderEmail() {
    const {mailTitle} = this.props.localization.strings.common.sidebar.headerIcons;
    return (
      <Link to='/mail' target='_blank'>
        <div title={mailTitle} className="linear-icon-envelope"></div>
      </Link>
    );
  }

  renderUsersIcon = () => {
    const {usersTitle} = this.props.localization.strings.common.sidebar.headerIcons;
    return (
      <div
        title={usersTitle}
        className="linear-icon-users2"
        onClick={(e) => { this.goTo(e, '/admin/users/') }}>
      </div>
    )
  }

  render() {
    const className = this.state.showNotifications ? 'nots icon-notifications open' : 'nots icon-notifications';
    const badgeNumber = this.state.notifications;

    const {
      dashboardTitle,
      tasksTitle,
      videosTitle,
      projectsTitle,
      insuredsTitle,
      contactsTitle,
      settingsTitle,
      helpTitle,
      searchTitle,
      documentsTitle,
      agenciesTitle,
    } = this.props.localization.strings.common.sidebar.headerIcons;

    const { isCertFocusUser, showHC, showUsersAndMail, showExago, currentUserRoleId, title, showSSO, currentUserCFRoleId } = this.state;

    return (
      <div className="notifications-wrapper">
        <Modal
          show={this.props.showModal}
          onHide={this.closeSearchSCModal}
          className="add-item-modal add-sc"
        >
          <Modal.Body className="add-item-modal-body">
            <SearchSCModal
              close={this.closeSearchSCModal}
              viewSubcontractor={this.viewSubcontractor}
              viewInsured={this.viewInsured}
            />
          </Modal.Body>
        </Modal>
        {
          canSeeUsersAndMail.has(currentUserRoleId)
            ? <SearchBar
              viewSubcontractor={this.viewSubcontractor}
              viewInsured={this.viewInsured}
            />
            : null
        }
        {
          canSeeHCsAndExago.has(currentUserRoleId) || isCertFocusUser
            ? <div
              title={title}
              className={`hc-icon${isCertFocusUser ? ' holder-icon' : ''}`}
              onClick={(e) => { this.goTo(e, '/hiringclients/') }}>
            </div>
            : null
        }
        <RolAccess
          masterTab="users"
          sectionTab="view_users"
          component={this.renderUsersIcon}>
        </RolAccess>

        {
          canSeeHCsAndExago.has(currentUserRoleId)
            ? <div
              title={dashboardTitle}
              className="linear-icon-document"
              onClick={(e) => { this.goTo(e, '/dashboard/') }}>
            </div>
            : null
        }
        <RolAccess
          masterTab="mail"
          sectionTab="send_email"
          component={() => this.renderEmail()}>
        </RolAccess>

        <div id="nots-bell" title={tasksTitle} className={className} onClick={this.markAsRead}>
          {badgeNumber > 0 ? <a className="nots-badge">{badgeNumber}</a> : null}
        </div>
        { /* ADMIN USER */
          ((currentUserRoleId !== 0) && (currentUserRoleId !== 8))
            ? <div
              title={videosTitle}
              className="linear-icon-film-play" onClick={(e) => { this.goTo(e, '/video') }} >
            </div>
            : null
        }

        {/* CERT FOCUS ITEMS */}
        {
          isCertFocusUser ?
            <div
              title={projectsTitle}
              className="linear-icon-archive2" onClick={(e) => { this.goTo(e, '/certfocus/projects') }} >
            </div> : null
        }
        {
          isCertFocusUser ?
            <div
              title={insuredsTitle}
              className="linear-icon-shield" onClick={(e) => { this.goTo(e, '/certfocus/insureds') }} >
            </div> : null
        }
        {
          isCertFocusUser ?
            <div
              title={contactsTitle}
              className="linear-icon-contacts" onClick={(e) => { this.goTo(e, '/certfocus/contacts') }} >
            </div> : null
        }
        {
          isCertFocusUser ?
            <div
              title={agenciesTitle}
              className="linear-icon-medal" onClick={(e) => { this.goTo(e, '/certfocus/agencies') }} >
            </div> : null
        }
        {
          isCertFocusUser ?
            <div
              title={documentsTitle}
              className="linear-icon-books" onClick={(e) => { this.goTo(e, '/certfocus/documents') }} >
            </div> : null
        }
        {
          isCertFocusUser ?
            <div
              title={searchTitle}
              className="linear-icon-binoculars" onClick={(e) => { this.goTo(e, '/certfocus/searchResults') }} >
            </div> : null
        }
        {
          isCertFocusUser ?
            <div
              title={settingsTitle}
              className="linear-icon-gear" onClick={(e) => { this.goTo(e, '/certfocus/settings') }} >
            </div> : null
        }
        {
          isCertFocusUser ?
            <div
              title={helpTitle}
              className="linear-icon-question" onClick={(e) => { this.goTo(e, '/certfocus/help') }} >
            </div> : null
        }
        {
          showSSO ? // showSSO
            <div
              title={'SSO'}
              className="sso-icon" onClick={this.openSSO} >
            </div> : null
        }
        {this.renderUserNameAndLogut()}
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    showModal: state.sc.showSearchModal,
    login: state.login,
    common: state.common,
    localization: state.localization,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    setSearchSCShowModal: bindActionCreators(setSearchSCShowModal, dispatch),
    setHiringClientId: bindActionCreators(setHiringClientId, dispatch),
    loginActions: bindActionCreators(loginActions, dispatch),
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserNotifications));
