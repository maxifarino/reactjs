import React, { Component } from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as insuredActions from '../../../insureds/actions';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import Utils from '../../../../../lib/utils';
import validate from './validation';
import AddInsuredModal from '../../addInsuredModal/index';
import { Modal } from 'react-bootstrap';

class AddProjectInsuredForm extends Component {
  constructor(props) {
    super(props);
    const { projectInsured } = props;
    if (projectInsured) {
      const { InsuredID, InsuredName, ComplianceStatusID } = projectInsured;
      props.dispatch(change('AddProjectInsuredForm', 'insured', {label:InsuredName, value:InsuredID}));
      props.dispatch(change('AddProjectInsuredForm', 'status', ComplianceStatusID || ''));
    }
		props.insuredActions.resetTypeAheadResults();
		this.state = {
			showModalCreateTenant: false,
		}
  }

  searchInsured = (filterTerm) => {
    const payload = {
      insuredName: filterTerm,
      holderId: this.props.holderId
    }
    this.props.insuredActions.fetchInsuredsByHolder(payload);
  }

  renderFormField = (element, idx) => {
    const { type, name, label, ph, options, conditional, show } = element;
    const fieldType = type || 'text';
    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    if (fieldType === 'typeAhead') {
      const { fetching, results, error, handleSearch } = element;

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
    } else if (fieldType === 'removable') {
      const { valueText, disabled } = element;
      return (
        <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
          <label htmlFor={name}>{`${label}:`}</label>
          <Field
            name={name}
            valueText={valueText}
            component={renderRemovable}
            disabled={disabled}
          />
        </div>
      );
		}

    return (
      <div key={idx} className="wiz-field admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        {
          options?
          <div className="select-wrapper">
            <Field
              name={name}
              component={renderSelect}
              options={options} />
          </div>
          :
          <Field
            name={name}
            type={fieldType}
            placeholder={ph}
            component={renderField} />
        }
      </div>
    );
	}

	closeModal = () => {
		this.setState({ showModalCreateTenant: false })
	};
	
	openModal = () => {
		this.setState({ showModalCreateTenant: true })
	};

  render() {
    const { handleSubmit, insuredCurrentValue } = this.props;
    const {
      labelInsured,
      labelStatus,
      labelSearch,
      cancelButton,
			saveButton,
			titleAddTenant
    } = this.props.local.strings.projectInsureds.addProjectinsuredsModal;
    const {
      typeAheadResults,
      typeAheadFetching,
      typeAheadError,
    } = this.props.insuredsReducer;

    const insuredOptions = Utils.getOptionsList(null, typeAheadResults, 'InsuredName', 'Id', 'InsuredName');
    const complianceStatusOptions = Utils.getOptionsList(`-- ${labelStatus} --`, this.props.common.complianceStatus, 'StatusName', 'ProjectInsuredComplianceStatusID', 'StatusName');

    const fields = [
      {
        name: 'insured', label: labelInsured, ph: `--${labelSearch}--`, type: 'typeAhead',
        handleSearch: this.searchInsured, fetching: typeAheadFetching, results: insuredOptions,
        error: typeAheadError, conditional: true, show: !insuredCurrentValue
      },
      {
        name: 'insured', label: labelInsured, type: 'removable', conditional: true,
        show: insuredCurrentValue, valueText: insuredCurrentValue ? insuredCurrentValue.label:'', disabled: this.props.projectInsured
      },
    ];

    if (this.props.projectInsured) {
      fields.push({ name: 'status', label: labelStatus, options: complianceStatusOptions })
    }

    return (
      <form
        onSubmit={handleSubmit}
        className="entity-info-form" >

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {
          this.props.projectInsureds.errorPostProjectInsured &&
          <div className="error-item-form">
            { this.props.projectInsureds.errorPostProjectInsured }
          </div>
        }

        <div className="add-item-bn">
					<button
						className="bn bn-small bg-green-dark-gradient create-item-bn icon-add"
						onClick={this.openModal}
						style={{ marginRight: '10px' }}
					>
            {titleAddTenant}
          </button>
          <button
            className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
            type="submit" >
            {saveButton}
          </button>
          <a
            className="cancel-add-item"
            onClick={this.props.close} >
            {cancelButton}
          </a>
        </div>
				<Modal
					show={this.state.showModalCreateTenant}
					onHide={this.closeModal}
					className="add-item-modal add-hc"
				>
					<Modal.Body className="add-item-modal-body mt-0">
						<AddInsuredModal
							close={this.closeModal}
							onHide={this.closeModal}
						/>
					</Modal.Body>
				</Modal>
      </form>
    );
  }
};

AddProjectInsuredForm = reduxForm({
  form: 'AddProjectInsuredForm',
  validate
})(AddProjectInsuredForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    insuredsReducer: state.insureds,
    common: state.common,
    projectInsureds: state.projectInsureds,
    insuredCurrentValue: formValueSelector('AddProjectInsuredForm')(state, 'insured'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    insuredActions: bindActionCreators(insuredActions, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(AddProjectInsuredForm);
