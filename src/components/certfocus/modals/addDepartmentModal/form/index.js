import React, {Component} from 'react';
import {Field, reduxForm, change} from "redux-form";
import {connect} from "react-redux";

import validate from "./validation";
import renderField from "../../../../customInputs/renderField";

class DepartmentForm extends Component {

  constructor(props) {
    super(props);

    const {currentItem} = this.props;
    if (currentItem) {
      props.dispatch(change('DepartmentForm','name',currentItem.name))
      props.dispatch(change('DepartmentForm','archived',currentItem.archived))
    }
  }

  renderFormField = (element, idx) => {
    const {
      name,
      label,
      ph,
      type,
      conditional,
      show,
    } = element;

    const style = {};
    if (conditional && !show) {
      style.display = 'none';
    }

    return (
      <div key={idx} className="admin-form-field-wrapper" style={style}>
        <label htmlFor={name}>{`${label}:`}</label>
        <Field
          name={name}
          type={type || "text"}
          placeholder={ph}
          component={renderField}
        />
      </div>
    );
  }

  render() {

    const {handleSubmit} = this.props;

    const {
      departmentName,
      archived,
      cancelButton,
      saveButton,
    } = this.props.locale.form;

    const {
      fetching,
    } = this.props.departments;

    let fields = [
      { name: 'name', label: departmentName.label, ph: departmentName.ph },
    ];

    return (
      <form
        autoComplete="off"
        className="entity-info-form"
        onSubmit={handleSubmit}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {fields.map(this.renderFormField)}
            </div>
          </div>
        </div>

        {fetching? (
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        ) : (
          <div className="add-item-bn">
            <button
              className="bn bn-small bg-green-dark-gradient create-item-bn icon-save"
              type="submit"
            >
              {saveButton}
            </button>
            <a
              className="cancel-add-item"
              onClick={this.props.close} >
              {cancelButton}
            </a>
          </div>
        )}


      </form>
    );
  }
}

DepartmentForm = reduxForm({
  form: 'DepartmentForm',
  validate,
})(DepartmentForm);

const mapStateToProps = (state) => {
  return {
    locale: state.localization.strings.departments,
    departments: state.departments,
  }
}

export default connect(mapStateToProps)(DepartmentForm);