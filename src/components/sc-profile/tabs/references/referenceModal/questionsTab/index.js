import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Form, Field } from 'redux-form';
import _ from 'lodash';

import renderField from '../../../../../customInputs/renderField';

import './questionsTab.css';

class QuestionsTab extends React.Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  submit(data) {
    this.props.continueHandler(data);
  };

  render() {
    const {
      saveButton
    } = this.props.local.strings.scProfile.references.modal;

    return (
      <Form className="noteForm question-tab" onSubmit={this.props.handleSubmit(this.submit)}>
        <div className="question-tab-content container-fluid filter-fields">
          {this.renderQuestions()}
          <div className="wiz-buttons">
            <button disabled={this.props.isSubmitting ? 'disabled' : null} className="wiz-continue-btn bg-sky-blue-gradient bn">{saveButton}</button>
          </div>
          <div className="save-hc-modal-error">{this.props.references.error}</div>
        </div>
      </Form>
    );
  }

  renderQuestions() {
    /*const {
      fileInputLabel
    } = this.props.local.strings.scProfile.references.modal;
    const fileLabel1 = _.get(this.props, 'reduxForm.QuestionsTabForm.values.documentFile1.name');*/

    const questions = _.filter(this.props.references.questions, { referenceTypeId: _.toInteger(this.props.referenceTypeId) });

    return questions.map((question, index) => {
      return (
        <div className="question" key={index}>
          <div className="row">
            <div className="col-sm-12 no-padd">
              <div className="admin-form-field-wrapper">
                <div className="question-tab-label">{question.question} :</div>
                <Field
                  type="textarea"
                  name={`questions.${question.id}.response`}
                  component={renderField}
                  className="description-input"
                  defaultValue={this.getDefaultValue(question)}
                />
                <Field
                  type="hidden"
                  name={`questions.${question.id}.id`}
                  component={renderField}
                  defaultValue={question.id}
                />
              </div>
            </div>
          </div>

          {/*<div className="row">
            <div className="col-sm-12 no-padd">
              <div className="upload-file-wrapper">
                <label htmlFor="documentFile4" className='file-input'>
                  {fileLabel1 || fileInputLabel}
                </label>
                <Field
                  name="documentFile4"
                  id="documentFile4"
                  component={fileInput}
                />
              </div>
            </div>
          </div>*/}
        </div>
      );
    })
  }

  getDefaultValue(question) {
    let defaultValue;

    if (this.props.currentReference) {
      const answer = _.find(this.props.references.answers, { referenceQuestionId: question.id });
      defaultValue = _.get(answer, 'response');
    }
    return defaultValue || '';
  }
};

QuestionsTab = reduxForm({
  form: 'QuestionsTabForm'
})(QuestionsTab);

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    reduxForm: state.form,
    references: state.references
  };
};

export default connect(mapStateToProps)(QuestionsTab);
