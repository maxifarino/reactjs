import React from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash'

import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import fileInput from '../../../../customInputs/fileInput';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import renderRemovable from '../../../../customInputs/renderRemovable';

import Utils from '../../../../../lib/utils';
//import asyncValidate from './asyncValidation';
import validate from './validation';

import * as holdersActions from '../../../holders/actions';
import { createNumberMask } from 'redux-form-input-masks';
import * as departmentsAction from '../../../settings/departments/actions';

const currencyMask = createNumberMask({
  prefix: 'US$ ',
  decimalPlaces: 2,
  locale: 'en-US',
})

class HolderInfoForm extends React.Component {
  constructor(props) {
    super(props);

    const { profile } = this.props;
    if (profile) {
      //console.log(profile);
      let parentObj = null;
      const { parentId, parentName } = profile;
      if (profile.parentId) {
        parentObj = {
          value: parentId,
          label: parentName
        }
      }
      console.log('profile', profile);

      if (profile.department) {
        const queryParams = {
          departmentId: profile.department,
        }
        this.props.departmentsAction.getDepartmentUsers(queryParams)
      } else {
        this.props.departmentsAction.setDepartmentUsers([]);
      }

      props.dispatch(change('HolderInfoForm', 'holderName', profile.name || ""));
      props.dispatch(change('HolderInfoForm', 'parentHolder', parentObj || null));
      props.dispatch(change('HolderInfoForm', 'address1', profile.address1 || ""));
      if (profile.address2 !== "not available") {
        props.dispatch(change('HolderInfoForm', 'address2', profile.address2 || ""));
      }
      props.dispatch(change('HolderInfoForm', 'city', profile.city || ""));
      props.dispatch(change('HolderInfoForm', 'state', profile.state || ""));
      props.dispatch(change('HolderInfoForm', 'postalCode', profile.zipCode || ""));
      props.dispatch(change('HolderInfoForm', 'country', profile.country || ""));
      props.dispatch(change('HolderInfoForm', 'department', profile.department || ""));
      props.dispatch(change('HolderInfoForm', 'intOfficeID', profile.intOfficeID || ""));

      props.dispatch(change('HolderInfoForm', 'contactName', profile.contactName || ""));
      props.dispatch(change('HolderInfoForm', 'contactPhone', profile.phone || ""));
      props.dispatch(change('HolderInfoForm', 'contactEmail', profile.contactEmail || ''));
      props.dispatch(change('HolderInfoForm', 'contactId', profile.contactId || ""));
      props.dispatch(change('HolderInfoForm', 'accountManager', profile.accountManagerId || ""));
      props.dispatch(change('HolderInfoForm', 'initialFee', profile.initialFee || ""));
      props.dispatch(change('HolderInfoForm', 'initialCredits', profile.initialCredits || ""));
      props.dispatch(change('HolderInfoForm', 'addlFee', profile.addlFee || ""));
      props.dispatch(change('HolderInfoForm', 'addlCredits', profile.addlCredits || ""));

      if (profile.portalURL !== "not available") {
        props.dispatch(change('HolderInfoForm', 'subdomain', profile.portalURL || ""));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    function previewFile() {
      const file = document.querySelector('input[type=file]').files[0];
      const reader = new FileReader();

      reader.onloadend = function () {
        let style = document.getElementById('upload-file-wrapper').style;
        style.background = `url(${reader.result})`;
        //style.backgroundSize = 'cover';
        style.backgroundSize = 'contain';
        style.backgroundRepeat = 'no-repeat';
        style.backgroundPosition = 'center';
      }

      if (file) {
        reader.readAsDataURL(file);
      } else {
        self.props.dispatch(change('HolderInfoForm', 'companyLogo', ""));
        const currentLogo = _.get(self.props, 'profile.logo', null);
        let style = document.getElementById('upload-file-wrapper').style;
        if (currentLogo) {
          style.background = `url(data:image/jpg;base64,${currentLogo})`;
          //style.backgroundSize = 'cover';
          style.backgroundSize = 'contain';
          style.backgroundRepeat = 'no-repeat';
          style.backgroundPosition = 'center';
        } else {
          style.background = "none";
        }
      }
    }

    previewFile();
  }

  onRemoveParent = () => {
    this.props.actions.setParentHolders([]);
  }

  searchParents = (filterTerm) => {
    let excludeHolderId = null;
    const { profile } = this.props;
    if (profile) excludeHolderId = profile.id;
    this.props.actions.fetchParentHolders(filterTerm, excludeHolderId);
  }

  renderFormField = (element, idx) => {
    const {
      name, label, ph, options, type,
      conditional, show, handleSearch, tipLabel,
      handleCallback,
    } = element;
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (handleSearch) {
      const { fetching, results, error } = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            resetOnClick
            name={name}
            placeholder={ph}
            fetching={fetching}
            results={results}
            handleSearch={handleSearch}
            fetchError={error}
            component={renderTypeAhead}
          />
        </div>
      );
    }

    if (type === 'removable') {
      const { valueText, disabled, onRemove } = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            valueText={valueText}
            component={renderRemovable}
            onRemove={onRemove}
            disabled={disabled}
          />
        </div>
      );
    }

    return (
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          tipLabel &&
          <span className="tip-span">
            {tipLabel}
          </span>
        }

        {
          options ? (
            <div className="select-wrapper">
              <Field
                name={name}
                component={renderSelect}
                options={options}
                callback={handleCallback? (val) => handleCallback(val) : null}
                defaultValue={name == 'country' && this.props.profile == null ? 'United States' : null}
              />
            </div>
          ) : (
              (type === 'currency') ? (
                <Field
                  name={name}
                  type="text"
                  placeholder={ph}
                  component={renderField}
                  {...currencyMask}
                />
              ) : (
                  <Field
                    name={name}
                    type="text"
                    placeholder={ph}
                    component={renderField}
                  />
                )
            )
        }
      </div>
    );
  }

  onDepartmentsChange = (id) => {
    if (id) {
      const queryParams = {
        departmentId: id,
      }
      this.props.departmentsAction.getDepartmentUsers(queryParams);
    } else {
      this.props.dispatch(change('HolderInfoForm', 'accountManager', ""));
      this.props.departmentsAction.setDepartmentUsers([]);
    }


  }

  render() {
    const {
      handleSubmit,
      currentParentHolder,
      currentCountry,
      currentSubdomain,
    } = this.props;

    const {
      labelPortalUrl,
      portalUrlSufix,
      labelHolderName,
      labelParentHolder,
      labelAddress1,
      labelAddress2,
      labelCity,
      labelState,
      labelPostalCode,
      labelCountry,
      labelDepartment,
      labelIntOfficeId,
      labelContactName,
      labelContactPhone,
      labelContactEmail,
      labelAccountManager,
      labelInitialFee,
      labelInitialCredits,
      labelAddlFee,
      labelAddlCredits,
      cancelButton,
      saveButton,
      selectManagerPlaceholder,
      selectCountryPlaceholder,
      labelCompanyLogo,
      departmentsPlaceholder,
    } = this.props.local.strings.holders.addHolderModal.holderInfoTab;

    const { fetchingParents, parentsList, errorHolders } = this.props.holders;
    const holderOptions = Utils.getOptionsList(null, parentsList, 'name', 'id', 'name');
    const countryOptions = Utils.getOptionsList(`-- ${selectCountryPlaceholder} --`, this.props.common.countries, 'name', 'name', 'name');
    const departmentsOptions = Utils.getOptionsList(`-- ${departmentsPlaceholder} --`, this.props.departments.list, 'name', 'id', 'name');
    const managerOptions = Utils.getOptionsList(`-- ${selectManagerPlaceholder} --`, this.props.departments.currentDepartmentUsers, 'Name', 'Id', 'name');

    const parent = currentParentHolder || null;
    const country = currentCountry || '';

    const { profile } = this.props.login;
    let canChangeParent = false;
    if (profile.CFRole) {
      canChangeParent = ([8, 10, 12].indexOf(profile.CFRole.Id) > -1);
    }

    const subdomain = currentSubdomain || 'subdomain';
    const companyLogoFieldLabel = _.get(this.props, 'currentForm.HolderInfoForm.values.companyLogo.name', labelCompanyLogo);

    const leftFields = [
      { name: 'holderName', label: labelHolderName, ph: `-- ${labelHolderName} --` },
      {
        name: 'parentHolder', label: labelParentHolder, ph: `-- ${labelParentHolder} --`,
        handleSearch: this.searchParents, fetching: fetchingParents, results: holderOptions,
        error: errorHolders, conditional: true, show: canChangeParent && !parent
      },
      {
        name: 'parentHolder', label: labelParentHolder, type: 'removable',
        valueText: parent ? parent.label : '', onRemove: this.onRemoveParent,
        disabled: !canChangeParent, conditional: true, show: parent
      },
      { name: 'address1', label: labelAddress1, ph: `-- ${labelAddress1} --` },
      { name: 'address2', label: labelAddress2, ph: `-- ${labelAddress2} --` },
      { name: 'city', label: labelCity, ph: `-- ${labelCity} --` },
      { name: 'state', label: labelState, ph: `-- ${labelState} --` },
      { name: 'postalCode', label: labelPostalCode, ph: `-- ${labelPostalCode} --` },
      { name: 'country', label: labelCountry, options: countryOptions },
      // { name: 'department', label: labelDepartment, ph: `-- ${labelDepartment} --` },
      { name: 'department', label: labelDepartment, options: departmentsOptions, handleCallback: this.onDepartmentsChange },
      { name: 'intOfficeID', label: labelIntOfficeId, ph: `-- ${labelIntOfficeId} --` },
    ]
    const rightFields = [
      { name: 'contactName', label: labelContactName, ph: `-- ${labelContactName} --` },
      { name: 'contactPhone', label: labelContactPhone, ph: `-- ${labelContactPhone} --` },
      { name: 'contactEmail', label: labelContactEmail, ph: `-- ${labelContactEmail} --` },
      { name: 'initialFee', label: labelInitialFee, ph: `-- ${labelInitialFee} --`, type: 'currency' },
      { name: 'initialCredits', label: labelInitialCredits, ph: `-- ${labelInitialCredits} --`, type: 'currency' },
      { name: 'addlFee', label: labelAddlFee, ph: `-- ${labelAddlFee} --`, type: 'currency' },
      { name: 'addlCredits', label: labelAddlCredits, ph: `-- ${labelAddlCredits} --`, type: 'currency' },
      { name: 'subdomain', label: labelPortalUrl, ph: `-- ${labelPortalUrl} --`, tipLabel: `${subdomain}${portalUrlSufix} ` },
      { name: 'accountManager', label: labelAccountManager, options: managerOptions },
    ];

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form wiz-form"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <div className="upload-file-wrapper">
                <label id="upload-file-wrapper" htmlFor="companyLogo">
                  {`${companyLogoFieldLabel}`}
                </label>
                <Field
                  name="companyLogo"
                  id="companyLogo"
                  component={fileInput}
                />
              </div>
            </div>
            <div className="col-md-8 col-sm-12">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  {leftFields.map(this.renderFormField)}
                </div>
                <div className="col-md-6 col-sm-12">
                  {rightFields.map(this.renderFormField)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="wiz-buttons">
          <a className="wiz-cancel-button" onClick={this.props.close}>{cancelButton}</a>
          <button className="wiz-continue-btn bg-sky-blue-gradient bn">{saveButton}</button>
        </div>

      </form>
    );
  }
};

HolderInfoForm = reduxForm({
  form: 'HolderInfoForm',
  validate,
  //asyncValidate,
  //asyncBlurFields: ['holderName'],
})(HolderInfoForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    holders: state.holders,
    common: state.common,
    login: state.login,
    currentParentHolder: formValueSelector('HolderInfoForm')(state, 'parentHolder'),
    currentCountry: formValueSelector('HolderInfoForm')(state, 'country'),
    currentSubdomain: formValueSelector('HolderInfoForm')(state, 'subdomain'),
    companyLogo: formValueSelector('HolderInfoForm')(state, 'companyLogo') || null,
    departments: state.departments,
    initialValues: {
      department: '',
      accountManager: '',
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(holdersActions, dispatch),
    departmentsAction: bindActionCreators(departmentsAction, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HolderInfoForm);
