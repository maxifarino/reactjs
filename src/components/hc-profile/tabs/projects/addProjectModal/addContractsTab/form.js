import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import Utils from '../../../../../../lib/utils';
import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';
import validate from './validation';

class AddContractsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };

    this.renderRows = this.renderRows.bind(this);

    if (props.project) {
      this.state.editing = true;
    }
  }

  componentDidUpdate(prevProps) {
    const {
      array,
      projects
    } = this.props;
    const { contracts } = projects;

    if (!_.isEmpty(contracts) && contracts !== prevProps.projects.contracts) {
      array.removeAll('rows');

      contracts.forEach((contract, index) => {
        array.insert('rows', index, {
          ...contract,
          startDate: Utils.getFormattedDateSmall(contract.startDate)
        })
      });
    }
  }

  render() {
    const {
      cancel,
      finishButton,
      saveButton
    } = this.props.local.strings.hcProfile.projects.addProjectModal.AddContractsTab;

    const buttonLabel = this.state.editing? saveButton:finishButton;

    return (
      <form className="add-contract-form"
        onSubmit={this.props.handleSubmit}
      >
        <div className="company-info-form wiz-form add-contract-fields">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <FieldArray name="rows" component={this.renderRows} />
              </div>
            </div>
          </div>
        </div>
        <div className="wiz-buttons">
          <a className="wiz-cancel-button" onClick={this.props.close}>{cancel}</a>
          <button disabled={this.props.isSubmitting ? 'disabled' : null} className="wiz-continue-btn bg-sky-blue-gradient bn">{buttonLabel}</button>
        </div>
      </form>
    );
  }

  renderRows({ fields }) {
    const {
      labelSubcontractor,
      labelAddButton,
      labelRemoveButton,
      labelContractNumber,
      labelContractAmount,
      labelStartDate,
      subcontractorPlaceholder
    } = this.props.local.strings.hcProfile.projects.addProjectModal.AddContractsTab;

    const listForSelectComponent = this.props.hcProfile.scListForSelectComponent;
    const scOptions = Utils.getOptionsList(subcontractorPlaceholder, listForSelectComponent, 'name', 'id', 'name');

    const rows = fields.map((row, index) => {
      return (
        <div className="row" key={index}>

          {
            this.state.editing? null:
              <div className="col-md-3 col-sm-12">
                <div className="admin-form-field-wrapper keywords-field">
                  <label htmlFor={`${row}.contractNumber`}>{labelSubcontractor}: </label>
                  <div className="select-wrapper" style={{ width: '100%'}}>
                    <Field
                      name={`${row}.subcontractorId`}
                      component={renderSelect}
                      options={scOptions} />
                  </div>
                </div>
              </div>
          }

          <div className="col-md-3 col-sm-12">
            <div className="wiz-field admin-form-field-wrapper">
              <label htmlFor={`${row}.number`}>
                {`${labelContractNumber}:`}
              </label>
              <Field
                name={`${row}.number`}
                type="text"
                placeholder={labelContractNumber}
                component={renderField} />
            </div>
          </div>

          <div className="col-md-3 col-sm-12">
            <div className="wiz-field admin-form-field-wrapper">
              <label htmlFor={`${row}.amount`}>
                {`${labelContractAmount}:`}
              </label>
              <Field
                name={`${row}.amount`}
                type="text"
                placeholder={labelContractAmount}
                component={renderField} />
            </div>
          </div>

          <div className="col-md-2 col-sm-12">
            <div className="wiz-field admin-form-field-wrapper">
              <label htmlFor={`${row}.startDate`}>
                {`${labelStartDate}:`}
              </label>
              <Field
                name={`${row}.startDate`}
                type="date"
                placeholder={labelStartDate}
                component={renderField} />
            </div>
          </div>

          <div className="col-md-1 col-sm-12">
            <button
              type="button"
              className="remove-contract-button btn btn-danger"
              title={labelRemoveButton}
              onClick={() => fields.remove(index)}>
              {labelRemoveButton}
              </button>
          </div>
        </div>
      )
    })

    return (
      <div>
        <div className="add-contract-rows">
          {rows}
        </div>
        <div className="row justify-content-center">
          <button
            className="add-contract-button btn btn-info col-md-6 col-sm-12"
            type="button"
            onClick={() => fields.push({})}>
            {labelAddButton}
          </button>
        </div>
      </div>
    )
  }
};

AddContractsForm = reduxForm({
  form: 'AddContractsForm',
  validate,
  initialValues: {
    rows: [{}]
  }
})(AddContractsForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    projects: state.projects,
    hcProfile: state.HCProfile
  };
};

export default connect(mapStateToProps)(AddContractsForm);
