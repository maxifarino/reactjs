import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, Form } from 'redux-form';

import renderField from '../../../customInputs/renderField';
import validate from './validation';
import * as actions from '../../actions';

import './changeBasicData.css';

class ChangeBasicDataModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false
    }

    this.onSave = this.onSave.bind(this);
  };

  componentDidMount() {
    this.props.change('contactFullName', this.props.scProfile.headerDetails.contactFullName);
    this.props.change('contactEmail', this.props.scProfile.headerDetails.mainEmail);
    this.props.change('contactPhone', this.props.scProfile.headerDetails.phone);
  }

  onSave(data) {
    this.setState({ processing: true });
    const { scId, hcId } = this.props
    const payload = {
      subcontractorId: scId,
      ...data
    };

    this.props.actions.changeBasicData(payload, (success) => {
      if (success) {
        this.props.successCallback(this.props.close);
      } else {
        this.setState({ processing: false });
      }
    });

  }

  render() {
    const {
      title,
      labelContactName,
      labelMail,
      labelPhone,
      cancelBtn,
      saveBtn
    } = this.props.local.strings.scProfile.changeBasicDataModal;

    const {
      handleSubmit
    } = this.props;

    return (
      <div className="change-basic-data-modal">
        <header className="change-status-modal-header">{title}</header>

        <Form className="change-status-content container-fluid filter-fields" onSubmit={handleSubmit(this.onSave)}>
          <div className="row">
            <div className="col-md-12">
              {
                this.state.processing?
                  <div className="spinner-wrapper">
                    <div className="spinner"></div>
                  </div>
                  :
                  <div className="statusContainer">
                    <div className="sc-fields-list">

                      <div className="sc-row-field-wrapper">
                        <label htmlFor="contactFullName">
                          {labelContactName}
                        </label>
                        <Field
                          name="contactFullName"
                          type="text"
                          component={renderField}
                        />
                      </div>

                      <div className="sc-row-field-wrapper">
                        <label htmlFor="contactEmail">
                          {labelMail}
                        </label>
                        <Field
                          name="contactEmail"
                          type="email"
                          component={renderField}
                        />
                      </div>

                      <div className="sc-row-field-wrapper">
                        <label htmlFor="contactPhone">
                          {labelPhone}
                        </label>
                        <Field
                          name="contactPhone"
                          type="text"
                          component={renderField}
                        />
                      </div>
                    </div>
                  </div>
              }
            </div>
          </div>

          {
            !this.state.processing?
              <div className="text-right">
                <button type="button" className="bg-sky-blue-gradient bn" onClick={this.props.close}>{cancelBtn}</button>
                <button type="submit" className="bg-sky-blue-gradient bn action-button" >{saveBtn}</button>
              </div>
              :
              null
          }

        </Form>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    sc: state.sc,
    local: state.localization,
    scProfile: state.SCProfile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

ChangeBasicDataModal = reduxForm({
  form: 'ChangeBasicDataModal',
  validate
})(ChangeBasicDataModal);

export default connect(mapStateToProps, mapDispatchToProps)(ChangeBasicDataModal);
