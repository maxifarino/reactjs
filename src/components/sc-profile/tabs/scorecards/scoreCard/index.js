import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-bootstrap';

import Utils from '../../../../../lib/utils';
import * as financialActions from '../../financialInfo/actions';

class ScoreCard extends React.Component {
  constructor(props) {
    super(props);

    //this.clickOnColumnHeader = this.clickOnColumnHeader.bind(this);
    // let savedFormId = ''
    //     savedFormId = props.savedFormId
    // props.financialActions.fetchScoreCardsConcepts(savedFormId, "ScoreCard Constructor");

    // let fetchingScoreCardsConcepts = props.financials.fetchingScoreCardsConcepts ? props.financials.fetchingScoreCardsConcepts : ''
    // let scoreCardsConcepts         = props.financials.scoreCardsConcepts         ? props.financials.scoreCardsConcepts         : ''
    // let subcontractorDataConcepts  = props.financials.subcontractorDataConcepts  ? props.financials.subcontractorDataConcepts  : ''
    // let scorecardMainParameters    = props.financials.scorecardMainParameters    ? props.financials.scorecardMainParameters    : ''
    // let averageConcepts            = props.financials.averageConcepts            ? props.financials.averageConcepts            : ''
    // let commentary                 = props.financials.commentary                 ? props.financials.commentary                 : ''
    // let emrAccounts                = props.financials.emrAccounts                ? props.financials.emrAccounts                : ''
    // let adjWorkingCapital          = props.financials.adjWorkingCapital          ? props.financials.adjWorkingCapital          : ''
    // let nevadaSingleLimit          = props.financials.nevadaSingleLimit          ? props.financials.nevadaSingleLimit          : ''

    this.state = {
      subName: '',
      hasScoreCardBeenUpdated: false,
      filter: {
        pageNumber: 1
      },
      order: {
        name: 'asc',
        value: 'asc'
      },
      tableOrderActive: 'name',
      workingCapital: '$100',
      savedFormId: '',
      fetchingScoreCardsConcepts: '',
      scoreCardsConcepts: '',
      subcontractorDataConcepts: '',
      scorecardMainParameters: '',
      averageConcepts: '',
      commentary: '',
      emrAccounts: '',
      adjWorkingCapital: '',
      nevadaSingleLimit: '',
      fetchId: '',
      scorecardAccountDisplayTypeId: 1,
      scorecardHiddenFields: [],
      isCovid19Form: false,
    }
  };

  // THIS IS UNNECESSARY FOR NOW, SINCE "fetchScoreCardsConcepts" is initialized in the constructor
  // componentWillMount() {
  //   this.props.financialActions.fetchScoreCardsConcepts(this.props.savedFormId, "ScoreCard CWM");
  // }

