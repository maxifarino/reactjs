import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Tabs from './tabs';
import Utils from '../../lib/utils';

import ChangeSubNameModal from './modals/changeSubName'
import ChangeLocationModal from './modals/changeLocation';
import ChangeStatusModal from './modals/changeStatus';
import ChangeTierModal from './modals/changeTier';
import ChangeBasicDataModal from './modals/changeBasicData';
import * as actions from './actions';
import * as scActions from '../subcontractors/actions';
import * as commonActions from '../common/actions';
import * as financialInfoActions from './tabs/financialInfo/actions/index'
import { setRedirectHcId } from '../payments/actions'
import { showQuickConfirmation } from '../alerts'
import './scprofile.css';
import RenderSelect from '../customInputs/renderSelect'

class SCProfile extends React.Component {
  constructor(props) {
    console.log('SCProfile');
    super(props);

    const { scId } = props.match.params;
    
    this.changeHiringClient = this.changeHiringClient.bind(this);
    this.setHiringClient = this.setHiringClient.bind(this)
    this.renderHeader = this.renderHeader.bind(this);
    this.renderSCHeader = this.renderSCHeader.bind(this);
    this.renderFullHeader = this.renderFullHeader.bind(this);
    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
    this.renderSubcontractorName = this.renderSubcontractorName.bind(this)
    this.renderDisabledNotice = this.renderDisabledNotice.bind(this)

    props.commonActions.setLastSubcontractor(scId);
    props.commonActions.setLastHiringClient(props.scProfile.hcId);
    props.scActions.fetchSCStatus();
    props.scActions.fetchSCTierRates();

    // const userId = props.login.userId

    // if (scId && userId) {
    //   props.actions.fetchHiringClientsForSCprofile(scId, userId, true);
    // }
    if (props.scProfile.hcId && props.scProfile.hcId !== "") {
      const hcId = props.scProfile.hcId
      props.financialInfoActions.fetchSubmitionDates(hcId, scId);

      props.financialInfoActions.fetchPrequalDates(hcId, scId);
      props.actions.fetchHeaderDetails(scId, hcId, 'sc-profile constructor 1');
    } else if (!props.scProfile.hcId) {
      props.actions.fetchHeaderDetails(scId, null, 'sc-profile constructor 2');
    }

    this.state = {
      showScoreCardModal: false,
      showChangeStatusModal: false,
      showChangeLocationModal: false,
      showChangeTierModal: false,
      showChangeBasicDataModal: false,
      showChangeSubNameModal: false,
      hcListInited: false,
      scId,
      hasRegistrationLinkBeenCopied: false,
      displaySCname: '',
      displaySCstreet: '',
      displaySCaddress: '',
      displaySCphone: '',
      displayHCid: Number(props.scProfile.hcId) || '',
      displayHCofficeLocation: '',
      displaySCstatusId: '',
      displaySCstatus: '',
      displaySCtrade: '',
      displayTierRating: '',
      displaySPL: '',
      displayAPL: '',
      displaySCtype: '',
      displaySCprqDate: '',
      savedFormId: '',
      hasLandedOnRedirectedHC: false,
      redirectHCid: ''
    };

    // if (scId && props.scProfile.hcId) {
      // props.financialInfoActions.fetchAccountsList(props.scProfile.hcId, scId);
    // }
  }

