import React from 'react';
import { connect } from 'react-redux';
import serialize  from 'form-serialize';
import { addSerializedHcData } from '../../actions';
import CompanyInfoForm from './form';

class CompanyInfoTab extends React.Component {

  submit() {
    let form = document.querySelector('.company-info-form');
    let _serializedHcObj = serialize(form, { hash: true });
    this.props.addSerializedHcData({ companyInfo: _serializedHcObj });
    this.props.continueHandler();
  };

  render() {
    const {
      title
    } = this.props.local.strings.hiringClients.addHCModal.companyInfoTab;

    return (
      <section className="wiz-step white-section">
        <div className="admin-form-field-wrapper">
          <h2 className="step-title">{title}</h2>
          <CompanyInfoForm
            close={this.props.close}
            onSubmit={this.submit.bind(this)}
            profile={this.props.profile} />
          <div className="save-hc-modal-error">{this.props.hc.errorHC}</div>
        </div>
      </section>
    );
  }

};

const mapStateToProps = (state, ownProps) => {
  return {
    local: state.localization,
    hc: state.hc,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSerializedHcData: (serializedHcObj) => {
      dispatch(addSerializedHcData(serializedHcObj))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfoTab);
