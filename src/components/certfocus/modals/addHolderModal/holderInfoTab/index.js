import React from 'react';
import { connect } from 'react-redux';
import HolderInfoForm from './form';

class HolderInfoTab extends React.Component {

  submit(values) {
    this.props.continueHandler(values);
  };

  render() {
    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <HolderInfoForm
            close={this.props.close}
            onSubmit={this.submit.bind(this)}
            profile={this.props.profile}
          />
          <div className="save-entity-modal-error">{this.props.holders.errorHolders}</div>
        </div>
      </section>
    );
  }

};

const mapStateToProps = (state, ownProps) => {
  return {
    holders: state.holders
  };
};

export default connect(mapStateToProps)(HolderInfoTab);
