import React, { Component } from 'react';
import { Field, reduxForm, change, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import renderField from '../../../../customInputs/renderField';
import renderSelect from '../../../../customInputs/renderSelect';
import renderRemovable from '../../../../customInputs/renderRemovable';
import renderTypeAhead from '../../../../customInputs/renderTypeAhead';
import Utils from '../../../../../lib/utils';

import * as actions from '../../../settings/documentQueueDefinitions/actions';
import * as commonActions from '../../../../common/actions';

import validate from './validation';

class AddDocumentQueueUsersForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    }
  }

  componentDidMount() {
  }

  renderFormField = (element, idx) => {
    const { type, name, label, ph, options, conditional, show, onChange } = element;
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
              options={options}
              onChange={onChange} />
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

  onChangeUserRole = (e) => {
    const { value } = e.target;
    const { setLoading } = this.props.commonActions;
    if (value) {
      setLoading(true);
      this.props.actions.fetchAvailableUsersByRole({ userRoleId: value }, (users) => {
        this.setState({ users: users });
        setLoading(false);
      });
    }
  }

  render() {
    const { 
      handleSubmit,
    } = this.props;
    
    const {
      userLabel,
      userRoleLabel,
      cancelButton,
      saveButton
    } = this.props.local.strings.documentQueueDefinitions.documentQueueUsers.addDocumentQueueUsersModal;
    
    const userRoleOptions = [
      { label: 'Processor', value: 14 }, 
      { label: 'Data Entry Clerk', value: 15 }
    ];

    const userIdOptions = Utils.getOptionsList(`-- Select ${userLabel} --`, this.state.users, 'UserName', 'UserId', 'UserName');

    const fields = [
      { name: 'userRole', label: userRoleLabel, ph: `-- Select ${userRoleLabel} --`, options: userRoleOptions, onChange: this.onChangeUserRole },
      { name: 'userId', label: userLabel, options: userIdOptions },
    ];

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
          this.props.documentQueueDefinitions.errorPostDocumentQueueUser &&
          <div className="error-item-form">
            { this.props.documentQueueDefinitions.errorPostDocumentQueueUser }
          </div>
        }

        <div className="add-item-bn">
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

      </form>
    );
  }
};

AddDocumentQueueUsersForm = reduxForm({
  form: 'AddDocumentQueueUsersForm',
  validate
})(AddDocumentQueueUsersForm);

const mapStateToProps = (state) => {
  return {
    currentForm: state.form,
    local: state.localization,
    common: state.common,
    documentQueueDefinitions: state.documentQueueDefinitions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    commonActions: bindActionCreators(commonActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocumentQueueUsersForm);
