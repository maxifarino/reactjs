import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../lib/utils';
import renderField from '../../customInputs/renderField';
import renderSelect from '../../customInputs/renderSelect';
import FilterActions from '../../common/filterActions/FilterActions'

let FilterSC = props => {

  let {
    title,
    keywordsLabel,
    keywordsPlaceholder,
    HCLabel,
    HCPlaceholder,
    SCStatusLabel,
    SCStatusPlaceholder,
    tradeLabel,
    tradePlaceholder,
    tierRatingLabel,
    tierRatingPlaceholder,
    stateLabel,
    statePlaceholder,
    maxSingleLabel,
    maxSinglePlaceholder,
    maxAggregateLabel,
    maxAggregatePlaceholder,
  } = props.local.strings.subcontractors.filter;

  // hc options
  const hcOptionsList = Utils.getOptionsList(HCPlaceholder, props.hc.list, 'name', 'id', 'name');
  // status options
  const statusOptionsList = Utils.getMultiVariateOptionsList(SCStatusPlaceholder, props.sc.subcontratorStatusWithCounts, 'Status', 'SubCount', 'Id');

  // const statusOptionsList = Utils.getOptionsList(SCStatusPlaceholder, props.sc.subcontratorStatus, 'Status', 'Id', 'Id');
  // trade options
  const tradeOptionsList = Utils.getOptionsList(tradePlaceholder, props.sc.tradesForFilterList, 'description', 'id', 'orderIndex');
  // tier rates
  const tierRatesOptionsList = Utils.getOptionsList(tierRatingPlaceholder, props.sc.subcontratorTierRates, 'Name', 'Id', 'Id');
  // state options
  const statesOptionsList = Utils.getOptionsList(statePlaceholder, props.register.geoStates, 'Name', 'ShortName', 'Name');

  const {handleSubmit} = props;
  return (
    <form
      onSubmit={handleSubmit}
      className="list-view-filter-form filter-sc-list" >
      <h2 className="list-view-filter-title">{title}</h2>
      <div className="container-fluid filter-fields">
        <div className="row sc-filter-row">

          <div className="col-md-3 col-sm-12 no-padd">
            <div className="admin-form-field-wrapper keyword-field">
              <label htmlFor="keywords">{keywordsLabel}: </label>
              <Field
                name="keywords"
                type="text"
                placeholder={`--${keywordsPlaceholder}--`}
                component={renderField}
                className="tags-input"
              ></Field>
            </div>
          </div>

          {
            !props.fromHCtab && (
              <div className="col-md-3 col-sm-12 no-padd" >
                <div className="admin-form-field-wrapper ass-hc-field">
                  <label htmlFor="associatedHCs">{HCLabel}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="associatedHCs"
                      component={renderSelect}
                      options={hcOptionsList} />
                  </div>
                </div>
              </div>
            )
          }

          <div className="col-md-3 col-sm-12 no-padd" >
            <div className="admin-form-field-wrapper status-field">
              <label htmlFor="status">{SCStatusLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="status"
                  component={renderSelect}
                  options={statusOptionsList} />
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 no-padd" >
            <div className="admin-form-field-wrapper trade-field">
              <label htmlFor="trade">{tradeLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="trade"
                  component={renderSelect}
                  options={tradeOptionsList} />
              </div>
            </div>
          </div>
        </div>

        <div className="row sc-filter-row">

          <div className="col-md-3 col-sm-12 no-padd" >
            <div className="admin-form-field-wrapper tier-rating-field">
              <label htmlFor="tierRating">{tierRatingLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="tierRating"
                  component={renderSelect}
                  options={tierRatesOptionsList} />
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 no-padd" >
            <div className="admin-form-field-wrapper state-field">
              <label htmlFor="state">{stateLabel}: </label>
              <div className="select-wrapper">
                <Field
                  name="state"
                  component={renderSelect}
                  options={statesOptionsList} />
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 no-padd" style={{display:'none'}}>
            <div className="admin-form-field-wrapper max-single-field">
              <label htmlFor="maxSingle">{maxSingleLabel}: </label>
              <Field
                name="maxSingle"
                type="text"
                placeholder={`--${maxSinglePlaceholder}--`}
                component={renderField}
                className="tags-input"
              ></Field>
            </div>
          </div>

          <div className="col-md-3 col-sm-12 no-padd" style={{display:'none'}}>
            <div className="admin-form-field-wrapper max-aggregate-field">
              <label htmlFor="maxAggregate">{maxAggregateLabel}: </label>
              <Field
                name="maxAggregate"
                type="text"
                placeholder={`--${maxAggregatePlaceholder}--`}
                component={renderField}
                className="tags-input"
              ></Field>
            </div>
          </div>

          <FilterActions
            formName={props.form}
            dispatch={props.dispatch} />

        </div>
      </div>
    </form>
  );
}

FilterSC = reduxForm({
  form: 'FilterSC',
})(FilterSC);

const mapStateToProps = (state, ownProps) => {
  return {
    register: state.register,
    hc: state.hc,
    sc: state.sc,
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterSC);
