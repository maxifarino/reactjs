import React from 'react';
import { Field, reduxForm} from 'redux-form';
import { connect } from 'react-redux';

import Utils from '../../../../lib/utils';
import renderField from '../../../customInputs/renderField';
import renderSelect from '../../../customInputs/renderSelect';
import FilterActions from '../../../common/filterActions/FilterActions'

class FilterLocations extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      searchByPrimary: false,
      searchByActive: false,
      isPrimary: false,
      isActive: false
    }

    this.isChecked = this.isChecked.bind(this)
  }

  isChecked(value, prop) {
    if (this.state[prop] != value) {
      this.setState({
        [prop]: value
      })
    }
  }  

  render() {
    const {
      title,
      keywordsLabel,
      keywordsPlaceholder,
      filterState,
      searchByPrimary,
      searchByActive,
      filterActive,
      filterPrimary,
      statesPlaceHolder,
      filterProvTerr,
      provTerrPlaceHolder
    } = this.props.local.strings.scProfile.locationFilter;
  
    const { handleSubmit, states, provAndTerr } = this.props;
    const statesList      = Utils.getOptionsList(statesPlaceHolder, states, 'Name', 'ShortName', 'Name');
    const provAndTerrList = Utils.getOptionsList(provTerrPlaceHolder, provAndTerr, 'Name', 'ShortName', 'Name');
  
    statesList.push({label: 'N/A', value: null})
  
    return (
      <form onSubmit={handleSubmit} className="list-view-filter-form" style={{backgroundColor: 'white'}}>
        <h2 className="list-view-filter-title">{title}</h2>
        <div className="container-fluid filter-fields">
          <div className="row">
            <div className="col-md-4 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field no-padd">
                <label htmlFor="keywords">{keywordsLabel}:</label>
                <Field
                  name="keywords"
                  type="text"
                  placeholder={`--${keywordsPlaceholder}--`}
                  component={renderField}
                  className="tags-input"/>
              </div>
            </div>
            <div className="col-md-2 col-sm-6 no-padd">
              <div className="admin-form-field-wrapper keywords-field no-padd">
                <label htmlFor="State">{filterState}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="State"
                      component={renderSelect}
                      options={statesList} />
                  </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-6 no-padd">
              <div className="admin-form-field-wrapper keywords-field no-padd">
                <label htmlFor="State">{filterProvTerr}: </label>
                  <div className="select-wrapper">
                    <Field
                      name="State"
                      component={renderSelect}
                      options={provAndTerrList} />
                  </div>
              </div>
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field row">
                <div className="col-sm-12 no-padd">
                  <div className="col-sm-10 labelDiv">
                    <label htmlFor="Primary">{searchByPrimary}? </label>
                  </div>
                  <Field
                    className='metaCheckbox locationCheckBox col-sm-2 no-padd'
                    name="searchByPrimary"
                    type="checkbox"
                    callback={(boolean) => { this.isChecked(boolean, 'searchByPrimary') }}
                    component={renderField}
                  />
                </div>
                  {
                    this.state.searchByPrimary
                      ? <div className="col-sm-12 no-padd">
                          <div className="col-sm-6 labelDiv">
                            <label htmlFor="Primary">{filterPrimary}? </label>
                          </div>
                          <div className="YesNoWrapper col-sm-4 no-padd no-margin">
                            {
                              this.state.isPrimary
                                ? <p className="YesNo">yes</p>
                                : <p className="YesNo">no</p>
                            }
                          </div>
                          <Field
                            className='metaCheckbox locationCheckBox col-sm-2 no-padd'
                            name="Primary"
                            type="checkbox"
                            callback={(boolean) => { this.isChecked(boolean, 'isPrimary') }}
                            component={renderField} 
                          />
                        </div>
                      : null
                  }
              </div>
            </div>
            <div className="col-md-2 col-sm-12 no-padd">
              <div className="admin-form-field-wrapper keywords-field row">
                <div className="col-sm-12 no-padd">
                  <div className="col-sm-10 labelDiv">
                    <label htmlFor="Primary">{searchByActive}? </label>
                  </div>
                  <Field
                    className='metaCheckbox locationCheckBox col-sm-2 no-padd'
                    name="searchByActive"
                    type="checkbox"
                    callback={(boolean) => { this.isChecked(boolean, 'searchByActive') }}
                    component={renderField}
                  />
                </div>
                {
                  this.state.searchByActive
                    ? <div className="col-sm-12 no-padd">
                        <div className="col-sm-6 labelDiv">
                          <label htmlFor="Primary">{filterActive}? </label>
                        </div>
                        <div className="YesNoWrapper col-sm-4 no-padd no-margin">
                            {
                              this.state.isActive
                                ? <p className="YesNo">yes</p>
                                : <p className="YesNo">no</p>
                            }
                          </div>
                        <Field
                          className='metaCheckbox locationCheckBox col-sm-2 no-padd'
                          name="Active"
                          type="checkbox"
                          callback={(boolean) => { this.isChecked(boolean, 'isActive') }}
                          component={renderField} 
                        />
                      </div>
                    : null
                }
                
              </div>
            </div>
              <FilterActions
                formName={this.props.form}
                dispatch={this.props.dispatch} />
          </div>
        </div>
      </form>
    );
  }
}

FilterLocations = reduxForm({
  form: 'FilterLocations'
})(FilterLocations);

const mapStateToProps = (state, ownProps) => {
  return {
    scProfile: state.SCProfile,
    local: state.localization
  }
};

export default connect(mapStateToProps)(FilterLocations)
