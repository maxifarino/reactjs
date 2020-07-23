import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as actions from '../../actions';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import Utils from '../../../../lib/utils';
import * as regex from '../../../../lib/regex';

const stateAbrev = new Set(['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'])
const provAbrev  = new Set(['AB','BC','MB','NB','NL','NS','ON','PE','QC','SK','NT','YT','NU'])

const checkIfSubsectorMisMatch = (countryID, Subsector) => {
  let outcome = false

  if (countryID && Subsector) {
    const isUSwithProvince  = Number(countryID) == 1  && !stateAbrev.has(Subsector)
    const isCanadaWithState = Number(countryID) == 34 && !provAbrev.has(Subsector)
          outcome           = isUSwithProvince || isCanadaWithState
  }

  // console.log('countryID = ', countryID)
  // console.log('Subsector = ', Subsector)
  // console.log('outcome = ', outcome)
  return outcome
}

const validate = (values, props) => {

  // console.log('validate values = ', values)

  const {
    requiredValidation,
    wrongEmailFormat,
    wrongPhoneFormat
  } = props.local.strings.scProfile.ChangeLocationsModal.modal;

  const misMatchedSubsector = checkIfSubsectorMisMatch(values.CountryID, values.State)

  const errors = {};
  if(!values.Address) {
    errors.Address = requiredValidation;
  }
  if(!values.City) {
    errors.City = requiredValidation;
  }
  if(((values.CountryID == 1 || values.CountryID == 34) && (!values.State || values.State == 'N/A')) || misMatchedSubsector ) {
    errors.State = requiredValidation;
  }
  if(!values.ZipCode) {
    errors.ZipCode = requiredValidation;
  }
  if(!values.CountryID) {
    errors.CountryID = requiredValidation;
  }
  if(values.ContactEmail && !values.ContactEmail.match(regex.EMAIL)) {
    errors.ContactEmail = wrongEmailFormat;
  }
  if (values.Phone && !regex.PHONE.test(values.Phone)) {
    errors.Phone = wrongPhoneFormat;
  }
  if (values.Fax && !regex.PHONE.test(values.Fax)) {
    errors.Fax = wrongPhoneFormat;
  }

  // console.log('errors = ', errors)

  return errors;
};

class LocationForm extends React.Component {
  constructor(props) {
    super(props);

    const { states, provAndTerr } = props
    const {
      labelState,
      statesPlaceHolder,
      labelProvTerr,
      provTerrPlaceHolder
    } = this.props.local.strings.scProfile.ChangeLocationsModal.modal;

    const statesList = Utils.getOptionsList(statesPlaceHolder, states, 'Name', 'ShortName', 'Name');
    const provAndTerrList = Utils.getOptionsList(provTerrPlaceHolder, provAndTerr, 'Name', 'ShortName', 'Name');

    const { location } = this.props;
    let cId = 1 // US CountryID

    if (location) {

      const misMatchedSubsector = checkIfSubsectorMisMatch(location.CountryID, location.State)

      props.dispatch(change('LocationForm', 'Address', location.Address ||""));
      props.dispatch(change('LocationForm', 'City', location.City ||""));
      props.dispatch(change('LocationForm', 'State', location.State && !misMatchedSubsector ? location.State : "" ));
      props.dispatch(change('LocationForm', 'ZipCode', location.ZipCode != 'null' ? location.ZipCode : ""));
      props.dispatch(change('LocationForm', 'CountryID', location.CountryID ||""));
      props.dispatch(change('LocationForm', 'Comments', location.Comments != 'null' ? location.Comments : ""));
      props.dispatch(change('LocationForm', 'Active', location.Active ? true : false));
      props.dispatch(change('LocationForm', 'Primary', location.PrimaryLocation ? true : false));
      props.dispatch(change('LocationForm', 'Phone', location.Phone != 'null' ? location.Phone : ""));
      props.dispatch(change('LocationForm', 'Fax', location.Fax != 'null' ? location.Fax : ""));
      props.dispatch(change('LocationForm', 'ContactName', location.ContactName != 'null' ? location.ContactName : ""));
      props.dispatch(change('LocationForm', 'ContactEmail', location.ContactEmail != 'null' ? location.ContactEmail : ""));

      cId = Number(location.CountryID)  
    }

    this.state = {
      selectedCountryID: cId,
      selectedSubsector: location && location.State ? location.State : null,
      subSectorList: cId == 1 ? statesList : (cId == 34 ? provAndTerrList : []),
      subSectorLabel: cId == 1 ? labelState : (cId == 34 ? labelProvTerr : ''),
      displaySubSector: cId == 1 || cId == 34 ? true : false
    }

    this.onSelectCountry = this.onSelectCountry.bind(this)
    this.onSelectSubsector = this.onSelectSubsector.bind(this)
    this.onCheckPrimary = this.onCheckPrimary.bind(this)

  }

