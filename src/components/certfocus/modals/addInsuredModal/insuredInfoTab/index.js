import React from 'react';
import { connect } from 'react-redux';
import InsuredInfoForm from './form';

class InsuredInfoTab extends React.Component {

  submit(values) {
    this.props.continueHandler(values);
  };

  render() {
    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <InsuredInfoForm
            close={this.props.close}
            onSubmit={this.submit.bind(this)}
            profile={this.props.profile} />
          <div className="save-entity-modal-error">{this.props.insureds.addInsuredError}</div>
        </div>
      </section>
    );
  }

};

const mapStateToProps = (state, ownProps) => {
  return {
    insureds: state.insureds
  };
};

export default connect(mapStateToProps)(InsuredInfoTab);