  componentWillReceiveProps(nextProps) {

    const {
      adjWorkingCapital,
      hasScoreCardBeenUpdated
    } = this.state;

    const newSavedFormId = nextProps.savedFormId;
    const newFSCC = nextProps.financials.fetchingScoreCardsConcepts;
    const newSCC = nextProps.financials.scoreCardsConcepts;
    const newSDC = nextProps.financials.subcontractorDataConcepts;
    const newSDCsubName = newSDC && newSDC.subcontractorName ? newSDC.subcontractorName : '';
    const newSMP = nextProps.financials.scorecardMainParameters;
    const newAC = nextProps.financials.averageConcepts;
    const newC = nextProps.financials.commentary;
    const newEmrA = nextProps.financials.emrAccounts;
    const newAWC = nextProps.financials.adjWorkingCapital;
    const newNSL = nextProps.financials.nevadaSingleLimit;
    const isEmpty = nextProps.financials.isScoreCardEmpty;
    const scorecardAccountDisplayTypeId = nextProps.financials.scorecardAccountDisplayTypeId;
    const scoreCardsdiscreteAccounts = nextProps.financials.scoreCardsdiscreteAccounts.map(element => ({
      ...element,
      valueSelected: element.valueSeleted,
    }));
    const scorecardHiddenFields = nextProps.financials.scorecardHiddenFields;
    const isCovid19Form = nextProps.financials.isCovid19Form;

    if (newFSCC == false) {
      this.setState({
        fetchingScoreCardsConcepts: newFSCC,
      });
    }

    const shouldUpdateState = (!newSDCsubName && (this.props.savedFormId != newSavedFormId) || !hasScoreCardBeenUpdated);

    // console.log('(1) newSDCsubName = ', newSDCsubName)
    // console.log('(2) this.props.savedFormId = ', this.props.savedFormId)
    // console.log('(3) newSavedFormId = ', newSavedFormId)
    // console.log('(4) hasScoreCardBeenUpdated = ', hasScoreCardBeenUpdated)
    // console.log('(5) shouldUpdateState = ', shouldUpdateState)
    // console.log('\n')

    // if (newSCC && newSCC[6] && newSCC[6].value) {
    // console.log('Net Worth to Backlog = ', newSCC[6].value)
    // }

    this.setState({
      averageConcepts: isEmpty ? [] : newAC,
      commentary: isEmpty ? '' : newC,
      emrAccounts: isEmpty ? [] : newEmrA,
      nevadaSingleLimit: isEmpty ? '' : newNSL,
      scoreCardsConcepts: isEmpty ? [] : newSCC,
      subcontractorDataConcepts: isEmpty ? [] : newSDC,
      scorecardMainParameters: isEmpty ? [] : newSMP,
      hasScoreCardBeenUpdated: true,
      scoreCardsdiscreteAccounts: scoreCardsdiscreteAccounts,
      scorecardAccountDisplayTypeId: scorecardAccountDisplayTypeId,
      scorecardHiddenFields: scorecardHiddenFields,
      isCovid19Form: isCovid19Form,
    }, () => {
      // console.log('state was called')
    });

    if (shouldUpdateState || this.props.savedFormId != newSavedFormId) {
      this.props.financialActions.fetchScoreCardsConcepts(newSavedFormId)
    }

    if (newAWC && newAWC != adjWorkingCapital) {
      this.setState({
        adjWorkingCapital: isEmpty ? 0 : newAWC
      });
    }

  }

  getLimitValue(value) {

    let unFormattedValue = 0

    if (value && typeof value === 'number') {
      let tempValue = Math.round(value * 1) / 1
      unFormattedValue = tempValue.toString()
    }

    return `$ ${Utils.formatNumberWithCommas(unFormattedValue)}`;
  }

  getNevadaLimitValue(value) {
    if (typeof value === 'number') {
      if (value < 0) {
        return 'unlimited'
      } else {
        return this.getLimitValue(value)
      }
    }
  }

  getLargestContractCompletedValue(index) {
    const {
      averageConcepts
    } = this.state;

    const concept = _.get(averageConcepts, `avgProjectAccounts[${index}]`);

    const value = concept && `$ ${Utils.formatNumberWithCommas(Math.trunc(concept.value))}`;

    return value || null;
  }

  getTotalRevenueEarnedValue(index) {
    const {
      averageConcepts
    } = this.state;

    const concept = _.get(averageConcepts, `avgVolumeAccounts[${index}]`);

    const value = concept && `$ ${Utils.formatNumberWithCommas(Math.trunc(concept.value))}`;

    return value || null;
  }

  getExperienceModificationRateValue(index) {
    const {
      emrAccounts
    } = this.state;

    const concept = _.find(emrAccounts, { 'index': index });

    // const value = concept && `$ ${Utils.formatNumberWithCommas(Math.trunc(concept.value))}`;
    const value = concept && `${concept.value}`;

    return value || null;
  }

  getScorcardConceptValue(scorecardConceptId) {
    const {
      scoreCardsConcepts
    } = this.state;

    const concept = _.find(scoreCardsConcepts, { scorecardConceptId });
    const conceptValue = _.get(concept, 'value');
    const value = (conceptValue && Utils.isValidNumber(conceptValue)) ? Utils.formatNumberWithCommas(conceptValue) : conceptValue;
    const color = concept && concept.color;

    const iconClassName = classnames({
      'concept-flag': true,
      'green': color === 1,
      'yellow': color === 2,
      'red': color === 3
    });

    return value ? (
      <Row className="concept-value">
        <Col md={6}>
          {value}
        </Col>
        <Col md={6}>
          <span className={iconClassName}>&#8226;</span>
        </Col>
      </Row>
    ) : null;
  }