  onCheckPrimary(input) {
    // console.log('input primary = ', input)
    if (input) {
      this.props.dispatch(change('LocationForm', 'Active', true))
    }
  }

  onSelectSubsector(selectedSubsector) {
    this.setState({
      selectedSubsector
    })
  }

  onSelectCountry(selectedCountryID) {
    const { states, provAndTerr } = this.props
    const {
      labelState,
      statesPlaceHolder,
      labelProvTerr,
      provTerrPlaceHolder
    }                           = this.props.local.strings.scProfile.ChangeLocationsModal.modal;
    const statesList            = Utils.getOptionsList(
                                    statesPlaceHolder, 
                                    states, 
                                    'Name', 
                                    'ShortName', 
                                    'Name'
                                  );
    const provAndTerrList       = Utils.getOptionsList(
                                    provTerrPlaceHolder, 
                                    provAndTerr, 
                                    'Name', 
                                    'ShortName', 
                                    'Name'
                                  );
    const cId                   = Number(selectedCountryID)
    const { selectedSubsector } = this.state 
    const misMatchedSubsector   = checkIfSubsectorMisMatch(cId, selectedSubsector)

    if (misMatchedSubsector) {
      this.props.dispatch(change('LocationForm', 'State', "" ));
    }

    this.setState({
      selectedCountryID: cId,
      subSectorList: cId == 1 ? statesList : (cId == 34 ? provAndTerrList : []),
      subSectorLabel: cId == 1 ? labelState : (cId == 34 ? labelProvTerr : ''),
      displaySubSector: cId == 1 || cId == 34 ? true : false
    })
    
  }