  componentDidMount() {
    const { hcId } = this.props.scProfile;
    const { scId } = this.state;

    if (hcId && scId) {
      this.props.actions.fetchHeaderDetails(scId, hcId, 'sc-profile componentDidMount');
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { hcId } = this.props.scProfile
    const newHcId  = nextProps.scProfile.hcId
    // console.log('sc-profile hcId = ', hcId)
    // console.log('sc-profile newHcId = ', newHcId)
    if(newHcId && newHcId.toString() !== hcId.toString()){
      this.props.commonActions.setLastHiringClient(newHcId);

      this.props.financialInfoActions.fetchSubmitionDates(newHcId, this.state.scId);

      this.props.financialInfoActions.fetchPrequalDates(newHcId, this.state.scId);
    }

    // CLIPBOARD SUPPORT
    let oldCopy = this.state.hasRegistrationLinkBeenCopied
    let newCopy = nextState.hasRegistrationLinkBeenCopied
    if (newCopy && oldCopy !== newCopy) {
      showQuickConfirmation(
        {
          title: 'Registration Link Copied to Clipboard!',
          timer: 1000
        }
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps = ', nextProps)
    // const newHcId    = nextProps.scProfile.hcId
    const newHcId              = Number(nextProps.scProfile.hcId)
    const oldHcId              = this.state.displayHCid
    const { scId }             = this.state;
    const oldPrimaryWasChanged = this.props.primaryWasChanged
    const newPrimaryWasChanged = nextProps.primaryWasChanged

    // console.log('newHcId = ', newHcId)
    // console.log('newPrimaryWasChanged = ', newPrimaryWasChanged)
    // console.log('oldPrimaryWasChanged = ', oldPrimaryWasChanged)

    if ( newHcId && (newPrimaryWasChanged && newPrimaryWasChanged != oldPrimaryWasChanged)) {
      this.props.actions.fetchHeaderDetails(scId, newHcId, 'sc-profile componentWillRecieveProps');
      this.props.actions.setChangingPrimary(false)
      return
    }
    
    const newFin     = nextProps.scProfile.headerDetails.FinIsComplete
    const oldFin     = this.props.scProfile.headerDetails.FinIsComplete
    const newSFid    = nextProps.scProfile.headerDetails.savedFormId
    const oldSFid    = this.props.scProfile.headerDetails.savedFormId
    const newSCname  = nextProps.scProfile.headerDetails.name
    const oldSCname  = this.props.scProfile.headerDetails.name
    const newSCaddr  = nextProps.scProfile.headerDetails.address
    const oldSCaddr  = this.props.scProfile.headerDetails.address
    const newSCcity  = nextProps.scProfile.headerDetails.city
    const oldSCcity  = this.props.scProfile.headerDetails.city
    const newSCstate = nextProps.scProfile.headerDetails.state
    const oldSCstate = this.props.scProfile.headerDetails.state
    const newSCzip   = nextProps.scProfile.headerDetails.zipCode
    const oldSCzip   = this.props.scProfile.headerDetails.zipCode
    const newSCphone = nextProps.scProfile.headerDetails.phone
    const oldSCphone = this.props.scProfile.headerDetails.phone
    const newHCloc   = nextProps.scProfile.headerDetails.OfficeLocation
    const oldHCloc   = this.props.scProfile.headerDetails.OfficeLocation
    const newSCstat  = nextProps.scProfile.headerDetails.subcontratorStatus
    const oldSCstat  = this.props.scProfile.headerDetails.subcontratorStatus
    const newStatId  = nextProps.scProfile.headerDetails.subcontratorStatusId
    const oldStatId  = this.props.scProfile.headerDetails.subcontratorStatusId
    const newSCtrade = nextProps.scProfile.headerDetails.trade
    const oldSCtrade = this.props.scProfile.headerDetails.trade
    const newSCrate  = nextProps.scProfile.headerDetails.tierRating
    const oldSCrate  = this.props.scProfile.headerDetails.tierRating
    const newSPL     = nextProps.scProfile.headerDetails.singleProjectLimit
    const oldSPL     = this.props.scProfile.headerDetails.singleProjectLimit
    const newAPL     = nextProps.scProfile.headerDetails.aggregateProjectExposure
    const oldAPL     = this.props.scProfile.headerDetails.aggregateProjectExposure
    const newSCtype  = nextProps.scProfile.headerDetails.companyType
    const oldSCtype  = this.props.scProfile.headerDetails.companyType
    const newPrqDate = nextProps.scProfile.headerDetails.dateOfPrequal
    const oldPrqDate = this.props.scProfile.headerDetails.dateOfPrequal
    const newFetch   = nextProps.scProfile.fetchingHeader
    const oldFetch   = this.props.scProfile.fetchingHeader

    if ((newFin || newFin == null) && newFin != oldFin) {
      this.setState({
        FinIsComplete: newFin ? newFin : ''
      })
    }

    if ((newSCname || newSCname == null) && newSCname != oldSCname) {
      this.setState({
        displaySCname: newSCname ? Utils.displayQuotes(newSCname) : ''
      })
    }
    if ((newSCaddr || newSCaddr == null) && newSCaddr != oldSCaddr) {
      this.setState({
        displaySCstreet: newSCaddr ? newSCaddr : ''
      })
    }
    if ((newSCcity || newSCcity == null)  && newSCcity  != oldSCcity  && 
        (newSCstate || newSCstate == null) && newSCstate != oldSCstate && 
        (newSCzip || newSCzip == null)   && newSCzip   != oldSCzip) {
      this.setState({
        displaySCaddress: `${newSCcity ? newSCcity : ''}, ${newSCstate ? newSCstate : ''}, ${newSCzip ? newSCzip : ''}`
      })
    }
    if ((newSCphone || newSCphone == null) && newSCphone != oldSCphone) {
      this.setState({
        displaySCphone: Utils.formatPhoneNumber(newSCphone)
      })
    }
    if ((newHCloc || newHCloc == null) && newHCloc != oldHCloc) {
      this.setState({
        displayHCofficeLocation: newHCloc ? Utils.displayQuotes(newHCloc) : ''
      })
    }
    if ((newSCstat || newSCphone == null) && newSCstat != oldSCstat) {
      this.setState({
        displaySCstatus: newSCstat ? newSCstat : ''
      })
    }
    if ((newStatId || newStatId == null) && newStatId != oldStatId) {
      this.setState({
        displaySCstatusId: newStatId ? newStatId : ''
      })
    }
    if ((newSCtrade || newSCtrade == null) && newSCtrade != oldSCtrade) {
      this.setState({
        displaySCtrade: newSCtrade ? newSCtrade : ''
      })
    }
    if ((newSCrate || newSCrate == null) && newSCrate != oldSCrate) {
      this.setState({
        displayTierRating: newSCrate ? newSCrate : ''
      })
    }
    if ((newSPL || newSPL == null) && newSPL != oldSPL) {
      this.setState({
        displaySPL: newSPL ? this.getLimitValue(newSPL) : ''
      })
    }
    if ((newAPL || newAPL == null) && newAPL != oldAPL) {
      this.setState({
        displayAPL: newAPL ? this.getLimitValue(newAPL) : ''
      })
    }
    if ((newSCtype || newSCtype == null) && newSCtype != oldSCtype) {
      this.setState({
        displaySCtype: newSCtype ? newSCtype : ''
      })
    }
    if ((newPrqDate || newPrqDate == null) && newPrqDate != oldPrqDate) {
      this.setState({
        displaySCprqDate: newPrqDate ? new Date(newPrqDate).toLocaleString() : ''
      })
    }
    if (newFetch == false && oldFetch !== newFetch) {
      this.setState({
        fetchingHeader: newFetch
      })
    }

    const newShouldResetHC =    nextProps.payments                            
                             && nextProps.payments.redirectHcId              
                             ?  Number(nextProps.payments.redirectHcId)
                             :  false

    if (!this.state.hasLandedOnRedirectedHC && newShouldResetHC && newShouldResetHC != newHcId) {
      this.setState({
        redirectHCid: newShouldResetHC
      }, () => {
        this.setHiringClient(newShouldResetHC)
      })
    } else {
      if (newHcId && newHcId != oldHcId) {
        this.setState({
          displayHCid: newHcId
        })
      }
    }
       

  }

  componentWillUnmount() {
    this.props.actions.setHiringClientId("");
  }

  renderDisabledNotice(isEnabled) {
    const disabled = (
      <div className="row noTopMarPad rowHeight">
        <div className='col col-lg-12'>
          <p className="sc-financial-recommend notice">THIS SUBCONTRACTOR IS DISABLED</p>
        </div>
      </div>
    )
    let output = isEnabled == 0 ? disabled : null
    return output
  }

  handleCopyClipboard() {
    this.setState({
      hasRegistrationLinkBeenCopied: true
    })
  }

  openScoreCardModal = (e) => {
    this.setState({showScoreCardModal: true});
  }
  closeScoreCardModal = (e) => {
    this.setState({showScoreCardModal: false});
  }

  openChangeStatusModal = () => {
    this.setState({showChangeStatusModal: true});
  }

  openChangeSubNameModal = () => {
    this.setState({showChangeSubNameModal: true});
  }

  closeChangeSubNameModal = () => {
    this.setState({showChangeSubNameModal: false});
  }

  openChangeLocationModal = () => {
    this.setState({showChangeLocationModal: true});
  }

  closeChangeLocationModal = () => {
    this.setState({showChangeLocationModal: false});
  }

  closeChangeStatusModal = () => {
    this.setState({showChangeStatusModal: false});
  }

  openChangeTierModal = () => {
    this.setState({ showChangeTierModal: true });
  }

  closeChangeTierModal = () => {
    this.setState({ showChangeTierModal: false });
  }

  openChangeBasicDataModal = () => {
    this.setState({ showChangeBasicDataModal: true });
  }

  closeChangeBasicDataModal = () => {
    this.setState({ showChangeBasicDataModal: false });
  }

  openRegisterLink = () => {
    const link = _.get(this.props.scProfile, 'headerDetails.registrationUrl');

    if (link) {
      const win = window.open(link, '_blank');
      win.focus();
    }
  }

  getLimitValue(value) {
    let unFormattedValue = value ? value.replace('$', '') : 0

    return `$ ${Utils.formatNumberWithCommas(unFormattedValue)}`;
  }

  refreshHeader = (closeCallback) => {
    // this.props.actions.fetchHeaderDetails(scId, hcId, closeCallback);
    closeCallback()
    window.location.reload();
  }

  onAddSubcontractor = (e) => {
    this.props.scActions.setAddSCShowModal(true);
    this.props.history.push('/subcontractors/');
  }

  setHiringClient(hcId) {
    // console.log('setHiringClient hcId =', hcId)
    this.setState({
      displayHCid: hcId,
      hasLandedOnRedirectedHC: true
    }, () => {
      // console.log('setHiringClientId, setLastHiringClient, fetchHeaderDetails, fetchPrequalDates kicked off')
      this.props.actions.setHiringClientId(hcId);
      this.props.commonActions.setLastHiringClient(hcId);
      this.props.actions.fetchHeaderDetails(this.state.scId, hcId, 'sc-profile changeHiringClient');
      this.props.financialInfoActions.fetchPrequalDates(hcId, this.state.scId);
    })
  }

  changeHiringClient(event) {
    const hcId = event.target.value;

    const oldResetHcId =     this.props.payments                            
                          && this.props.payments.redirectHcId              
                          ?  Number(this.props.payments.redirectHcId)
                          :  false

    

    if (oldResetHcId) {
      this.props.setRedirectHcId(null)
    }
    if (hcId !== "") {
      this.setHiringClient(hcId)
    }
  }

  renderHiringClient(labelHiringClient, displayHCid, redirectHCid) {
    const { hiringClientsList } = this.props.scProfile.headerDetails;
    const { multipleStrictHCs, RoleID } = this.props.login.profile

    const filterHiringClients = (subArray, userArray) => {
      const userSet = new Set(userArray)
      let output = []
      for (let i=0; i<subArray.length; i++) {
        const subHiringClientId = subArray[i].value
        if (userSet.has(subHiringClientId)) {
          output.push(subArray[i])
        }
      } 
      return output
    }

    const reorderList = (redirectHCid, _hiringClientsList) => {
      let output = []
      let displayObj = ''
    
      for (let i=0; i<_hiringClientsList.length; i++) {
        let hcObj = _hiringClientsList[i]
        if (redirectHCid == hcObj.value) {
          output.push(hcObj)
        }
      }
    
      for (let i=0; i<_hiringClientsList.length; i++) {
        let hcObj = _hiringClientsList[i]
        if (redirectHCid != hcObj.value) {
          output.push(_hiringClientsList[i])
        }
      }
    
      return output
    }

    const replaceProps = (hiringClientsList) => {
      const output = []
      for (let i=0; i<hiringClientsList.length; i++) {
        let obj = hiringClientsList[i]
        let hcObj = {}
        hcObj.label = obj.name
        hcObj.value = obj.hiringClientId
        output.push(hcObj)
      }
      return output
    }

    const routeHCdisplayByRole = (RoleID, hiringClientsList, multipleStrictHCs) => {
      if (RoleID == 3 || RoleID == 6) {
        const _hiringClientsList = filterHiringClients(hiringClientsList, multipleStrictHCs)
        // console.log('route 3/6 _hiringClientsList = ', _hiringClientsList)
        return _hiringClientsList
      } else {
        // console.log('route 1,2,4,5,7 hiringClientsList = ', hiringClientsList)
        // const _hiringClientsList = redirectHCid ? reorderList(redirectHCid, hiringClientsList) : hiringClientsList
        const _hiringClientsList = redirectHCid ? reorderList(redirectHCid, hiringClientsList) : hiringClientsList
        return _hiringClientsList
      }
    }

    let _hiringClientsList = replaceProps(hiringClientsList)
        _hiringClientsList = routeHCdisplayByRole(RoleID, _hiringClientsList, multipleStrictHCs)
    // console.log('hiringClientsList = ', hiringClientsList)
    // console.log('multipleStrictHCs = ', multipleStrictHCs)
    // console.log('_hiringClientsList = ', _hiringClientsList)
    // console.log('_displayHCid = ', _displayHCid)
    // console.log('getNameById(_displayHCid, _hiringClientsList) = ', getNameById(_displayHCid, _hiringClientsList))
    
    let component = 'NONE';

    if (_hiringClientsList.length === 0) {
      component = (
        <div className="lineHeight">
          <span className="sc-financial-label labelPad">{labelHiringClient}</span>
          <span className="sc-financial-value">{"----"}</span>
        </div>
      );
    } else if (_hiringClientsList.length === 1) {
      component = (
        <div className="lineHeight">
          <span className="sc-financial-label labelPad">{labelHiringClient}</span>
          <span className="sc-financial-value">{_hiringClientsList[0].label}</span>
        </div>
      );
    } else if (_hiringClientsList.length > 1) {
      const input = {
        value: displayHCid,
        onChange: this.changeHiringClient
      }
      const meta = {
        touched: false,
        error: null,
        warning: null
      }
      component = (
        <div className="changeHcSelect lineHeight row">
          <span className="sc-financial-label labelPad pull-left">{labelHiringClient}</span>
          <span className="select-wrapper specialSelect">
            <RenderSelect 
              options={_hiringClientsList}
              className="hcSelect"
              input={input}
              meta={meta}
            />
          </span>
        </div>
      );
    }

    return component;
  }

  renderSubcontractorName(changeSubName, labelSubcontractor, displaySCname) {
    const allowedRoles = new Set([1,2,3,4,5])
    const currentRole = Number(this.props.login.profile.RoleID)
    let component = (
      <div className="row no-marPad noTopBottomMarPad">
        <div className="col col-lg-12 pull-left no-marPad">
          <div className="sc-financial-value no-right-marPad">
            <div className="lineHeight">
              <span className="sc-financial-label labelPad">{labelSubcontractor}</span>
              <span className="sc-financial-value">{displaySCname || "----"}</span>
              {
                allowedRoles.has(currentRole)
                  ? <span className="linear-icon-pencil-edit" onClick={this.openChangeSubNameModal}></span>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    )
    return component
  }

  renderHiringClientOfficeLocation(officeLocationLabel, changeOfficeLoc) {
    const { hiringClientsList } = this.props.scProfile.headerDetails;
    const displayHCofficeLocation = this.state.displayHCofficeLocation
    let component = 'NONE'
    const allowedRoles = new Set([1,2,3,5,6])
    const currentRole = Number(this.props.login.profile.RoleID)
    if (!_.isEmpty(hiringClientsList)) {
      component = (
        <div className="row no-marPad noTopBottomMarPad">
          <div className="col col-lg-12 pull-left no-marPad">
            <div className="sc-financial-value no-right-marPad">
              <div className="lineHeight">
                <span className="sc-financial-label labelPad">{officeLocationLabel}</span>
                <span className="sc-financial-value">{displayHCofficeLocation  || "----"}</span>
                {
                changeOfficeLoc && allowedRoles.has(currentRole)
                  ? <span className="linear-icon-pencil-edit" onClick={this.openChangeLocationModal}></span>
                  : null
              }
              </div>
            </div>
          </div>
        </div>
      );
    }
    return component;
  }

  renderHeader () {
    let isSubcontractor = true;
    isSubcontractor = this.props.login.profile.RoleID == 4;
    const isEnabled = this.props.scProfile.headerDetails.enabled

    if(isSubcontractor) {
      return this.renderSCHeader(isEnabled);
    } else {
      return this.renderFullHeader(isEnabled);
    }
  }

  renderSCHeader(isEnabled) {
    // const { headerDetails } = this.props.scProfile;

    const {
      labelTrade,
      officeLocationLabel,
      labelHiringClient,
      labelSubcontractor,
      labelSubAddress,
      changeSubName,
      labelPhone
    } = this.props.local.strings.scProfile.header;

    // general info
    const {
      displaySCname,
      displaySCstreet,
      displaySCaddress,
      displaySCphone,
      displaySCtrade,
      displayHCid,
      redirectHCid
    } = this.state
    // const scName = displaySCname;
    // const scStreet = displaySCstreet;
    // const scAddress = displaySCaddress;
    // const scPhone = Utils.formatPhoneNumber(displaySCphone);
    // financial info
    // const scTrade = displaySCtrade;

    const leftColumn = `3`
    const centerLeftColumn = `4`
    const centerrightColumn = `4`
    const rightColumn = `1`

    return (
      <div className="row sc-header-info">

        <div className="col col-lg-12 sc-financial-info no-marPad">
          <div className="row noTopBottomMarPad rowHeight">

            <div className={`col col-lg-${leftColumn}`}></div>

            <div className={`col col-lg-${centerLeftColumn}`}>
              {
                this.renderSubcontractorName(changeSubName, labelSubcontractor, displaySCname)
              }
            </div>

            <div className={`col col-lg-${centerrightColumn}`}>
              {
                this.renderHiringClient(labelHiringClient, displayHCid, redirectHCid)
              }
            </div>

            <div className={`col col-lg-${rightColumn}`}></div>

          </div>
          <div className="row noTopBottomMarPad rowHeight">

            <div className={`col col-lg-${leftColumn}`}></div>

            <div className={`col col-lg-${centerLeftColumn}`}>
              <div className="lineHeight">
                <span className="sc-financial-label labelPad">{labelSubAddress}</span>
                <span className="sc-financial-value">{displaySCstreet || "----"}</span>
              </div>
            </div>

            <div className={`col col-lg-${centerrightColumn}`}>
              {
                this.renderHiringClientOfficeLocation(officeLocationLabel, false)
              }
            </div>

            <div className={`col col-lg-${rightColumn}`}></div>

          </div>
          <div className="row noTopBottomMarPad rowHeight">

            <div className={`col col-lg-${leftColumn}`}></div>

            <div className={`col col-lg-${centerLeftColumn}`}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="sc-financial-value">{displaySCaddress}</span>
            </div>

            <div className={`col col-lg-${centerrightColumn}`}></div>
            <div className={`col col-lg-${rightColumn}`}></div>

          </div>
          <div className="row noTopMarPad rowHeight">

            <div className={`col col-lg-${leftColumn}`}></div>

            <div className={`col col-lg-${centerLeftColumn}`}>
              <div className="lineHeight">
                <span className="sc-financial-label labelPad">{labelPhone}</span>
                <span className="sc-financial-value">{displaySCphone || "----"}</span>
              </div>
            </div>

            <div className={`col col-lg-${centerrightColumn}`}></div>
            <div className={`col col-lg-${rightColumn}`}></div>

          </div>
          <div className="row noTopMarPad rowHeight">

          <div className={`col col-lg-${leftColumn}`}></div>

          <div className={`col col-lg-${centerLeftColumn}`}>
            <div className="sc-financial-value lineHeight">
              <span className="sc-financial-label labelPad">{labelTrade}</span>
              <span className="sc-financial-value">{displaySCtrade || "----"}</span>
            </div>
          </div>

          <div className={`col col-lg-${centerrightColumn}`}></div>
          <div className={`col col-lg-${rightColumn}`}></div>

          </div>
          { this.renderDisabledNotice(isEnabled) }
        </div>
      </div>
    );
  }

  renderFullHeader(isEnabled) {
    const { headerDetails } = this.props.scProfile;

    const {
      displaySCname,
      displaySCstreet,
      displaySCaddress,
      displaySCphone,
      displaySCstatus,
      displaySCtrade,
      displayTierRating,
      displaySPL,
      displayAPL,
      displaySCtype,
      displaySCprqDate,
      displayHCid,
      redirectHCid,
      FinIsComplete
    } = this.state

    const {
      labelTrade,
      labelPrequalDate,
      labelStatus,
      labelTierRating,
      riskRecommend,
      labelSingleProjectLimit,
      labelAggregateProjectExposure,
      labelCorpType,
      viewRegistrationLinkBtn,
      changeStatusBtn,
      changeOfficeLoc,
      changeSubName,
      changeTierBtn,
      changeBasicDataBtn,
      officeLocationLabel,
      labelHiringClient,
      labelSubcontractor,
      labelSubAddress,
      labelPhone
    } = this.props.local.strings.scProfile.header;

    let isPrequalRole = false;
    if (this.props.login.profile.Role) {
      isPrequalRole = this.props.login.profile.Role.IsPrequalRole;
    }

    const registrationUrl = _.get(this.props.scProfile, 'headerDetails.registrationUrl')



    const leftColumn = `4`
    const centerColumn = `4`
    const rightColumn = `4`

    return (
      <div className="row sc-header-info">

        <div className="col col-lg-12 sc-financial-info no-marPad">
          <div className='row noTopBottomMarPad rowHeight'>

            <div className={`col col-lg-${leftColumn}`}>
              {
                this.renderSubcontractorName(changeSubName, labelSubcontractor, displaySCname)
              }
            </div>

            <div className={`col col-lg-${centerColumn}`}>
              {
                this.renderHiringClient(labelHiringClient, displayHCid, redirectHCid)
              }
            </div>

            <div className={`col col-lg-${rightColumn} text-left`}>
              <div className="row no-marPad noTopBottomMarPad sc-financial-value">
                <div className="col col-lg-12 no-marPad pull-left lineHeight">
                  <span className="sc-financial-label labelPad rightCol">{labelTierRating}</span>
                  <span className="sc-financial-value">{displayTierRating || "----"}</span>
                  {
                    isPrequalRole && FinIsComplete === 1 
                    ? <span className="linear-icon-pencil-change" onClick={this.openChangeTierModal}></span>
                      :
                      null
                  }
                </div>
                {
                  (displayTierRating === 3 || displayTierRating === '3' || displayTierRating === '3-High Risk') && FinIsComplete === 1
                    ? <div className="sc-financial-recommend rightCol">{riskRecommend}</div>
                    : ''
                }
              </div>
            </div>

          </div>
          <div className='row noTopBottomMarPad rowHeight'>

            <div className={`col col-lg-${leftColumn}`}>
              <div className="lineHeight">
                <span className="sc-financial-label labelPad">{labelSubAddress}</span>
                <span className="sc-financial-value">{displaySCstreet || "----"}</span>
              </div>
            </div>

            <div className={`col col-lg-${centerColumn}`}>
              {
                this.renderHiringClientOfficeLocation(officeLocationLabel, changeOfficeLoc)
              }
            </div>

            <div className={`col col-lg-${rightColumn} text-left`}>
              <div className="sc-financial-value rightCol">
                <div className="lineHeight">
                  <span className="sc-financial-label labelPad">{labelSingleProjectLimit}</span>
                  <span className="sc-financial-value">{displaySPL || "----"}</span>
                </div>
              </div>
            </div>

          </div>
          <div className="row noTopBottomMarPad rowHeight">

            <div className={`col col-lg-${leftColumn}`}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="sc-financial-value">{displaySCaddress}</span>
            </div>

            <div className={`col col-lg-${centerColumn}`}>
              <div className="row no-marPad noTopBottomMarPad">
                <div className="col col-lg-12 pull-left no-marPad">
                  <div className="sc-financial-value lineHeight">
                    <span className="sc-financial-label labelPad">{labelStatus}</span>
                    <span className="sc-financial-value">{displaySCstatus || "----"}</span>
                    {
                      isPrequalRole
                        ? <span className="linear-icon-pencil-change" onClick={this.openChangeStatusModal}></span>
                        :null
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className={`col col-lg-${rightColumn} text-left`}>
              <div className="sc-financial-value lineHeight rightCol">
                <span className="sc-financial-label labelPad">{labelAggregateProjectExposure}</span>
                <span className="sc-financial-value">{displayAPL || "----"}</span>
              </div>
            </div>

          </div>
          <div className="row noTopBottomMarPad rowHeight">

            <div className={`col col-lg-${leftColumn}`}>
              <div className="lineHeight">
                <span className="sc-financial-label labelPad">{labelPhone}</span>
                <span className="sc-financial-value">{displaySCphone || "----"}</span>
              </div>
            </div>
            <div className={`col col-lg-${centerColumn}`}>
              <div className="sc-financial-value lineHeight">
                <span className="sc-financial-label labelPad">{labelTrade}</span>
                <span className="sc-financial-value">{displaySCtrade || "----"}</span>
              </div>
            </div>
            <div className={`col col-lg-${rightColumn} text-left`}>
              <div className="sc-financial-value lineHeight rightCol">
                <span className="sc-financial-label labelPad">{labelCorpType}</span>
                <span className="sc-financial-value">{displaySCtype || "----"}</span>
              </div>
            </div>

          </div>
          <div className="row noTopMarPad rowHeight">

            <div className={`col col-lg-${leftColumn}`}>
            </div>

            <div className={`col col-lg-${centerColumn}`}>
            </div>

            <div className={`col col-lg-${rightColumn}`}>
              <div className="sc-financial-value lineHeight rightCol">
                <span className="sc-financial-label labelPad">{labelPrequalDate}</span>
                <span className="sc-financial-value">{displaySCprqDate || "----"}</span>
              </div>
            </div>

          </div>
          { this.renderDisabledNotice(isEnabled) }
          {
            isPrequalRole && !headerDetails.linkVisitedDate ?
              <div className="row noTopMarPad rowHeight">
                <div className={`col col-lg-${leftColumn}`}>
                  <button className="change-status-btn no-margin-left profileBtn" onClick={this.openChangeBasicDataModal}>
                    {changeBasicDataBtn}
                  </button>
                  <CopyToClipboard
                    onCopy={this.handleCopyClipboard}
                    text={registrationUrl}
                  >
                    <button className="change-status-btn profileBtn">
                      {viewRegistrationLinkBtn}
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
              :
              null
          }
        </div>
      </div>
    );
  }

  render() {
    const { headerDetails } = this.props.scProfile;
    const { 
      fetchingHeader, 
      scId, 
      displayHCid, 
      displayHCofficeLocation, 
      displaySCname, 
      displaySCstatusId, 
      displayAPL, 
      displaySPL,
      FinIsComplete, 
      savedFormId 
    } = this.state
    const { tierRating } = headerDetails

    let hasRole = false;
    if (this.props.login.profile.Role) {
      hasRole = true;
    }

    return (
      <div className="scprofile-container">
        <Modal
          show={this.state.showChangeBasicDataModal}
          className="add-item-modal noteEditorModal" >
          <Modal.Body className="add-item-modal-body">
            <ChangeBasicDataModal
              close={this.closeChangeBasicDataModal}
              successCallback={this.refreshHeader}
              hcId={displayHCid}
              scId={scId}
            />
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showChangeLocationModal}
          className="add-item-modal noteEditorModal" >
          <Modal.Body className="add-item-modal-body">
            <ChangeLocationModal
              close={this.closeChangeLocationModal}
              successCallback={this.refreshHeader}
              location={displayHCofficeLocation}
              hcId={displayHCid}
              scId={scId} />
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showChangeStatusModal}
          className="add-item-modal noteEditorModal" >
          <Modal.Body className="add-item-modal-body">
            <ChangeStatusModal
              close={this.closeChangeStatusModal}
              successCallback={this.refreshHeader}
              currentStatus={displaySCstatusId}
              hcId={displayHCid}
              userId={this.props.login.userId}
              scId={scId} />
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showChangeSubNameModal}
          className="add-item-modal noteEditorModal" >
          <Modal.Body className="add-item-modal-body">
            <ChangeSubNameModal
              close={this.closeChangeSubNameModal}
              successCallback={this.refreshHeader}
              subName={displaySCname}
              hcId={displayHCid}
              scId={scId} />
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.showChangeTierModal}
          className="add-item-modal noteEditorModal" >
          <Modal.Body className="add-item-modal-body">
            <ChangeTierModal
              close={this.closeChangeTierModal}
              successCallback={this.refreshHeader}
              currentTier={tierRating}
              hcId={displayHCid}
              scId={scId}
              aggregateProjectExposure={displayAPL}
              singleProjectLimit={displaySPL} />
          </Modal.Body>
        </Modal>

        {
          fetchingHeader ? (
            <div style={{ width:'100%', height:'200px', display: 'flex',
            alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner-wrapper">
                <div className="spinner"></div>
              </div>
            </div>
          ) : (
            <div>
              {
                headerDetails.name && hasRole?
                  this.renderHeader():null
              }
            </div>
          )
        }

        <Tabs status={headerDetails.subcontratorStatusId} headerDetails={headerDetails} scId={this.state.scId} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    scProfile: state.SCProfile,
    primaryWasChanged: state.SCProfile.primaryWasChanged,
    hc: state.hc,
    local: state.localization,
    login: state.login,
    payments: state.payments
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    scActions: bindActionCreators(scActions, dispatch),
    financialInfoActions: bindActionCreators(financialInfoActions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
    setRedirectHcId: bindActionCreators(setRedirectHcId, dispatch)
  }
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SCProfile));
