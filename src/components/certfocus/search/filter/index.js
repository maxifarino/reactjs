import React, { Component } from 'react';
import { Field, reduxForm, change, formValueSelector, reset } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import renderTypeAhead from '../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../customInputs/renderRemovable';

import * as commonActions from '../../../common/actions';
import * as projectActions from '../../projects/actions';
import * as insuredActions from '../../insureds/actions';

const buttonStyle = {
  marginLeft: '10px'
};

class FilterForms extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    const { location, dispatch } = this.props;
    const submitter = this.props.handleSubmit(this.props.onSubmit);

    this.props.commonActions.fetchComplianceStatus();

    if (location.state) {
      await dispatch(change('FilterForms', 'keyword', location.state.keyword || ''));
      // await dispatch(change('FilterForms', 'holder', location.state.holder ? { value: location.state.holder.value, label: location.state.holder.label } : ''));

      submitter();
    }
  }

  handleHolderSearch = (filterTerm) => {
    this.props.commonActions.fetchTypeAhead({ nameTerm: filterTerm });
  }

  handleProjectSearch = (filterTerm) => {
    //const { insuredId } = this.props;
    const query = {
      projectName: filterTerm,
      //insuredId: insuredId,
    };

    this.props.projectActions.fetchTypeAhead(query);
  }

  handleInsuredSearch = (filterTerm) => {
    this.props.insuredActions.fetchTypeAhead(filterTerm);
  }


  handleClick(event) {
    this.props.dispatch(reset('FilterForms'));
  }

  render() {
    let {
      keywordLabel,
      complianceLabel,
      holderLabel,
      tierRatingLabel,
      projectLabel,
      coverageLabel,
      insuredLabel,
      coverageStatusLabel,
      stateLabel,
      expirationDatesLabel,
      customerUniqueIdLabel,
      insurerLabel,
      includeArchivedLabel,
    } = this.props.local.strings.search.filter;

    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError,
    } = this.props.common;

    const { 
      handleSubmit,
      holderIdCurrentValue,
      projectIdCurrentValue,
      insuredIdCurrentValue,
      holdersProjects,
      insureds,
    } = this.props;

    const holderOptions = Utils.getOptionsList(null, typeAheadResults, 'name', 'id', 'name');
    const projectOptions = Utils.getOptionsList(null, holdersProjects.typeAheadResults, 'name', 'id', 'name');
    const insuredOptions = Utils.getOptionsList(null, insureds.typeAheadResults, 'InsuredName', 'Id', 'InsuredName');

    // Populate filter selects
    const tierRatings = [
      { Id: 1, Name: 'Low Risk' },
      { Id: 2, Name: 'Moderate Risk' },
      { Id: 3, Name: 'High Risk' },
      { Id: 4, Name: 'No Eligible' },
      { Id: 5, Name: 'No Rated' }
    ];
    const coverageStatus = [
      { Id: 0, Name: 'Declined' },
      { Id: 1, Name: 'Accepted' }
    ];

    const complianceOptions = Utils.getOptionsList('-- Compliance --', this.props.common.complianceStatus, 'StatusName', 'ProjectInsuredComplianceStatusID', 'StatusName');
    const tierRatingsOptions = Utils.getOptionsList('-- Tier Ratings --', tierRatings, 'Name', 'Id', 'Name');
    const coverageTypes = Utils.getOptionsList('-- Coverage Types --', this.props.search.coverageTypes.list, 'Name', 'Code', 'Name');
    const coverageStatusOptions = Utils.getOptionsList('-- Coverage Status --', coverageStatus, 'Name', 'Id', 'Name');
    // const statesOptions = Utils.getOptionsList('-- States --', this.props.search.states.list, 'Name', 'ShortName', 'Name');

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form" style={{ marginTop: "0px" }}>
        <h2 className="list-view-filter-title">Search Filters</h2>
        <div className="container-fluid filter-fields">
          <div className="row mt-3">
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="keyword">{keywordLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <Field
                name="keyword"
                type="text"
                placeholder={`-- Keyword --`}
                component={renderField}
                className="" />
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="compliance">{complianceLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="select-wrapper">
                <Field
                  name="compliance"
                  component={renderSelect}
                  options={complianceOptions} />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="holder">{holderLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              {holderIdCurrentValue ? (
                <div className="search-removable">
                  <Field
                    name="holder"
                    valueText={holderIdCurrentValue ? holderIdCurrentValue.label : ''}
                    component={renderRemovable}
                  />
                </div>
              ) : (
                <div className="search-typeAhead">
                  <Field
                    name="holder"
                    placeholder={`-- Holder --`}
                    fetching={typeAheadFetching}
                    results={holderOptions}
                    handleSearch={this.handleHolderSearch}
                    fetchError={typeAheadError}
                    component={renderTypeAhead}
                  />
                </div>
              )}
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="tierRating">{tierRatingLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="select-wrapper">
                <Field
                  name="tierRating"
                  component={renderSelect}
                  options={tierRatingsOptions} />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="project">{projectLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              {projectIdCurrentValue ? (
                <div className="search-removable">
                  <Field
                    name="project"
                    valueText={projectIdCurrentValue ? projectIdCurrentValue.label : ''}
                    component={renderRemovable}
                  />
                </div>
              ) : (
                <div className="search-typeAhead">
                  <Field
                    name="project"
                    placeholder={`-- Project --`}
                    fetching={typeAheadFetching}
                    results={projectOptions}
                    handleSearch={this.handleProjectSearch}
                    fetchError={typeAheadError}
                    component={renderTypeAhead}
                  />
                </div>
              )}
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="coverageType">{coverageLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="select-wrapper">
                <Field
                  name="coverageType"
                  component={renderSelect}
                  options={coverageTypes} />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="insured">{insuredLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              {insuredIdCurrentValue ? (
                <div className="search-removable">
                  <Field
                    name="insured"
                    valueText={insuredIdCurrentValue ? insuredIdCurrentValue.label : ''}
                    component={renderRemovable}
                  />
                </div>
              ) : (
                <div className="search-typeAhead">
                  <Field
                    name="insured"
                    placeholder={`-- Insured --`}
                    fetching={typeAheadFetching}
                    results={insuredOptions}
                    handleSearch={this.handleInsuredSearch}
                    fetchError={typeAheadError}
                    component={renderTypeAhead}
                  />
                </div>
              )}
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="coverageStatus">{coverageStatusLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="select-wrapper">
                <Field
                  name="coverageStatus"
                  component={renderSelect}
                  options={coverageStatusOptions} />
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="state">{stateLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <Field
                name="state"
                type="text"
                placeholder={`-- ${stateLabel} --`}
                component={renderField}
                className="" />
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="state">{expirationDatesLabel}:</label>
            </div>
            <div className="col-md-2 col-sm-12" style={{ display: "flex" }}>
              <Field
                name="expirationStartDate"
                type="date"
                placeholder={`-- Start Date --`}
                component={renderField}
                className="" />

              <Field
                name="expirationEndDate"
                type="date"
                placeholder={`-- End Date --`}
                component={renderField}
                className="" />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="customerUniqueId">{customerUniqueIdLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <Field
                name="customerUniqueId"
                type="text"
                placeholder={`-- Customer Unique Id --`}
                component={renderField}
                className="" />
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="insurer">{insurerLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <Field
                name="insurer"
                type="text"
                placeholder={`-- Insurer --`}
                component={renderField}
                className="" />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-2 col-sm-12 no-padd">
              <label htmlFor="includeArchived">{includeArchivedLabel}:</label>
            </div>
            <div className="col-md-4 col-sm-12">
              <Field
                type="checkbox"
                name="includeArchived"
                component={renderField}
                className="archivedCheckbox"
              />
            </div>
            <div className="col-md-2 col-sm-12"></div>
            <div className="col-md-4 col-sm-12">
              <div className="list-item">
                <button className="wiz-continue-btn bg-sky-blue-gradient bn" type="submit">Search</button>
                <button style={buttonStyle} className="wiz-continue-btn bg-sky-blue-gradient bn" type="submit" onClick={this.handleClick}>Reset</button>
              </div>
            </div>
          </div>

        </div>
      </form>
    );
  }
}

FilterForms = reduxForm({
  form: 'FilterForms',
})(FilterForms);

FilterForms = withRouter(FilterForms);

const mapStateToProps = (state) => {
  return {
    forms: state.forms,
    register: state.register,
    local: state.localization,
    search: state.search,
    common: state.common,
    holdersProjects: state.holdersProjects,
    insureds: state.insureds,
    holderIdCurrentValue: formValueSelector('FilterForms')(state, 'holder'),
    projectIdCurrentValue: formValueSelector('FilterForms')(state, 'project'),
    insuredIdCurrentValue: formValueSelector('FilterForms')(state, 'insured'),    
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    commonActions: bindActionCreators(commonActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch),
    insuredActions: bindActionCreators(insuredActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterForms);
