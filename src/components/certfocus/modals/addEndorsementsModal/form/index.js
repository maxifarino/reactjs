import React, { Component } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../customInputs/renderField';
import validate from './validation';

class EndorsementInfoForm extends Component {
  componentDidMount() {
    const { endorsement, dispatch } = this.props;

    if (endorsement) {
      dispatch(change('EndorsementInfoForm', 'name', endorsement.Name || ''));      
      dispatch(change('EndorsementInfoForm', 'url', endorsement.URL || ''));
      dispatch(change('EndorsementInfoForm', 'code', endorsement.Code || ''));
      dispatch(change('EndorsementInfoForm', 'alwaysVisible', endorsement.AlwaysVisible));
    }
  }

  renderFormField(element, idx) {
    const { name, label, ph, type } = element;
    return (
      <div key={idx} className="admin-form-field-wrapper">
        <label htmlFor={name}>{`${label}:`}</label>
        <Field
          name={name}
          type={type || "text"}
          placeholder={ph}
          component={renderField} />
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    const {
      nameLabel,
      urlLabel,
      codeLabel,
      alwaysVisibleLabel,
      cancelButton,
      saveButton
    } = this.props.local.strings.endorsements.endorsementsList.addEndorsementModal;

    const fields = [
      { name: 'alwaysVisible', label: alwaysVisibleLabel, type: 'checkbox' },
      { name: 'code', label: codeLabel, ph: '-- Code --' },
      { name: 'name', label: nameLabel, ph: '-- Name--' },
      { name: 'url', label: urlLabel, ph: '-- URL --' }
    ];

    return (
      <form
        autoComplete="off"
        className="entity-info-form"
        onSubmit={handleSubmit} >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {this.props.endorsements.addEndorsementsError &&
          <div className="error-item-form">
            {this.props.endorsements.addEndorsementsError}
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

EndorsementInfoForm = reduxForm({
  form: 'EndorsementInfoForm',
  validate,
})(EndorsementInfoForm);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    endorsements: state.endorsements,
    common: state.common,
  };
};

export default connect(mapStateToProps)(EndorsementInfoForm);
