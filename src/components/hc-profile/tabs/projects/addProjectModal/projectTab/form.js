import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderField from '../../../../../customInputs/renderField';
import renderSelect from '../../../../../customInputs/renderSelect';

import Utils from '../../../../../../lib/utils';
import validate from './validation';

class AddProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };

    if (props.project) {
      this.state.editing = true;
      props.change('projectName', props.project.name);
      props.change('projectStatus', props.project.statusId);
    }
  }

  render() {
    const {handleSubmit} = this.props;

    const {
      labelProjectName,
      labelProjectStatus,
      cancel,
      continueButton,
      saveButton
    } = this.props.local.strings.hcProfile.projects.addProjectModal.projectTab;

    const buttonLabel = this.state.editing? saveButton:continueButton;
    const projectStatusOptions = Utils.getOptionsList('', this.props.projects.projectStatusOptions, 'status', 'id', 'id');

    return (

      <form
        onSubmit={handleSubmit}
        className="project-form company-info-form wiz-form"
      >

        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="wiz-field admin-form-field-wrapper d-flex flex-row justify-content-center align-items-center">
                <label htmlFor="projectName" className="label col-3 p-2">
                  {`${labelProjectName}:`}
                </label>
                <div className="col-4 p-2">
                  <Field
                    name="projectName"
                    type="text"
                    placeholder={labelProjectName}
                    component={renderField} />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="wiz-field admin-form-field-wrapper d-flex flex-row justify-content-center align-items-center">
                <label htmlFor="projectStatus" className="label col-3 p-2">
                  {`${labelProjectStatus}:`}
                </label>
                <div className="col-4 p-2">
                  <Field
                    name="projectStatus"
                    placeholder={labelProjectStatus}
                    component={renderSelect}
                    options={projectStatusOptions} />
                </div>
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
};

AddProjectForm = reduxForm({
  form: 'AddProjectForm',
  validate
})(AddProjectForm);

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    projects: state.projects
  };
};

export default connect(mapStateToProps)(AddProjectForm);
