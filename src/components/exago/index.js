import React from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import Utils from '../../lib/utils'

import './exago.css';

const Alerts = require ('../alerts');
let api = null;

class Exago extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      reportTree: '',
      printParams: '',
      hasLoadActionBeenTaken: false,
      reportPath: '',
      loading: true
    }
    this.ShowFullUI = this.ShowFullUI.bind(this)
    this.executeReport = this.executeReport.bind(this)
    this.ShowControls = this.ShowControls.bind(this)
    this.ShowInput = this.ShowInput.bind(this)
    this.ShowReportTree = this.ShowReportTree.bind(this)
    this.setTreeToState = this.setTreeToState.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.setSub = this.setSub.bind(this)
    this.loadExagoAPI = this.loadExagoAPI.bind(this)
    this.checkData = this.checkData.bind(this)
    this.printReport = this.printReport.bind(this)
    this.routeActions = this.routeActions.bind(this)
  }

  routeActions(print, Id, ReportingRole, RoleID) {
    // console.log('print = ', print)
    // console.log('Id = ', Id)
    // console.log('ReportingRole = ', ReportingRole)
    // console.log('RoleID = ', RoleID)
    // console.log('this.state.hasLoadActionBeenTaken = ', this.state.hasLoadActionBeenTaken)
    // console.log('api = ', api)
    if (!this.state.hasLoadActionBeenTaken && Id && ReportingRole && RoleID) {

      if (!api && !print) {
        this.props.actions.initSession(() => {
          this.initApiAndShowFullView(Id, ReportingRole, RoleID);
          //this.ShowInput();
        });
      } else if (!print) {
        this.ShowFullUI();
        //this.ShowInput();
        //this.ShowControls();
        api.OnDisposeContainer = this.ResetContainer;
      } else if (print) {

        const storage    = window.localStorage
        const str        = storage.str
        const keys       = ['dates', 'savedFormId', 'hiringClientIDEnabled', 'subcontractorIDEnabled', 'savedFormIDEnabled', 'userId', 'scId', 'reportPath' ]
        const types      = ['obj', 'num', 'bool', 'bool', 'bool', 'num', 'num', 'str']
        const params     = Utils.objectifyString(str, keys, types)
        const reportPath = params.reportPath
        const report     = {}
        
        console.log('params in Exago right after str was "objectified" = ', params)

        if (params.hiringClientIDEnabled) {
          report['pocHiringClientIDList'] = params.userId
        } else {
          report['pocHiringClientIDList'] = 'NA'
        }
        if (params.savedFormIDEnabled) {
          report['pSavedFormID'] = params.savedFormId
        } else {
          report['pSavedFormID'] = 'NA'
        }
        if (params.subcontractorIDEnabled) {
          report['pSubcontractorIDList'] = params.scId
        } else {
          report['pSubcontractorIDList'] = 'NA'
        }
        console.log('report = ', report)
        
        this.setState({
          reportPath
        }, () => {
          this.props.actions.initSession(() => {
            this.printReport(report)
          });
        })
        // console.log(`storage BEFORE storage.removeItem('str') = `, storage)
        storage.removeItem('str')
        // console.log(`storage AFTER storage.removeItem('str') = `, storage)
      }
      this.setState({
        hasLoadActionBeenTaken: true
      })

    }
  }

  componentDidMount() {
    const { printReport, userProfile } = this.props;

    // console.log('printReport = ', printReport)
    // console.log('userProfile.Id = ', userProfile.Id)
    // console.log('userProfile.ReportingRole = ', userProfile.ReportingRole)
    // console.log('userProfile.RoleID = ', userProfile.RoleID)
    

    if (userProfile.Id && userProfile.ReportingRole && userProfile.RoleID) {
      this.routeActions(printReport, userProfile.Id, userProfile.ReportingRole, userProfile.RoleID)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.exago.loading && !nextProps.exago.loading){
      if (nextProps.exago.error) {
        Alerts.showInformationAlert(
          'Error',
          nextProps.exago.error,
          'Accept',
          false,
          ()=>{}
        );
      }
    }

    const { printReport } = this.props
    const { 
      RoleID, 
      ReportingRole, 
      Id
    } = this.props.userProfile

    const newPrint  = nextProps.printReport
    const newRoleId = nextProps.userProfile.RoleID
    const newRrole  = nextProps.userProfile.ReportingRole
    const newId     = nextProps.userProfile.Id
      

    const shouldDisplayPrintPage =    ( newPrint && newRoleId && newRrole && newId ) && 
                                      (
                                        ( newPrint  != printReport   )               ||
                                        ( newRoleId != RoleID        )               ||
                                        ( newRrole  != ReportingRole )               ||
                                        ( newId     != Id            )
                                      )

    if (shouldDisplayPrintPage) {
      this.routeActions(newPrint, newId, newRrole, newRoleId)
    }
  }

  componentWillUnmount () {
    this.disposeAll();
  }

  initApiAndShowFullView (Id, ReportingRole, RoleID) {
    this.props.actions.setParameter('roles', ReportingRole, { IsActive: true }, () => {
      this.props.actions.setParameter('parameters', 'pocHiringClientIDList', { Value: Id } , () => {
        this.props.actions.setParameter('roles', ReportingRole, { Value: Id },  () => {
          this.loadExagoAPI(this.ShowFullUI)
        }, RoleID);
      });
    });
  }

  printReport (params) {


      let
        keys = Object.keys(params),
        vals  = Object.values(params)

        // console.log('keys and vals in Exago/printReport = ', keys, vals)

      // console.log('ReportingRole in Exago/printReport = ', ReportingRole)

    // this.props.actions.setParameter('parameters', 'params', { params } , () => {
    //     this.loadExagoAPI(this.executeReport)
    // });

      this.props.actions.setParameter('parameters', keys[0], { Value: vals[0] } , () => {
        this.props.actions.setParameter('parameters', keys[1], { Value: vals[1] } , () => {
          this.props.actions.setParameter('parameters', keys[2], { Value: vals[2] } , () => {
            this.loadExagoAPI(this.executeReport)
          });
        });
      });



  }

  handleInputChange(e) {
    e.preventDefault()
    let psub = Number(this.psub.value)
    this.setSub(psub)
  }

  // patches that send Exago the subcontractor selection NEED to happen before the Exago API is instantiated.  Instantiating the Exago API causes the sessionId (and ApiKey) to refresh.
  setSub(sub) {
    this.props.actions.setParameter('psub', sub, () => {
      this.loadExagoAPI();
    });
  }

  loadExagoAPI(callback) {
    const exagoContainer = this.getE('ExagoWrapper')

    if (exagoContainer) {
      let apiKey = this.props.exago.apiKey

      if (apiKey && apiKey.length > 0) {
        api = new window.ExagoApi('https://bi.certfocus.com/Exago/', apiKey, callback);
        api.OnDisposeContainer = this.ResetContainer;
      }
    }
  }

  checkData() {
      this.props.actions.getParameter('psub');
  }

  ShowInput() {
    const input = 'input'
    this.showE(input);
    return this.getE(input)
  }

  ShowControls() {
    const jsApiMenu = 'JavascriptApiMenu'
    this.showE(jsApiMenu);
    this.executeReport();
    return this.getE(jsApiMenu)
  }

  executeReport() {
    this.hideE('Container-FullUI')
    this.disposeAll()
    let container = this.getE('Container-Report'),
    reportPath = this.state.reportPath
    // reportPath = `/CertFocus/PQ7 Scorecard`

    console.log('container = ', container)
    console.log('reportPath = ', reportPath)
    api.ExecuteReport(container, 'Html', reportPath, null)
    this.showE('Container-Report')
  }

  ShowFullUI() {
    const fullUI = 'Container-FullUI'

    this.hideE('Container-Report');
    this.disposeAll();
    this.showE(fullUI);

    let elem = this.getE(fullUI)

    api.LoadFullUI(elem);
    this.setState({
      loading: false
    })
  }

  setTreeToState(res) {
    console.log('succesffully called api.LoadReportTree() => ', res)
    this.setState({
      reportTree: res
    })
  }

  errCB() {
    console.log('Error in calling LoadReportTree')
  }

  ShowReportTree() {
    this.disposeAll();
    api.LoadReportTree(this.setTreeToState, this.errCB)
  }

  ResetContainer(container) {
		if (container)
			container.innerHTML = "";
  }

  getE(elem) { return document.getElementById(elem); }
  hideE(elem) {
    const el = this.getE(elem);
    if(el)el.classList.add("hide");
  }
  showE(elem) {
    const el = this.getE(elem);
    if(el)el.classList.remove("hide");
  }

  disposeAll() {
    //console.log('disposed of all');
    let exagoContainers = document.querySelectorAll("div.exago");
    for (let i = 0, len = exagoContainers.length; i < len; i++) {
      if(api){
        api.DisposeContainerContent(exagoContainers[i]);
      }
    }
  }

  render() {
    const spinnerContainerStyle = {
      position:'fixed',
      top:'0',
      left:'0',
      backgroundColor:'#80808087',
      width:'100%',
      height:'100%',
    };
    const spinnerStyle = {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (

      <div className="dashboard">
        <div>
          { this.state.loading 
            ? <div style={spinnerContainerStyle} >
                <div className="spinner-wrapper" style={spinnerStyle} >
                  <div className="spinner"></div>
                </div>
              </div>
            : null
          }
        </div>
        <form id="input" className="hide" onSubmit={this.handleInputChange}>
          <input type="text" id="input" ref={ psub => this.psub = psub } placeholder="select subcontractor" style={{ 'height': '25px', 'width':'200px' }}/>
          <input type="submit" id="jsBtn1" value="submit" style={{ 'height': '25px', 'width':'200px' }}/>
        </form>
        <div id="JavascriptApiMenu" ref={this.jsApiMenu} className="hide">
          <input type="button" id="jsBtn0" onClick={this.executeReport} value="Report" />
          <input type="button" id="jsBtn1" onClick={this.ShowFullUI} value="Full UI" />
          <input type="button" id="jsBtn1" onClick={this.ShowReportTree} value="Report Tree" />
          <input type="button" id="jsBtn1" onClick={this.checkData} value="Check psub data" />
        </div>
        <div id="ExagoWrapper" ref={this.exagoCont} runat="server">
          <div id="Container-Report" ref={this.contReport} className="hide">
            <div id="SectionText" runat="server" />
            <div id="SectionChart" className="exago" runat="server" />
            <div id="SectionReport" className="exago" runat="server" />
          </div>
          <div id="Container-FullUI" ref={this.fullUI} className="exago hide" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    exago: state.exago
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Exago);