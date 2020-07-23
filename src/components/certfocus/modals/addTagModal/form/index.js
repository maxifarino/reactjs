import React from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux';

import renderField from '../../../../customInputs/renderField';
//import asyncValidate from './asyncValidation';
import validate from './validation';

class TagInfoForm extends React.Component {
  constructor(props) {
    super(props);

    const { tag } = this.props;
    if (tag) {
      props.dispatch(change('TagInfoForm', 'name', tag.tagName));
      props.dispatch(change('TagInfoForm', 'order', tag.CFdisplayOrder));
      props.dispatch(change('TagInfoForm', 'archived', tag.CFdeletedFlag));
    }

    this.renderFormField = this.renderFormField.bind(this);
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
    const {handleSubmit} = this.props;
    const {
      labelName,
      labelOrder,
      labelArchived,
      cancelButton,
      saveButton
    } = this.props.local.strings.tags.addTagModal;

    const fields = [
      {name:'name', label:labelName, ph:'--tag name--'},
      {name:'order', label:labelOrder, ph:'--display order--', type:'number'},
      {name:'archived', label:labelArchived, type:'checkbox'},
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

        {
          this.props.tags.errorPostTag &&
          <div className="error-item-form">
            { this.props.tags.errorPostTag }
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

TagInfoForm = reduxForm({
  form: 'TagInfoForm',
  validate,
  //asyncValidate,
  //asyncBlurFields: ['email'],
})(TagInfoForm);

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    tags: state.tags,
    common: state.common,
  };
};

export default connect(mapStateToProps)(TagInfoForm);
