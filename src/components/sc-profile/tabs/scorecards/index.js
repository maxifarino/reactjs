import React from 'react';
//import _ from 'lodash';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import html2pdf from 'html2pdf.js';

import ScoreCard from './scoreCard';
import Utils from '../../../../lib/utils';
import * as financialActions from '../financialInfo/actions';

import './scoreCard.css';

class ScoreCards extends React.Component {
  constructor(props) {
    super(props);

    this.submissionDateChange = this.submissionDateChange.bind(this)
    this.setPrintReportParams = this.setPrintReportParams.bind(this)
    this.setEmbeddedInfoResults = this.setEmbeddedInfoResults.bind(this)

    this.state = {
      scId: '',
      hcId: '',
      roleId: '',
      userId: '',
      subDates: '',
      submissionValue: '',
      isSubDatesEmpty: '',
      embeddedInfoResults: '',
      printParamString: '',
      embeddedReportId: 1,
      subDates: props.submissionDates
    };

    this.scoreCardRef = React.createRef();
  }

  async setEmbeddedInfoResults(embeddedReportId, roleId, SuDates, savedFormId, userId, scId) {

    let embeddedInfoResults = ''

    embeddedInfoResults     = await this.props.financialActions.fetchEmbeddedReportsInfo({embeddedReportId, roleId})

    if (embeddedInfoResults) {

      const hiringClientIDEnabled  = embeddedInfoResults.hiringClientIDEnabled
      const subcontractorIDEnabled = embeddedInfoResults.subcontractorIDEnabled
      const savedFormIDEnabled     = embeddedInfoResults.savedFormIDEnabled
      const reportPath             = embeddedInfoResults.reportPath

      // console.log('!!!! embeddedInfoResults = ', embeddedInfoResults)
      // console.log('SuDates = ', SuDates)
      // console.log('savedFormId = ', savedFormId)
      // console.log('hiringClientIDEnabled = ', hiringClientIDEnabled)
      // console.log('subcontractorIDEnabled = ', subcontractorIDEnabled)
      // console.log('savedFormIDEnabled = ', savedFormIDEnabled)
      // console.log('userId = ', userId)
      // console.log('scId = ', scId)
      // console.log('reportPath = ', reportPath)

      const str                    = `${JSON.stringify(SuDates)}_${savedFormId}_${hiringClientIDEnabled}_${subcontractorIDEnabled}_${savedFormIDEnabled}_${userId}_${scId}_${reportPath}`


        this.setState({
          embeddedInfoResults,
          printParamString: str
        })
      }
  }

  async componentWillReceiveProps(nextProps) {

    const {
      scId,
      hcId,
      isSubDatesEmpty,
      submissionValue,
      embeddedReportId,
      subDates
    } = this.state


    const newRoleId    = nextProps.currentRoleId
    const newUserId    = nextProps.currentUserId
    const newScId      = nextProps.scId ? nextProps.scId : nextProps.scIdFromTabs
    const newHcId      = nextProps.hcId
    const oldSubDates  = subDates
    const oldFirstDate = oldSubDates && oldSubDates[0] && oldSubDates[0].id ? oldSubDates[0].id : ''
    const newSubDates  = nextProps.submissionDates
    const newIsEmpty   = nextProps.isSubDatesEmpty
    const newSubVal    = newSubDates && newSubDates[0] && newSubDates[0].id ? newSubDates[0].id : ''

    if (!submissionValue) {
      this.setState({
        submissionValue: newSubVal
      });
    }

    if (!subDates || !subDates[0] || !subDates[0].id || (newSubVal && subDates[0].id != newSubVal)) {
      this.setState({
        subDates: newSubDates
      });
    }

    const shouldFetchSubmitionDates = ( newHcId && newScId ) &&
                                      (
                                        ( newHcId   != hcId ) ||
                                        ( newScId   != scId ) ||
                                        ( !oldFirstDate && !newSubDates )
                                      )

    if (shouldFetchSubmitionDates) {
        this.setState({
          scId: newScId,
          hcId: newHcId
        }, () => {
          this.props.financialActions.fetchSubmitionDates(newHcId, newScId, 'CWRP in ScoreCards')
        })
    }

    // console.log('newSubDates 1 = ', newSubDates)
    // console.log('newSubVal 1 = ', newSubVal)

    if (newSubVal && newSubVal != submissionValue && !newIsEmpty) {

      // if the submission value chosen is STILL within the set of submission values shared by the same HC and Sub
      if (newSubVal == oldFirstDate) {

        // console.log('XX newSubVal 2 = ', newSubVal)
        this.setEmbeddedInfoResults(embeddedReportId, newRoleId, newSubDates, submissionValue, newUserId, newScId)

        // if the submission value chosen is from ANOTHER set of submission values because the HC has changed
      } else {

        this.setState({
          submissionValue: newSubVal
        }, () => {
          // this.props.financialActions.fetchScoreCardsConcepts(newSubVal, 'ScoreCards CWRP');

          const shouldSetEIR =  newRoleId                                                          &&
                                (newSubDates && newSubDates[0] && newSubDates[0].dateOfSubmission) &&
                                newUserId                                                          &&
                                newScId

          if  (shouldSetEIR) {
            const { submissionValue } = this.state
            // console.log('XX submissionValue = ', submissionValue)
            this.setEmbeddedInfoResults(embeddedReportId, newRoleId, newSubDates, submissionValue, newUserId, newScId)

          }

        })
      }



    } else if (newIsEmpty == true && typeof isSubDatesEmpty == 'undefined') {
      this.setState({
        isSubDatesEmpty: true,
        submissionValue: ''
      })
    }


  }