  render() {
    const {handleSubmit, dismiss} = this.props;

    const {
      labelAddress,
      labelCity,
      labelZipCode,
      labelCountry,
      labelComments,
      labelActive,
      labelPrimary,
      labelPhone,
      labelFax,
      labelContactName,
      labelContactEmail,
      buttonSave,
      buttonDelete,
      buttonCancel,
      emailPlaceholder,
      countriesPlaceHolder
    } = this.props.local.strings.scProfile.ChangeLocationsModal.modal;

    const {
      countries
    } = this.props;

    const { 
      subSectorList, 
      subSectorLabel,
      displaySubSector
    } = this.state

    const countriesList = Utils.getOptionsList(countriesPlaceHolder, countries, 'name', 'id', 'name');

    const twoPerColLabel = 4
    const twoPerColField = 8 
    const onePerColLabel = 2
    const onePerColField = 10

    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form noteForm">
        <div className="container-fluid filter-fields">
          <div className="row">

            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label className={`location col-sm-${onePerColLabel} no-padd`} htmlFor="Address">
                  {labelAddress}:
                </label>
                <Field
                  className={`floatRight col-sm-${onePerColField} no-padd`}
                  name="Address"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>

          </div>
          <div className="row">

            <div className="col-md-6 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label className={`location col-sm-${twoPerColLabel} no-padd`} htmlFor="City">
                  {labelCity}:
                </label>
                <Field
                  className={`floatRight col-sm-${twoPerColField} no-padd`}
                  name="City"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-left">
                <label className={`location col-sm-${twoPerColLabel} no-padd`} htmlFor="CountryID">
                    {labelCountry}:
                </label>
                <div className={`select-wrapper floatRight col-sm-${twoPerColField} no-padd`}>
                  <Field
                    className='no-padd'
                    name="CountryID"
                    callback={(input) => { this.onSelectCountry(input) }}
                    component={renderSelect}
                    options={countriesList}
                  />
                </div>
              </div>
            </div>

          </div>
          <div className="row">

            <div className="col-md-6 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label className={`location col-sm-${twoPerColLabel} no-padd`} htmlFor="ZipCode">
                  {labelZipCode}:
                </label>
                <Field
                  className={`floatRight col-sm-${twoPerColField} no-padd`}
                  name="ZipCode"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12 no-padd">
              {
                displaySubSector
                  ? <div className="admin-form-field-wrapper pad-left">
                      <label className={`location col-sm-${twoPerColLabel} no-padd`} htmlFor="State">
                        {subSectorLabel}:
                      </label>
                      <div className={`select-wrapper floatRight col-sm-${twoPerColField} no-padd`}>
                        <Field
                          className='no-padd'
                          name="State"
                          component={renderSelect}
                          options={subSectorList}
                        />
                      </div>
                    </div>
                  : null
              }
            </div>

          </div>
          <div className="row">

            <div className="col-md-6 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label className={`location col-sm-${twoPerColLabel} no-padd`} htmlFor="Phone">
                  {labelPhone}:
                </label>
                <Field
                  className={`floatRight col-sm-${twoPerColField} no-padd`}
                  name="Phone"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper pad-left">
                <label className={`location col-sm-${twoPerColLabel} no-padd`} htmlFor="Fax">
                  {labelFax}:
                </label>
                <Field
                  className={`floatRight col-sm-${twoPerColField} no-padd`}
                  name="Fax"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>

          </div>
          <div className="row">

            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label className={`location col-sm-${onePerColLabel} no-padd`} htmlFor="ContactName">
                  {labelContactName}:
                </label>
                <Field
                  className={`floatRight col-sm-${onePerColField} no-padd`}
                  name="ContactName"
                  type="text"
                  component={renderField}
                />
              </div>
            </div>

          </div>
          <div className="row">

            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label className={`location col-sm-${onePerColLabel} no-padd`} htmlFor="ContactEmail">
                  {labelContactEmail}:
                </label>
                <Field
                  className={`floatRight col-sm-${onePerColField} no-padd`}
                  name="ContactEmail"
                  placeholder={emailPlaceholder}
                  type="text"
                  component={renderField}
                />
              </div>
            </div>

          </div>
          <div className="row">

          <div className="col-md-2 col-sm-0 no-padd"></div>

            <div className="col-md-5 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <Field
                  className='locationCheckBox col-sm-1'
                  name="Primary"
                  type="checkbox"
                  callback={(input) => { this.onCheckPrimary(input) }}
                  component={renderField}
                />
                <label className="add-file-label custLabel col-sm-11" htmlFor="Primary">
                  {labelPrimary}
                </label>
              </div>
            </div>
            <div className="col-md-5 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <Field
                  className='locationCheckBox col-sm-1'
                  name="Active"
                  type="checkbox"
                  component={renderField}
                />
                <label className="add-file-label custLabel col-sm-11" htmlFor="Active">
                  {labelActive}
                </label>
              </div>
            </div>

          </div>
          <div className="row">

            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <label className={`location col-sm-${onePerColLabel} no-padd`} htmlFor="Comments">
                  {labelComments}:
                </label>
                <Field
                  className={`floatRight col-sm-${onePerColField} no-padd`}
                  name="Comments"
                  type="textarea"
                  component={renderField}
                />
              </div>
            </div>

          </div>

        </div>

        

        <div className="noteEditorButtons">
          <a className="bg-sky-blue-gradient bn" onClick={dismiss}>{buttonCancel}</a>
          <button className="bg-sky-blue-gradient bn" type="submit">{buttonSave}</button>
          {   this.props.isPQuser
              ? <a className="bg-sky-blue-gradient redCancel marg bn" onClick={ () => {this.props.onDelete(this.props.location.Id)} }>{buttonDelete}</a>
              : null
          }
        </div>

      </form>
    );
  }
}

LocationForm = reduxForm({
  form: 'LocationForm',
  validate
})(LocationForm);

const mapStateToProps = (state) => ({
    scProfile: state.SCProfile,
    local: state.localization
  });

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(LocationForm);