  renderDiscreteAccounts() {
    const {
      scoreCardsdiscreteAccounts,
    } = this.state;

    if (scoreCardsdiscreteAccounts) {
      const chunkedDiscreteAccounts = _.chunk(scoreCardsdiscreteAccounts, 2)

      return chunkedDiscreteAccounts.map((discreteAccounts, index) => {
        return (
          <Row key={index}>
            {discreteAccounts.map((element) => {
              if (element.valueSelected === "0") return null;

              const iconClassName = classnames({
                'concept-flag': true,
                'green': element.color === 1,
                'yellow': element.color === 2,
                'red': element.color === 3
              });

              return (
                <Col md={6} key={element.id}>
                  <Row>
                    <Col md={6}>
                      {element.name}:
                    </Col>
                    <Col md={6}>
                      <Row className="concept-value">
                        <Col md={6}>
                          {element.valueSelected}
                        </Col>
                        <Col md={6}>
                          <span className={iconClassName}>&#8226;</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
        );
      });
    }

    return null;
  }

  render() {
    const {
      fetchingScoreCardsConcepts,
      subcontractorDataConcepts,
      scorecardMainParameters,
      commentary,
      adjWorkingCapital,
      nevadaSingleLimit,
      scorecardAccountDisplayTypeId,
      scorecardHiddenFields,
      isCovid19Form,
    } = this.state;

    const adjustedWorkingCapital = this.getLimitValue(scorecardMainParameters.adjustedWorkingCapital ? scorecardMainParameters.adjustedWorkingCapital : adjWorkingCapital);

    return (
      <div ref={this.props.containerRef}>
        {
          !fetchingScoreCardsConcepts ?
            <div className="scorecard">
              {isCovid19Form && (
                <Row>
                  <Col md={12}>
                    <div className="scorecard-mention">
                      Covid Update
                    </div>
                  </Col>
                </Row>
              )}

              <Row className="header">
                <Col md={8}>
                  {'' || subcontractorDataConcepts.subcontractorName}
                </Col>
                <Col md={4}>
                  Tier: {'' || scorecardMainParameters.tieRating}
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Row>
                    <Col md={3}>
                      Date of Prequalification:
                    </Col>
                    <Col md={9}>
                      {'' || Utils.getFormattedDate(subcontractorDataConcepts.dateOfPrequal, true)}
                    </Col>
                  </Row>
                </Col>
                <Col md={4}>
                  <Row>
                    <Col md={6}>
                      Single Project Limit:
                    </Col>
                    <Col md={6}>
                      {'' || this.getLimitValue(scorecardMainParameters.singleProjectLimit)}
                    </Col>
                  </Row>
                </Col>

              </Row>

              <Row>

                <Col md={8}>
                  <Row>
                    <Col md={3}>
                      Trade:
                    </Col>
                    <Col md={9}>
                      {'' || subcontractorDataConcepts.tradeName}
                    </Col>
                  </Row>
                </Col>

                <Col md={4}>
                  <Row>
                    <Col md={6}>
                      Aggregate Project Limit:
                    </Col>
                    <Col md={6}>
                      {'' || this.getLimitValue(scorecardMainParameters.aggregateProjectExposure)}
                    </Col>
                  </Row>
                </Col>

              </Row>

              {
                nevadaSingleLimit && nevadaSingleLimit.value && nevadaSingleLimit.value !== 0
                  ? <Row>
                    <Col md={8}>
                      <Row>
                        <Col md={3}></Col>
                        <Col md={9}></Col>
                      </Row>
                    </Col>
                    <Col md={4}>
                      <Row>
                        <Col md={6}>
                          Nevada Single Limit:
                        </Col>
                        <Col md={6}>
                          {this.getNevadaLimitValue(nevadaSingleLimit.value)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  : ''
              }

              {[1, 3].includes(scorecardAccountDisplayTypeId) && (
                <Row>
                  <Col md={8}>
                    <Row>
                      <Col md={3}></Col>
                      <Col md={9}></Col>
                    </Row>
                  </Col>

                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Working Capital (Adj.):
                      </Col>
                      <Col md={6}>
                        {'' || adjustedWorkingCapital}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}

              {!scorecardHiddenFields.includes(1) && (
                <div className="commentary">
                  <span className="bold-label">Analyst Commentary: </span>
                  <span className="commentary-text">{commentary}</span>
                </div>
              )}

              <Row>
                {!scorecardHiddenFields.includes(2) && (
                  <Col md={4} className="bold-label">
                    Largest Contract Completed
                  </Col>
                )}
                {!scorecardHiddenFields.includes(3) && (
                  <Col md={4} className="bold-label">
                    Total Revenue Earned
                  </Col>
                )}
                {!scorecardHiddenFields.includes(4) && (
                  <Col md={4} className="bold-label">
                    Experience Modification Rate
                  </Col>
                )}
              </Row>

              <Row>
                {!scorecardHiddenFields.includes(2) && (
                  <Col md={4}>
                    <Row>
                        <Col md={6}>
                          Most Current Year:
                        </Col>
                        <Col md={6} className="concept-value">
                          {'' || this.getLargestContractCompletedValue(0)}
                        </Col>
                    </Row>
                  </Col>
                )}
                {!scorecardHiddenFields.includes(3) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Most Current Year:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getTotalRevenueEarnedValue(0)}
                      </Col>
                    </Row>
                  </Col>
                )}
                {!scorecardHiddenFields.includes(4) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Most Current Year:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getExperienceModificationRateValue(0)}
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>

              <Row>
                {!scorecardHiddenFields.includes(2) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Year 2:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getLargestContractCompletedValue(1)}
                      </Col>
                    </Row>
                  </Col>
                )}
                {!scorecardHiddenFields.includes(3) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Year 2:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getTotalRevenueEarnedValue(1)}
                      </Col>
                    </Row>
                  </Col>
                )}
                {!scorecardHiddenFields.includes(4) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Year:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getExperienceModificationRateValue(1)}
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>

              <Row>
                {!scorecardHiddenFields.includes(2) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Year 3:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getLargestContractCompletedValue(2)}
                      </Col>
                    </Row>
                  </Col>
                )}
                {!scorecardHiddenFields.includes(3) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Year 3:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getTotalRevenueEarnedValue(2)}
                      </Col>
                    </Row>
                  </Col>
                )}
                {!scorecardHiddenFields.includes(4) && (
                  <Col md={4}>
                    <Row>
                      <Col md={6}>
                        Year:
                      </Col>
                      <Col md={6} className="concept-value">
                        {'' || this.getExperienceModificationRateValue(2)}
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>

              {[1, 3].includes(scorecardAccountDisplayTypeId) && (
                <React.Fragment>
                  <div className="measures">
                    <span className="bold-label">Measures</span>
                  </div>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Current Ratio:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(1)}
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          AR Turnover:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(4)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Working Capital to Backlog:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(2)}
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          AP Turnover:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(5)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Number of Days Cash:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(3)}
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Debt to Net Worth:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(6)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Net Worth to backlog:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(7)}
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Legal:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(10)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Profitability:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(8)}
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          References:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(11)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Credit Line:
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(9)}
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Col md={5}>
                          Credit History
                        </Col>
                        <Col md={7}>
                          {'' || this.getScorcardConceptValue(12)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </React.Fragment>
              )}

              {[2, 3].includes(scorecardAccountDisplayTypeId) && (
                <React.Fragment>
                  <div className="measures">
                    <span className="bold-label">Discrete Accounts</span>
                  </div>
                  {this.renderDiscreteAccounts()}
                </React.Fragment>
              )}
            </div>
            :
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
        }
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    scProfile: state.SCProfile,
    financials: state.financials
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    financialActions: bindActionCreators(financialActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreCard);