  submissionDateChange(event) {
    const value = Number(event.target.value);

    if (value >= 0) {
      this.setState({
        submissionValue: value
      })
    }
  }

  createScorecardsPdf = () => {
    const pdfOptions = {
      filename: 'scorecards.pdf',
    };

    html2pdf().set(pdfOptions).from(this.scoreCardRef.current).save();
  }

  setPrintReportParams() {
    let storage = window.localStorage
    // console.log('storage before setting = ', storage.str)
    storage.setItem('str', this.state.printParamString)
    // console.log('storage after setting = ', storage.str)
    // storage.str = this.state.printParamString
  }

  render() {
    const submissionDates = this.props.submissionDates
    const embeddedInfoResults = this.state.embeddedInfoResults
    const { submissionValue } = this.state

    // console.log('submissionValue = ', submissionValue)

    if (this.props.financialsFetchingAccountsList) {
      return (
        <div style={{
          width: '100%',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="spinner-wrapper">
            <div className="spinner"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="list-view admin-view-body scoreCardInput">
        <div className="sciHeader">
          <div className="row">

            <div className="col-sm-6 row">
              <div className="col-sm-6">
                <div className='sciLabelWrapper'>Submission Date</div>
              </div>
              <div className="col-sm-6">
                <div className='sciSelectWrapper'>
                  <select className="sciInput" onChange={this.submissionDateChange} value={submissionValue}>
                    {
                      submissionDates.map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {Utils.getFormattedDate(item.dateOfSubmission, true)}
                          </option>
                        )
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            {
              embeddedInfoResults
              ? <div className="col-sm-6 row">
                  <div className="col-sm-12">
                    {/* TODO: Delete this if its not going to be used */}
                    {/* <div className='sciLabelWrapper'>
                      <Link to='/dashboard/printReport' target='_blank'>
                        <div className="print-bn" onClick={this.setPrintReportParams}>{embeddedInfoResults.displayText}</div>
                      </Link>
                    </div> */}

                    <div className='sciLabelWrapper'>
                      <div className="print-bn" onClick={this.createScorecardsPdf}>Print</div>
                    </div>
                  </div>
                </div>
              : null
            }
          </div>
        </div>
        <div className="sciBody">
          {submissionValue && <ScoreCard containerRef={this.scoreCardRef} savedFormId={submissionValue} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    financialsEmbeddedInfoResults: state.financials.embeddedInfoResults,
    financialsFetchingAccountsList: state.financials.fetchingAccountsList,
    currentRoleId: state.login.profile.RoleID,
    currentUserId: state.login.userId,
    financials: state.financials,
    submissionDates: state.financials.submitionDates,
    isSubDatesEmpty: state.financials.isSubDatesEmpty,
    hcId: state.SCProfile.hcId,
    scId: state.SCProfile.headerDetails.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    financialActions: bindActionCreators(financialActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreCards);
